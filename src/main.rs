//! Builds the static website from `site/` into `dist/` (ready for GitHub Pages).
//!
//! Pages are HTML files in `site/pages/` with a short header (`title:`, `description:`, `path:`,
//! `active:`, optional `cta: no`) above a `---` line. `site/layout.html` wraps every page. Text in
//! double braces is replaced while building:
//!
//! | Placeholder | Becomes |
//! |---|---|
//! | `{{base}}` | relative path to the site root (`./` or `../`) |
//! | `{{site.KEY}}` | value from `site/site.txt` |
//! | `{{page.title}}`, `{{page.description}}` | from the page header |
//! | `{{body}}`, `{{cta}}` | the page itself, `site/cta.html` unless the page says `cta: no` |
//! | `{{active:NAME}}` | marks the navigation link of the page whose `active:` is NAME |
//! | `{{icon:NAME}}`, `{{icon:NAME:SIZE}}` | an inline SVG from `site/icons.txt` |
//! | `{{screen:KEY\|ALT}}` | `site/screens/KEY.png` with its size read from the file |
//!
//! An unknown placeholder or a missing file stops the build with an error. No JavaScript is
//! generated or shipped.

use std::collections::BTreeMap;
use std::fmt;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::ExitCode;

fn main() -> ExitCode {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    match build(&root.join("site"), &root.join("dist")) {
        Ok(pages) => {
            for p in pages {
                println!("page /{p}");
            }
            println!("done → {}", root.join("dist").display());
            ExitCode::SUCCESS
        }
        Err(e) => {
            eprintln!("error: {e}");
            ExitCode::FAILURE
        }
    }
}

#[derive(Debug)]
struct Error(String);

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.0)
    }
}

type Result<T> = std::result::Result<T, Error>;

fn err<T>(msg: impl Into<String>) -> Result<T> {
    Err(Error(msg.into()))
}

fn read(path: &Path) -> Result<String> {
    fs::read_to_string(path).map_err(|e| Error(format!("{}: {e}", path.display())))
}

fn io<T>(path: &Path, r: std::io::Result<T>) -> Result<T> {
    r.map_err(|e| Error(format!("{}: {e}", path.display())))
}

/// Builds the site; returns the paths of the written pages.
fn build(site: &Path, out: &Path) -> Result<Vec<String>> {
    let s = Site::load(site)?;
    let mut pages = Vec::new();
    let mut screens = Vec::new();
    let rendered = s.render_all(&mut screens)?;
    if out.exists() {
        io(out, fs::remove_dir_all(out))?;
    }
    for (path, html) in rendered {
        let dir = out.join(&path);
        io(&dir, fs::create_dir_all(&dir))?;
        let file = dir.join("index.html");
        io(&file, fs::write(&file, html))?;
        pages.push(path);
    }
    let assets = out.join("assets");
    copy(&site.join("styles.css"), &assets.join("styles.css"))?;
    for dir in ["brand", "fonts"] {
        copy_dir(&site.join(dir), &assets.join(dir))?;
    }
    for key in screens {
        let name = format!("{key}.png");
        copy(
            &site.join("screens").join(&name),
            &assets.join("screens").join(&name),
        )?;
    }
    let nojekyll = out.join(".nojekyll");
    io(&nojekyll, fs::write(&nojekyll, ""))?;
    Ok(pages)
}

fn copy(from: &Path, to: &Path) -> Result<()> {
    if let Some(dir) = to.parent() {
        io(dir, fs::create_dir_all(dir))?;
    }
    io(from, fs::copy(from, to)).map(|_| ())
}

fn copy_dir(from: &Path, to: &Path) -> Result<()> {
    let mut entries: Vec<_> = io(from, fs::read_dir(from))?
        .filter_map(|e| e.ok())
        .map(|e| e.path())
        .filter(|p| p.is_file())
        .collect();
    entries.sort();
    for p in entries {
        if let Some(name) = p.file_name() {
            copy(&p, &to.join(name))?;
        }
    }
    Ok(())
}

/// One page from `site/pages/`.
#[derive(Debug, Clone)]
struct Page {
    /// Output directory relative to the site root: `` for the home page, `roadmap/`, …
    path: String,
    title: String,
    description: String,
    active: String,
    cta: bool,
    body: String,
}

