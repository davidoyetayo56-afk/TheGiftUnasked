/* THE GIFT UNASKED — core: opening, stage, pacing, controls */
(function () {
  'use strict';
  const GU = window.GU, cfg = GU.config, N = GU.turns.length, NC = GU.chapters.length;
  const $ = function (s, r) { return (r || document).querySelector(s); };
  const $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  const narr = GU.narration;
  const NAMES = { poet: 'THE POET', theo: 'THE THEOLOGIAN' };

  const stage = $('#stage'), turnEl = $('#turn'), scroller = $('#scroller');
  let idx = 0, tok = 0, revealing = false, narrOn = false, first = 'poet', started = false;
  const asked = {};

  /* ---------- static star field (drawn once, no animation loop) ---------- */
  function drawStars(c, density) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2), w = c.clientWidth || innerWidth, h = c.clientHeight || innerHeight;
    c.width = w * dpr; c.height = h * dpr;
    const g = c.getContext('2d'); g.scale(dpr, dpr);
    let s = 7; const rnd = function () { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const n = Math.round(w * h * density);
    for (let i = 0; i < n; i++) {
      const r = rnd() < 0.06 ? 1.3 : rnd() * 0.8 + 0.2;
      g.globalAlpha = rnd() * 0.7 + 0.2; g.fillStyle = rnd() < 0.15 ? '#D8C7A0' : '#EEE8D8';
      g.beginPath(); g.arc(rnd() * w, rnd() * h, r, 0, 6.283); g.fill();
    }
  }
  const stars = function () { drawStars($('#stars-open'), 0.0007); drawStars($('#stars-stage'), 0.0005); };
  stars();
  let rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(stars, 250); });

  /* ---------- opening ---------- */
  const open = $('#opening'), enterBtn = $('#enter');
  async function runOpening() {
    const os = $$('.o', open), at = [2600, 5600, 9000, 11800, 14200];
    if (reduce) { open.classList.add('quick'); os.forEach(function (o) { o.classList.add('show'); }); } else {
      document.body.classList.add('stars-in');
      for (let i = 0; i < os.length; i++) { await sleep(i === 0 ? at[0] : at[i] - at[i - 1]); if (started) return; os[i].classList.add('show'); }
    }
    enterBtn.focus({ preventScroll: true });
    await sleep(9000); if (!started) $('#egg1').classList.add('show');
  }
  runOpening();
  if (reduce) document.body.classList.add('stars-in');

  enterBtn.addEventListener('click', async function () {
    if (started) return; started = true;
    open.classList.remove('active'); open.setAttribute('aria-hidden', 'true');
    await sleep(1400);
    stage.classList.add('active'); stage.removeAttribute('aria-hidden');
    await sleep(1200);
    showTurn(0);
  });

  /* ---------- background: image per chapter with graceful fallback ---------- */
  let bgKey = '', bgFront = 'A';
  function setBg(ch) {
    stage.dataset.ch = ch;
    const n = cfg.chapterImage[ch - 1], file = cfg.images[n - 1];
    if (!file || file === bgKey) return;
    bgKey = file;
    const im = new Image();
    im.onload = function () {
      if (bgKey !== file) return;
      const next = bgFront === 'A' ? 'B' : 'A', a = $('#bg' + next), b = $('#bg' + bgFront);
      a.style.backgroundImage = 'url("' + cfg.imageDir + file + '")';
      a.classList.add('on'); b.classList.remove('on'); bgFront = next;
    };
    im.onerror = function () { $('#bgA').classList.remove('on'); $('#bgB').classList.remove('on'); };
    im.src = cfg.imageDir + file;
  }
  // parallax: gentle pointer drift + slow vertical drift with progress
  let pRaf = 0;
  window.addEventListener('pointermove', function (e) {
    if (reduce || pRaf || !stage.classList.contains('active')) return;
    pRaf = requestAnimationFrame(function () {
      pRaf = 0; const bg = $('#bg');
      bg.style.setProperty('--mx', ((e.clientX / innerWidth - 0.5) * -14).toFixed(1));
      bg.style.setProperty('--my', ((e.clientY / innerHeight - 0.5) * -10).toFixed(1));
    });
  }, { passive: true });

  /* ---------- HUD ---------- */
  const pad = function (n) { return (n < 10 ? '0' : '') + n; };
  function hud(t) {
    $('#chlabel').textContent = 'CHAPTER ' + pad(t.ch) + ' / ' + NC + '  ·  ' + GU.chapters[t.ch - 1];
    $('#barfill').style.transform = 'scaleX(' + ((idx + 1) / N).toFixed(4) + ')';
    $('#bg').style.setProperty('--py', (-(idx / N) * 28).toFixed(1));
    $$('.menu button').forEach(function (b) { b.setAttribute('aria-current', +b.dataset.ch === t.ch ? 'true' : 'false'); });
  }
  function rail(active) {
    const order = first === 'poet' ? ['poet', 'theo'] : ['theo', 'poet'];
    $('#rail').innerHTML = order.map(function (w) {
      return '<span class="av sm ' + w + (w === active ? ' act' : '') + '"><svg viewBox="0 0 64 64"><use href="#av-' + w + '"/></svg></span>';
    }).join('');
  }

  /* ---------- building a turn ---------- */
  function build(t) {
    turnEl.className = 'turnwrap ' + t.sp;
    turnEl.innerHTML = '';
    const who = document.createElement('div'); who.className = 'who';
    who.innerHTML = '<span class="av ' + t.sp + '"><svg viewBox="0 0 64 64" aria-hidden="true"><use href="#av-' + t.sp + '"/></svg></span><span class="name"></span>';
    $('.name', who).textContent = NAMES[t.sp];
    turnEl.appendChild(who);
    const sts = t.stanzas.map(function (s) {
      const p = document.createElement('p'); p.className = 'st' + (s.flag === '~' ? ' emph' : '') + (s.flag === '!' ? ' keyq' : '');
      p.textContent = s.text; turnEl.appendChild(p); return p;
    });
    const refs = GU.refsFor(t);
    if (refs.length) {
      const box = document.createElement('div'); box.className = 'refs'; box.setAttribute('role', 'group'); box.setAttribute('aria-label', 'Scripture references for this passage');
      refs.forEach(function (r) {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'ref'; b.textContent = r.ref;
        b.setAttribute('aria-label', 'Open reference: ' + r.ref);
        b.addEventListener('click', function (e) { e.stopPropagation(); GU.openRef(r.id, b); });
        box.appendChild(b);
      });
      turnEl.appendChild(box);
    }
    scroller.scrollTop = 0;
    return sts;
  }
  const readMs = function (txt) { return Math.max(1500, 900 + txt.length * 38); };

  async function solo(s, t, my) {
    const el = $('#solo'); el.textContent = s.text; el.className = 'solo ' + t.sp + ' on'; el.setAttribute('aria-hidden', 'false');
    turnEl.classList.add('hushed');
    const hold = sleep(3600);
    if (narrOn) await Promise.all([hold, narr.speak(s.text, t.sp)]); else await hold;
    el.classList.remove('on'); el.setAttribute('aria-hidden', 'true');
    await sleep(900);
    turnEl.classList.remove('hushed');
    return my === tok;
  }

  async function reveal(t, sts, my) {
    revealing = true; $('#hint').classList.remove('on');
    for (let k = 0; k < sts.length; k++) {
      if (my !== tok) return;
      const s = t.stanzas[k];
      if (s.flag === '!') { if (!(await solo(s, t, my))) return; }
      sts[k].classList.add('in');
      if (narrOn && !(s.flag === '!')) await narr.speak(s.text, t.sp); else if (!narrOn) await sleep(readMs(s.text)); else await sleep(500);
      if (my !== tok) return;
      await sleep(s.flag ? 1500 : (narrOn ? 450 : 350));
    }
    if (my !== tok) return;
    finish();
    if (narrOn) { await sleep(1300); if (my === tok && narrOn) next(); }
  }
  function finish() {
    revealing = false; $$('.st', turnEl).forEach(function (p) { p.classList.add('in'); });
    $$('.refs', turnEl).forEach(function (r) { r.classList.add('in'); });
    if (!narrOn) $('#hint').classList.add('on');
  }

  async function chapterCard(ch, my) {
    const c = $('#card'); $('#card-n').textContent = 'CHAPTER ' + pad(ch) + ' / ' + NC; $('#card-t').textContent = GU.chapters[ch - 1];
    stage.classList.add('carding'); c.classList.add('on'); c.setAttribute('aria-hidden', 'false');
    GU.ambient.pageTurn();
    await sleep(4200);
    c.classList.remove('on'); c.setAttribute('aria-hidden', 'true'); stage.classList.remove('carding');
    await sleep(1100);
    return my === tok;
  }

  async function askMoment(i, my) {
    const t = GU.turns[i], prev = GU.turns[i - 1], box = $('#ask');
    $('#ask-q').textContent = '“' + prev.stanzas[prev.stanzas.length - 1].text.replace(/^[“"]|[”"]$/g, '') + '”';
    box.hidden = false; await sleep(30); box.classList.add('on');
    const who = await new Promise(function (res) {
      $$('.pick', box).forEach(function (b) { b.onclick = function () { res(b.dataset.who); }; });
      $('.pick', box).focus({ preventScroll: true });
    });
    first = who; asked[i] = true;
    // the chosen figure steps into the light first, then the other
    const order = who === 'poet' ? ['poet', 'theo'] : ['theo', 'poet'];
    box.classList.add('chosen');
    $$('.pick', box).forEach(function (b) { b.classList.toggle('lead', b.dataset.who === who); b.classList.toggle('late', b.dataset.who !== who); b.disabled = true; });
    await sleep(2600);
    box.classList.remove('on', 'chosen'); await sleep(900); box.hidden = true;
    $$('.pick', box).forEach(function (b) { b.classList.remove('lead', 'late'); b.disabled = false; });
    return my === tok;
  }

  async function showTurn(i, o) {
    o = o || {};
    const my = ++tok; narr.stop(); revealing = false;
    const ab = $('#ask'); if (!ab.hidden) { ab.classList.remove('on', 'chosen'); ab.hidden = true; $$('.pick', ab).forEach(function (b) { b.classList.remove('lead', 'late'); b.disabled = false; }); }
    $('#solo').classList.remove('on'); turnEl.classList.remove('hushed'); $('#hint').classList.remove('on');
    const t = GU.turns[i]; idx = i; hud(t); rail(t.sp);
    if (!o.instant && !o.replay) { turnEl.classList.add('out'); await sleep(700); if (my !== tok) return; }
    if (!o.instant && !o.replay && t.chStart) { setBg(t.ch); if (!(await chapterCard(t.ch, my))) return; } else setBg(t.ch);
    if (!o.instant && !o.replay && t.ask && !asked[i]) { if (!(await askMoment(i, my))) return; rail(t.sp); }
    turnEl.classList.remove('out');
    const sts = build(t);
    if (o.instant) { finish(); return; }
    await sleep(60); reveal(t, sts, my);
  }

  /* ---------- navigation ---------- */
  function next() {
    if (!started) return;
    if (idx >= N - 1) return endDialogue();
    showTurn(idx + 1);
  }
  function prev() { if (idx > 0) showTurn(idx - 1, { instant: true }); else showTurn(0, { replay: true }); }
  function skip() { tok++; narr.stop(); $('#solo').classList.remove('on'); turnEl.classList.remove('hushed'); finish(); }

  async function endDialogue() {
    tok++; narr.stop(); setNarr(false);
    stage.classList.remove('active'); stage.setAttribute('aria-hidden', 'true');
    await sleep(1500);
    GU.verdict({ done: function () { GU.finale(); } });
  }
  $('#again').addEventListener('click', function () {
    GU.finaleReset(); Object.keys(asked).forEach(function (k) { delete asked[k]; });
    setTimeout(function () { stage.classList.add('active'); stage.removeAttribute('aria-hidden'); showTurn(0); }, 1500);
  });

  stage.addEventListener('click', function (e) {
    if (e.target.closest('button,select,label,.pop,.controls,.hud,.ask,.refpanel')) return;
    if ($('#ask').classList.contains('on')) return;
    if (revealing && !narrOn) skip(); else next();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (GU.closeRef()) return; closePops(); return; }
    if (!stage.classList.contains('active') || e.altKey || e.ctrlKey || e.metaKey) return;
    const tg = e.target.tagName;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); revealing && !narrOn ? skip() : next(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
    else if (e.key === ' ' && tg !== 'BUTTON' && tg !== 'SELECT' && tg !== 'INPUT') { e.preventDefault(); revealing && !narrOn ? skip() : next(); }
  });
  $('#next').addEventListener('click', next);
  $('#prev').addEventListener('click', prev);

  /* ---------- narration controls ---------- */
  function setPlayIcon(playing) {
    $('.i-play', $('#play')).hidden = playing; $('.i-pause', $('#play')).hidden = !playing;
    $('#play').setAttribute('aria-label', playing ? 'Pause narration' : (narrOn ? 'Resume narration' : 'Play narration'));
  }
  function setNarr(on) {
    if (on === narrOn) return;
    narrOn = on; $('#narrToggle').checked = on; $('#play').setAttribute('aria-pressed', on ? 'true' : 'false');
    setPlayIcon(on);
    if (on) showTurn(idx, { replay: true }); else { narr.stop(); if (started) skip(); }
  }
  $('#play').addEventListener('click', function () {
    if (!narrOn) { setNarr(true); return; }
    if (narr.isPaused()) { narr.resume(); setPlayIcon(true); } else { narr.pause(); setPlayIcon(false); }
  });
  $('#stop').addEventListener('click', function () { setNarr(false); });
  $('#narrToggle').addEventListener('change', function () { setNarr(this.checked); });

  /* ---------- text size, ambient, mute ---------- */
  const sizes = [[0.92, 'small'], [1, 'medium'], [1.14, 'large'], [1.3, 'extra large']]; let sz = 1;
  $('#size').addEventListener('click', function () {
    sz = (sz + 1) % sizes.length; document.documentElement.style.setProperty('--scale', sizes[sz][0]);
    this.setAttribute('aria-label', 'Text size: ' + sizes[sz][1]);
  });
  $('#amb').addEventListener('click', function () {
    const on = GU.ambient.toggle(); this.setAttribute('aria-pressed', on ? 'true' : 'false');
    GU.toast(on ? 'Ambient sound on.' : 'Ambient sound off.');
  });
  let muted = false;
  $('#mute').addEventListener('click', function () {
    muted = !muted; narr.setMuted(muted); GU.ambient.setMuted(muted);
    this.setAttribute('aria-pressed', muted ? 'true' : 'false');
    $('.m-on', this).hidden = muted; $('.m-off', this).hidden = !muted;
  });

  /* ---------- popovers: chapters + voices ---------- */
  const menu = $('#menu'), vbox = $('#voicebox');
  GU.chapters.forEach(function (name, i) {
    const b = document.createElement('button'); b.type = 'button'; b.dataset.ch = i + 1;
    b.innerHTML = '<span>' + pad(i + 1) + '</span> ' + name;
    b.addEventListener('click', function () { closePops(); setNarr(false); showTurn(GU.firstTurnOfChapter(i + 1), { replay: false }); });
    menu.appendChild(b);
  });
  function pop(el, btn) {
    const open = el.hidden; closePops();
    if (open) { el.hidden = false; btn.setAttribute('aria-expanded', 'true'); const f = $('button,select', el); f && f.focus({ preventScroll: true }); }
  }
  function closePops() { [[menu, $('#menubtn')], [vbox, $('#voicebtn')]].forEach(function (p) { if (!p[0].hidden) { p[0].hidden = true; p[1].setAttribute('aria-expanded', 'false'); p[1].focus({ preventScroll: true }); } }); }
  $('#menubtn').addEventListener('click', function (e) { e.stopPropagation(); pop(menu, this); });
  $('#voicebtn').addEventListener('click', function (e) { e.stopPropagation(); pop(vbox, this); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.pop,#menubtn,#voicebtn')) { [menu, vbox].forEach(function (p) { p.hidden = true; }); $('#menubtn').setAttribute('aria-expanded', 'false'); $('#voicebtn').setAttribute('aria-expanded', 'false'); } });

  function fillVoices() {
    const vs = narr.voices(), ch = narr.chosen();
    [['poet', '#voicePoet'], ['theo', '#voiceTheo']].forEach(function (p) {
      const sel = $(p[1]); sel.innerHTML = '';
      vs.forEach(function (v) { const o = document.createElement('option'); o.value = v.voiceURI; o.textContent = v.name + ' (' + v.lang + ')'; if (ch[p[0]] === v) o.selected = true; sel.appendChild(o); });
      sel.onchange = function () { narr.setVoice(p[0], sel.value); };
    });
  }
  if (!narr.supported) { $$('.needs-speech').forEach(function (e) { e.hidden = true; }); vbox.remove(); } else { narr.onVoices = fillVoices; fillVoices(); }
  $('#amb').hidden = false;

  // tidy: when the page is hidden, silence narration
  document.addEventListener('visibilitychange', function () { if (document.hidden && narrOn && !narr.isPaused()) { narr.pause(); setPlayIcon(false); } });
})();
