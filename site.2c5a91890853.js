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
    const arrows = [...gallery.querySelectorAll('[data-gallery-direction]')];
    const updateArrows = () => {
      const viewport = track.getBoundingClientRect();
      const first = track.firstElementChild?.getBoundingClientRect();
      const last = track.lastElementChild?.getBoundingClientRect();
      // Scroll snapping can align the first card after the track's padding,
      // so physical scrollLeft alone does not identify the visible boundaries.
      const atStart = !first || (rtl ? first.right <= viewport.right + 2 : first.left >= viewport.left - 2);
      const atEnd = !last || (rtl ? last.left >= viewport.left - 2 : last.right <= viewport.right + 2);
      arrows.forEach(button => { button.disabled = Number(button.dataset.galleryDirection) < 0 ? atStart : atEnd; });
    };
    track.addEventListener('scroll', updateArrows, {passive:true}); window.addEventListener('resize', updateArrows); updateArrows();
    gallery.querySelectorAll('[data-gallery-direction]').forEach(button => button.addEventListener('click', () => {
      const distance = Math.min(track.clientWidth * .8, 550) * Number(button.dataset.galleryDirection) * (rtl ? -1 : 1);
      track.scrollBy({left:distance,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    }));
  });
})();
