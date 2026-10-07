(() => {
  document.documentElement.classList.add('js');
  const root = document.documentElement;
  const preference = matchMedia('(prefers-color-scheme: dark)');
  const controls = [...document.querySelectorAll('[data-theme-choice]')];
  let selected = 'auto';
  try { const stored = localStorage.getItem('lilt.website.appearance'); if (['auto','light','dark'].includes(stored)) selected = stored; } catch (_) {}
  const apply = () => {
    root.dataset.theme = selected === 'auto' ? (preference.matches ? 'dark' : 'light') : selected;
    controls.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === selected)));
  };
  controls.forEach(button => button.addEventListener('click', () => { selected = button.dataset.themeChoice; apply(); try { localStorage.setItem('lilt.website.appearance', selected); } catch (_) {} }));
  preference.addEventListener?.('change', apply); apply();
  document.querySelectorAll('.language-menu').forEach(menu => {
    document.addEventListener('click', event => { if (!menu.contains(event.target)) menu.removeAttribute('open'); });
    menu.addEventListener('keydown', event => { if (event.key === 'Escape') { menu.removeAttribute('open'); menu.querySelector('summary').focus(); } });
  });
  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const track = gallery.querySelector('.gallery-track');
    const rtl = getComputedStyle(track).direction === 'rtl';
    gallery.querySelectorAll('[data-gallery-direction]').forEach(button => button.addEventListener('click', () => {
      const distance = Math.min(track.clientWidth * .8, 550) * Number(button.dataset.galleryDirection) * (rtl ? -1 : 1);
      track.scrollBy({left:distance,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    }));
  });
})();