impl Page {
    fn parse(name: &str, text: &str) -> Result<Page> {
        let Some((head, body)) = text.split_once("\n---\n") else {
            return err(format!("{name}: header must end with a line `---`"));
        };
        let mut fields = BTreeMap::new();
        for line in head.lines().filter(|l| !l.trim().is_empty()) {
            let Some((k, v)) = line.split_once(':') else {
                return err(format!("{name}: header line without `:`: {line}"));
            };
            fields.insert(k.trim().to_owned(), v.trim().to_owned());
        }
        let mut take = |k: &str| fields.remove(k).unwrap_or_default();
        let page = Page {
            path: take("path"),
            title: take("title"),
            description: take("description"),
            active: take("active"),
            cta: take("cta") != "no",
            body: body.strip_suffix('\n').unwrap_or(body).to_owned(),
        };
        if let Some(k) = fields.keys().next() {
            return err(format!("{name}: unknown header field `{k}`"));
        }
        if page.title.is_empty() {
            return err(format!("{name}: `title:` is missing"));
        }
        if !(page.path.is_empty() || page.path.ends_with('/')) || page.path.contains("..") {
            return err(format!("{name}: `path:` must be empty or end with `/`"));
        }
        Ok(page)
    }

    /// Relative path from this page to the site root.
    fn base(&self) -> String {
        if self.path.is_empty() {
            "./".to_owned()
        } else {
            "../".repeat(self.path.matches('/').count())
        }
    }
}

/// An icon from `site/icons.txt`.
#[derive(Debug, Clone)]
enum Icon {
    /// Stroke icon on the 24 grid: default size, extra CSS class, inner SVG.
    Stroke {
        size: u32,
        class: String,
        body: String,
    },
    /// A complete SVG element; `{{size}}` inside is replaced by the size.
    Raw { size: u32, svg: String },
}

impl Icon {
    fn render(&self, size: Option<u32>) -> String {
        match self {
            Icon::Stroke {
                size: d,
                class,
                body,
            } => {
                let s = size.unwrap_or(*d);
                let class = if class.is_empty() {
                    "icon".to_owned()
                } else {
                    format!("icon {class}")
                };
                format!(
                    r#"<svg class="{class}" width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{body}</svg>"#
                )
            }
            Icon::Raw { size: d, svg } => svg.replace("{{size}}", &size.unwrap_or(*d).to_string()),
        }
    }
}

/// Everything in `site/` that pages are built from.
struct Site {
    dir: PathBuf,
    values: BTreeMap<String, String>,
    icons: BTreeMap<String, Icon>,
    layout: String,
    cta: String,
    pages: Vec<Page>,
}

impl Site {
    fn load(dir: &Path) -> Result<Site> {
        let mut values = parse_values(&read(&dir.join("site.txt"))?)?;
        // Values may use other values: `issues = {{site.repo}}/issues`.
        for _ in 0..4 {
            let snapshot = values.clone();
            for v in values.values_mut() {
                for (k, x) in &snapshot {
                    *v = v.replace(&format!("{{{{site.{k}}}}}"), x);
                }
            }
        }
        let icons = parse_icons(&read(&dir.join("icons.txt"))?)?;
        let pages_dir = dir.join("pages");
        let mut files: Vec<PathBuf> = io(&pages_dir, fs::read_dir(&pages_dir))?
            .filter_map(|e| e.ok())
            .map(|e| e.path())
            .filter(|p| p.extension().is_some_and(|x| x == "html"))
            .collect();
        files.sort();
        let mut pages = Vec::new();
        for f in files {
            let name = f
                .file_name()
                .map(|n| n.to_string_lossy().into_owned())
                .unwrap_or_default();
            pages.push(Page::parse(&name, &read(&f)?)?);
        }
        for (i, p) in pages.iter().enumerate() {
            if pages[..i].iter().any(|q| q.path == p.path) {
                return err(format!("two pages with path `{}`", p.path));
            }
        }
        Ok(Site {
            dir: dir.to_owned(),
            values,
            icons,
            layout: read(&dir.join("layout.html"))?,
            cta: read(&dir.join("cta.html"))?,
            pages,
        })
    }

    /// Renders every page; `screens` collects the screenshots they use.
    fn render_all(&self, screens: &mut Vec<String>) -> Result<Vec<(String, String)>> {
        self.pages
            .iter()
            .map(|p| Ok((p.path.clone(), self.render(p, screens)?)))
            .collect()
    }

    fn render(&self, page: &Page, screens: &mut Vec<String>) -> Result<String> {
        let html = self
            .layout
            .replace("{{body}}", &page.body)
            .replace("{{cta}}", if page.cta { &self.cta } else { "" });
        self.expand(&html, page, screens)
            .map_err(|e| Error(format!("page `/{}`: {e}", page.path)))
    }

