(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FORM_ENDPOINT = ''; // paste your Formspree/Web3Forms URL here (see README)

  const toast = msg => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3500); };

  // Year, theme
  $('#year').textContent = new Date().getFullYear();
  const root = document.documentElement;
  try { const s = localStorage.getItem('theme'); if (s) root.dataset.theme = s; } catch {}
  $('#theme').onclick = () => { root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('theme', root.dataset.theme); } catch {} };

  // Nav: blur, burger, active link, back to top
  const nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
  const setMenu = o => { menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); };
  burger.onclick = () => setMenu(!menu.classList.contains('open'));
  $$('a', menu).forEach(a => a.onclick = () => setMenu(false));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));
  addEventListener('scroll', () => { nav.classList.toggle('scrolled', scrollY > 30); $('#top').classList.toggle('show', scrollY > 600); }, { passive: true });
  const links = $$('nav a[href^="#"]', menu);
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  // Scroll reveal
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  // Typing
  const words = ['Aspiring IT Officer', 'Web Developer', 'Database Enthusiast', 'Software Testing Enthusiast'], out = $('#typed');
  if (reduce) out.textContent = words[0];
  else { let w = 0, c = 0, del = false;
    (function tick() {
      const word = words[w]; c += del ? -1 : 1; out.textContent = word.slice(0, c);
      let d = del ? 40 : 90;
      if (!del && c === word.length) { del = true; d = 1400; } else if (del && c === 0) { del = false; w = (w + 1) % words.length; d = 300; }
      setTimeout(tick, d);
    })(); }

  // Cursor glow (desktop only)
  const glow = $('.glow');
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce)
    addEventListener('pointermove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }, { passive: true });

  // CV button
  $('#cv').addEventListener('click', e => {
    if (e.currentTarget.dataset.cvReady !== 'true') { e.preventDefault(); toast('CV not added yet. Put cv.pdf in /assets and set data-cv-ready="true".'); }
  });

  // Project filter
  $$('.chip').forEach(b => b.onclick = () => {
    $$('.chip').forEach(x => x.classList.toggle('on', x === b));
    $$('.project').forEach(p => p.classList.toggle('hide', b.dataset.f !== 'all' && !p.dataset.cat.split(' ').includes(b.dataset.f)));
  });

  // Modal
  const modal = $('#modal');
  $$('[data-open]').forEach(b => b.onclick = () => {
    const p = b.closest('.project'), img = $('img', p);
    $('#mImg').src = img.src; $('#mImg').alt = img.alt;
    $('#mTitle').textContent = $('h3', p).textContent; $('#mDesc').textContent = $('p', p).textContent;
    $('#mTags').innerHTML = $('.tags', p).innerHTML; modal.showModal();
  });
  $('#close').onclick = () => modal.close();
  modal.addEventListener('click', e => e.target === modal && modal.close());

  // Form
  const form = $('#form'), status = $('#status');
  const check = el => {
    let m = ''; const v = el.value.trim();
    if (!v) m = 'This field is required.';
    else if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) m = 'Enter a valid email address.';
    else if (el.name === 'message' && v.length < 10) m = 'Message must be at least 10 characters.';
    el.parentNode.classList.toggle('bad', !!m); $('em', el.parentNode).textContent = m; return !m;
  };
  $$('input,textarea', form).forEach(el => el.addEventListener('blur', () => check(el)));
  form.addEventListener('submit', async e => {
    e.preventDefault(); status.className = '';
    const ok = $$('input,textarea', form).map(check).every(Boolean);
    if (!ok) { status.textContent = 'Please fix the highlighted fields.'; status.className = 'err'; return; }
    if (!FORM_ENDPOINT) { status.textContent = 'Form is valid, but no email service is connected yet, so nothing was sent. See README.'; status.className = 'err'; return; }
    try {
      const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
      if (!r.ok) throw 0; form.reset(); status.textContent = 'Message sent. Thank you!'; status.className = 'ok';
    } catch { status.textContent = 'Could not send. Please try again or email directly.'; status.className = 'err'; }
  });
})();
