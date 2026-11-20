// Mobile menu, copy buttons and the platform filter on the download page.
(function () {
  var nav = document.querySelector('.mobile-nav');
  if (nav) {
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') nav.open = false; });
    nav.addEventListener('click', function (e) { if (e.target.closest('.mobile-menu a')) nav.open = false; });
    document.addEventListener('click', function (e) { if (nav.open && !nav.contains(e.target)) nav.open = false; });
    window.addEventListener('resize', function () { if (window.innerWidth > 960) nav.open = false; });
  }

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () { var t = btn.textContent; btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = t; }, 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done); else done();
    });
  });

  var buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filter');
      buttons.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      document.querySelectorAll('.pkg').forEach(function (c) { c.hidden = f !== 'all' && c.dataset.platform !== f; });
    });
  });
})();