    fn expand(&self, text: &str, page: &Page, screens: &mut Vec<String>) -> Result<String> {
        let mut out = String::with_capacity(text.len());
        let mut rest = text;
        while let Some(start) = rest.find("{{") {
            out.push_str(&rest[..start]);
            let after = &rest[start + 2..];
            let Some(end) = after.find("}}") else {
                return err("`{{` without `}}`");
            };
            out.push_str(&self.placeholder(&after[..end], page, screens)?);
            rest = &after[end + 2..];
        }
        out.push_str(rest);
        Ok(out)
    }

    fn placeholder(&self, token: &str, page: &Page, screens: &mut Vec<String>) -> Result<String> {
        let (name, arg) = token.split_once(':').unwrap_or((token, ""));
        match (name, arg) {
            ("base", "") => Ok(page.base()),
            ("page.title", "") => Ok(page.title.clone()),
            ("page.description", "") => Ok(page.description.clone()),
            ("active", nav) => Ok(if !nav.is_empty() && nav == page.active {
                r#" class="is-active" aria-current="page""#.to_owned()
            } else {
                String::new()
            }),
            ("icon", spec) => {
                let (icon, size) = match spec.split_once(':') {
                    Some((i, s)) => match s.parse::<u32>() {
                        Ok(n) if (1..=512).contains(&n) => (i, Some(n)),
                        _ => return err(format!("bad icon size in `{{{{{token}}}}}`")),
                    },
                    None => (spec, None),
                };
                match self.icons.get(icon) {
                    Some(i) => Ok(i.render(size)),
                    None => err(format!("unknown icon `{icon}`")),
                }
            }
            ("screen", spec) => {
                let (key, alt) = spec.split_once('|').unwrap_or((spec, ""));
                self.screen(key, alt, &page.base(), screens)
            }
            (key, "") if key.starts_with("site.") => match self.values.get(&key[5..]) {
                Some(v) => Ok(v.clone()),
                None => err(format!("`{key}` is not set in site.txt")),
            },
            _ => err(format!("unknown placeholder `{{{{{token}}}}}`")),
        }
    }

    fn screen(
        &self,
        key: &str,
        alt: &str,
        base: &str,
        screens: &mut Vec<String>,
    ) -> Result<String> {
        if key.is_empty()
            || !key
                .chars()
                .all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_')
        {
            return err(format!("bad screenshot name `{key}`"));
        }
        if alt.trim().is_empty() {
            return err(format!("screenshot `{key}` needs a description after `|`"));
        }
        let file = self.dir.join("screens").join(format!("{key}.png"));
        let bytes = io(&file, fs::read(&file))?;
        let Some((w, h)) = png_size(&bytes) else {
            return err(format!("{}: not a PNG file", file.display()));
        };
        if !screens.iter().any(|s| s == key) {
            screens.push(key.to_owned());
        }
        Ok(format!(
            r#"<img class="screen-img is-real" src="{base}assets/screens/{key}.png" alt="{alt}" width="{w}" height="{h}" loading="lazy" decoding="async">"#
        ))
    }
}

/// `key = value` lines; `#` starts a comment line.
fn parse_values(text: &str) -> Result<BTreeMap<String, String>> {
    let mut map = BTreeMap::new();
    for line in text
        .lines()
        .map(str::trim)
        .filter(|l| !l.is_empty() && !l.starts_with('#'))
    {
        let Some((k, v)) = line.split_once('=') else {
            return err(format!("site.txt: line without `=`: {line}"));
        };
        map.insert(k.trim().to_owned(), v.trim().to_owned());
    }
    Ok(map)
}

/// `name size class body` lines (class `-` for none), or `name size raw <svg …>`.
fn parse_icons(text: &str) -> Result<BTreeMap<String, Icon>> {
    let mut map = BTreeMap::new();
    for line in text
        .lines()
        .map(str::trim)
        .filter(|l| !l.is_empty() && !l.starts_with('#'))
    {
        let mut parts = line.splitn(4, ' ');
        let (Some(name), Some(size), Some(class), Some(body)) =
            (parts.next(), parts.next(), parts.next(), parts.next())
        else {
            return err(format!(
                "icons.txt: expected `name size class body`: {line}"
            ));
        };
        let Ok(size) = size.parse::<u32>() else {
            return err(format!("icons.txt: bad size in: {line}"));
        };
        let icon = if class == "raw" {
            Icon::Raw {
                size,
                svg: body.to_owned(),
            }
        } else {
            let class = if class == "-" {
                String::new()
            } else {
                class.to_owned()
            };
            Icon::Stroke {
                size,
                class,
                body: body.to_owned(),
            }
        };
        map.insert(name.to_owned(), icon);
    }
    Ok(map)
}

