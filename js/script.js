const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;

// 글자 하나씩 올라오기 (히어로 타이틀)
$$('[data-split]').forEach(el => {
  const t = el.textContent; el.setAttribute('aria-label', t);
  el.innerHTML = [...t].map((c, i) => `<span class="ch" aria-hidden="true" style="--i:${i}">${c === ' ' ? '&nbsp;' : c}</span>`).join('')
});

// 섹션 제목 와이프 등장
const rvEls = $$('.rv');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .4 });
  rvEls.forEach(el => io.observe(el));
} else {
  rvEls.forEach(el => el.classList.add('in'));
}

// 호버 시 글자 스크램블
const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
if (!rm) $$('[data-scr]').forEach(el => {
  if (el.closest('.sg h4')) return;
  const t = el.textContent; let r;
  el.addEventListener('mouseenter', () => {
    clearInterval(r); el.style.minWidth = el.offsetWidth + 'px'; let n = 0;
    r = setInterval(() => {
      el.textContent = [...t].map((c, i) => c === ' ' || c === '/' || i < n ? c : A[Math.random() * 26 | 0]).join('');
      if (++n > t.length) { clearInterval(r); el.textContent = t }
    }, 35)
  })
});

// 커스텀 커서 + 히어로 패럴랙스
const cur = $('.cur'), ring = $('.ring'), hero = $('#hero');
let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, px = 0, py = 0, tx = 0, ty = 0;
addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; tx = (mx / innerWidth - .5) * 2; ty = (my / innerHeight - .5) * 2 });
document.addEventListener('pointerover', e => ring.classList.toggle('on', !!e.target.closest('a,button,.ch,[data-scr],.sl,.pi')));
(function loop() {
  rx += (mx - rx) * .16; ry += (my - ry) * .16; px += (tx - px) * .06; py += (ty - py) * .06;
  cur.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
  if (!rm) { hero.style.setProperty('--mx', px); hero.style.setProperty('--my', py) }
  requestAnimationFrame(loop);
})();

// 메뉴
const mb = $('#mb'), nav = $('#nav');
const setNav = o => { nav.classList.toggle('open', o); mb.setAttribute('aria-expanded', o) };
mb.onclick = () => setNav(!nav.classList.contains('open'));
nav.addEventListener('click', e => e.target.closest('a') && setNav(false));
addEventListener('keydown', e => e.key === 'Escape' && setNav(false));

// 맨 위로 버튼 (스크롤 진행률 링)
const tb = $('#totop'), pc = $('.pg-c'), L = 2 * Math.PI * 24; pc.style.strokeDasharray = L;
const about = $('#about');
const updateIntroGlow = () => {
  if (!about) return;
  const rect = about.getBoundingClientRect();
  const viewport = window.innerHeight;
  const start = viewport * 0.2;
  const end = viewport * 0.75;
  const progress = Math.min(Math.max((start - rect.top) / (end - start + 1), 0), 1);
  about.style.setProperty('--about-scroll', progress.toFixed(3));
};
const onScroll = () => {
  const max = document.documentElement.scrollHeight - innerHeight || 1;
  tb.classList.toggle('show', scrollY > 500); pc.style.strokeDashoffset = L * (1 - scrollY / max);
  updateIntroGlow();
};
addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', updateIntroGlow);
onScroll();
tb.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

// 이미지 슬라이더: 한 세트를 복제해 끊김 없이 흐르게
$$('[data-slider] .track').forEach(t => {
  [...t.children].forEach(c => { const k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); t.appendChild(k) });
  t.style.setProperty('--dur', (t.children.length / 2 * 7) + 's');
});

// 카드 깊이감 / 3D hover
const tiltEls = document.querySelectorAll('.pi, .sg > div, .sl, .w, .chk span');
if (!rm) {
  tiltEls.forEach(el => {
    el.addEventListener('pointermove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      el.style.setProperty('--rx', `${(-y * 12).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  });
}