/// Width and height from a PNG header.
fn png_size(b: &[u8]) -> Option<(u32, u32)> {
    const SIGNATURE: &[u8] = b"\x89PNG\r\n\x1a\n";
    if b.get(..8)? != SIGNATURE || b.get(12..16)? != b"IHDR" {
        return None;
    }
    let w = u32::from_be_bytes(b.get(16..20)?.try_into().ok()?);
    let h = u32::from_be_bytes(b.get(20..24)?.try_into().ok()?);
    Some((w, h))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn site() -> PathBuf {
        PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("site")
    }

    #[test]
    fn the_site_builds_and_every_placeholder_resolves() {
        let s = Site::load(&site()).unwrap();
        let mut screens = Vec::new();
        let pages = s.render_all(&mut screens).unwrap();
        assert!(pages.iter().any(|(p, _)| p.is_empty()), "no home page");
        for (path, html) in &pages {
            assert!(!html.contains("{{"), "/{path}: placeholder left");
            assert!(
                !html.contains("<script"),
                "/{path}: the site ships no JavaScript"
            );
            assert!(html.starts_with("<!doctype html>"), "/{path}");
        }
    }

    #[test]
    fn internal_links_point_to_pages_or_assets() {
        let s = Site::load(&site()).unwrap();
        let mut screens = Vec::new();
        let pages = s.render_all(&mut screens).unwrap();
        let paths: Vec<&str> = pages.iter().map(|(p, _)| p.as_str()).collect();
        for (path, html) in &pages {
            let base = "../".repeat(path.matches('/').count());
            let base = if base.is_empty() {
                "./".to_owned()
            } else {
                base
            };
            for target in html
                .split("href=\"")
                .skip(1)
                .filter_map(|r| r.split('"').next())
            {
                let Some(rel) = target.strip_prefix(&base) else {
                    continue;
                };
                let rel = rel.split('#').next().unwrap_or_default();
                if let Some(asset) = rel.strip_prefix("assets/") {
                    let ok = asset == "styles.css" || site().join(asset).is_file();
                    assert!(ok, "/{path}: missing asset {target}");
                } else {
                    assert!(paths.contains(&rel), "/{path}: no page for {target}");
                }
            }
        }
    }

    #[test]
    fn active_marks_only_the_current_page() {
        let s = Site::load(&site()).unwrap();
        let p = Page::parse("x", "title: T\nactive: roadmap\npath: roadmap/\n---\n").unwrap();
        let mut v = Vec::new();
        assert_eq!(
            s.expand("{{active:roadmap}}", &p, &mut v).unwrap(),
            r#" class="is-active" aria-current="page""#
        );
        assert_eq!(s.expand("{{active:download}}", &p, &mut v).unwrap(), "");
        assert_eq!(s.expand("{{base}}", &p, &mut v).unwrap(), "../");
    }

    #[test]
    fn mistakes_are_errors_not_panics() {
        let s = Site::load(&site()).unwrap();
        let p = Page::parse("x", "title: T\n---\n").unwrap();
        let mut v = Vec::new();
        for bad in [
            "{{nope}}",
            "{{site.nope}}",
            "{{icon:nope}}",
            "{{icon:check:0}}",
            "{{icon:check:x}}",
            "{{screen:nope|alt}}",
            "{{screen:../x|alt}}",
            "{{screen:x}}",
            "{{base",
        ] {
            assert!(s.expand(bad, &p, &mut v).is_err(), "{bad}");
        }
        assert!(Page::parse("x", "no header").is_err());
        assert!(Page::parse("x", "title: T\npath: ../x/\n---\n").is_err());
        assert!(Page::parse("x", "title: T\nsurprise: 1\n---\n").is_err());
        assert!(Page::parse("x", "path: a/\n---\n").is_err());
    }

    #[test]
    fn png_size_reads_the_header_and_rejects_junk() {
        let mut b = b"\x89PNG\r\n\x1a\n\0\0\0\x0dIHDR".to_vec();
        b.extend(640u32.to_be_bytes());
        b.extend(480u32.to_be_bytes());
        assert_eq!(png_size(&b), Some((640, 480)));
        assert_eq!(png_size(&b[..20]), None);
        assert_eq!(png_size(b"GIF89a"), None);
        assert_eq!(png_size(&[]), None);
    }
}
