/* THE GIFT UNASKED — references, ambient sound, share, verdict, finale */
(function () {
  'use strict';
  const GU = window.GU, cfg = GU.config;
  const $ = function (s, r) { return (r || document).querySelector(s); };
  const sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  const VAR = 'Interpretation varies among Christian traditions.';

  /* ---------------- Bible references ----------------
     "at" = phrases (lower-case) that make a chip appear beside a speech.
     Texts are short paraphrases, not translations: read the passage in your own Bible. */
  GU.refs = [
    { id: 'gen1', ref: 'Genesis 1', at: ['called it good', 'firmament', "bear god's image"],
      says: 'God creates by speaking, pronounces creation “good” and, at the end, “very good”. Humanity, male and female, is made in God’s image (1:27). A dome separates waters above from waters below (1:6–8).',
      context: 'Opens the Bible in the cosmic vocabulary of the ancient Near East. Readings include literal days, a literary “framework”, and a theological polemic against rival creation myths.',
      argue: 'The Theologian reads it as theology, not a science textbook. The Poet hears an ancient observer’s sky, and asks whether “image of God” sits easily beside later hierarchy.',
      why: 'It is the root of the first answer (“creation is good”) and of the question about accommodation: does God speak, or do people speak about God?', disputed: true },
    { id: 'gen2', ref: 'Genesis 2', at: ['created from man', 'tells of adam'],
      says: 'A second, more intimate account: God forms the man from dust, plants a garden, brings the animals, then forms the woman from the man’s side (2:7, 18–23).',
      context: 'Order and style differ from Genesis 1. Many scholars see two traditions joined; others harmonise them as two views of one event.',
      argue: 'The Poet presses the apparent tension. The Theologian answers that Scripture is a library of voices and genres, not a single report.',
      why: 'It tests what “inspired” means: dictation, or God working through human authors.', disputed: true },
    { id: 'gen3', ref: 'Genesis 3', at: ['ancient hinge', 'serpent whispers'],
      says: 'A serpent questions God’s command; the man and woman eat the forbidden fruit; they are exiled and consequences fall on serpent, woman, man and ground.',
      context: 'The chapter itself does not use the words “the Fall” or “original sin”. Those are later theological frameworks built on it.',
      argue: 'The Poet asks why a child should inherit a father’s prison. The Theologian answers that traditions differ on what is inherited.',
      why: 'The hinge of the argument: whether suffering was foreseen, and whether freedom justifies a world that can fall.', disputed: true },
    { id: 'rom5', ref: 'Romans 5', at: ['through one man'],
      says: 'Paul writes that sin entered the world through one man, and death through sin, and sets Adam beside Christ (5:12–21).',
      context: 'Traditions read this differently: inherited guilt (much Western Christianity), inherited mortality and a fallen condition (much Eastern Orthodoxy), or representative headship (some Reformed thought). The Greek of 5:12 is itself debated.',
      argue: 'The Theologian cites Paul for the shared human condition; the Poet takes it as the next question.',
      why: 'It is the textual source of the claim that one act reaches every human life.', disputed: true },
    { id: 'lev19', ref: 'Leviticus 19', at: ['love your neighbour'],
      says: 'Leviticus 19:18 commands love of neighbour as oneself, a line Jesus later places near the heart of the law (Mark 12:31). Elsewhere the same book regulates slavery (Leviticus 25:44–46).',
      context: 'Ancient law codes both limited and permitted practices we now reject. How Christians weigh such texts is a central interpretive question.',
      argue: 'The Poet sets mercy and slavery side by side in one book. The Theologian says different voices answer different historical circumstances.',
      why: 'It makes the point that holy ink did not make morality obvious.', disputed: true },
    { id: 'eph6', ref: 'Ephesians 6', at: ['permit slavery'],
      says: 'Ephesians 6:5–9 addresses enslaved people and masters within the Roman household, without calling for abolition.',
      context: 'Slavery was defended and attacked with Scripture. Abolitionists leaned on themes such as Galatians 3:28 and the dignity of the image of God.',
      argue: 'The Poet asks how the same book can contain both. The Theologian says Christians disagree over which passages are universal and which reflect ancient structures.',
      why: 'It is the sharpest example of the question: is the age speaking through God?', disputed: true },
    { id: '1cor14', ref: '1 Corinthians 14', at: ['women to be silent'],
      says: '14:34–35 tells women to be silent in the assemblies. Yet 11:5 assumes women pray and prophesy aloud.',
      context: 'Some read it as a local rule about disorder, some as a later insertion (a few manuscripts move these verses), some as a lasting instruction.',
      argue: 'The Poet sets it against Paul’s co-workers. The Theologian: some passages were read as universal commands, others as reflecting ancient structures.',
      why: 'A test case: how does one decide which commands travel across centuries?', disputed: true },
    { id: '1tim2', ref: '1 Timothy 2', at: ['women to be silent', 'speak of submission'],
      says: '2:11–14: a woman is to learn quietly and not teach or exercise authority over a man, with an appeal to Adam and Eve.',
      context: 'Scholars debate whether Paul wrote 1 Timothy, and how to read the Ephesian situation behind it. Complementarian and egalitarian Christians read it very differently.',
      argue: 'The Poet points out the tension with “neither male nor female”. The Theologian accepts that Christians sharply disagree.',
      why: 'It shows a single text pulling the argument toward authority or toward equality.', disputed: true },
    { id: 'rom16', ref: 'Romans 16', at: ['worked alongside him'],
      says: 'Paul greets and commends many co-workers, including women such as Phoebe (a “deacon” or servant of the church at Cenchreae) and Priscilla.',
      context: 'Whether Junia (16:7) is called an apostle, and what Phoebe’s title implies, are discussed by scholars.',
      argue: 'The Poet uses it as counter-evidence to the silence passages.',
      why: 'The same author appears to point two ways, which is the Poet’s point.', disputed: true },
    { id: 'gal3', ref: 'Galatians 3', at: ['neither male nor female'],
      says: 'Galatians 3:28: in Christ there is no Jew or Greek, slave or free, male and female; all are one.',
      context: 'Said in an argument about who belongs to God’s people. Whether it implies social equality or equality of standing before God is disputed.',
      argue: 'The Poet sets it against passages on submission. The Theologian says the whole canon and Jesus’ character are the interpretive key.',
      why: 'It is the strongest verse for those who read Scripture as moving toward equality.', disputed: true },
    { id: 'rev20', ref: 'Revelation 20', at: ['lake of fire', 'book of life', 'books are opened'],
      says: 'The dead are judged by what is written in books; death and Hades are thrown into the lake of fire, along with anyone not found written in the book of life (20:11–15).',
      context: 'Revelation is apocalyptic: vivid symbol, not a literal map. Readings include preterist, historicist, futurist and idealist. On the “second death”: eternal conscious punishment, annihilation, or hope of final reconciliation.',
      argue: 'The Poet asks why freedom has an abyss beneath it. The Theologian names the three doctrines of hell and admits the dispute.',
      why: 'Here the stakes of the whole dialogue are set in fire and ink.', disputed: true },
    { id: 'rev21', ref: 'Revelation 21', at: ['new heaven', 'end of mourning'],
      says: 'A new heaven and a new earth; God dwells with humanity; death, mourning and pain are no more (21:1–4).',
      context: 'The movement is of heaven coming down to a renewed earth, with imagery from Isaiah, rather than escape to a distant sky.',
      argue: 'The Theologian reads this as communion and renewal. The Poet asks what endless time does to freedom.',
      why: 'It answers the picture of heaven as an endless choir.', disputed: true },
    { id: 'rev22', ref: 'Revelation 22', at: ['serve him'],
      says: 'A river of life and the tree of life; God’s servants serve him and see his face; they reign for ever and ever (22:1–5).',
      context: 'Service and worship are portrayed as the fulfilment of human life, in symbolic language.',
      argue: 'The Poet asks whether obedience without the possibility of leaving is virtue. The Theologian: perhaps heaven perfects freedom.',
      why: 'It frames the last question: is a freedom that ends in no desire to leave still freedom?', disputed: true }
  ];
  GU.refsFor = function (t) {
    const flat = t.stanzas.map(function (s) { return s.text; }).join(' ').replace(/\s+/g, ' ').toLowerCase();
    return GU.refs.filter(function (r) { return r.at.some(function (a) { return flat.indexOf(a) !== -1; }); });
  };

  const panel = $('#refpanel');
  let lastFocus = null;
  function fill(sel, text) { $(sel, panel).textContent = text; }
  GU.openRef = function (id, btn) {
    const r = GU.refs.find(function (x) { return x.id === id; });
    if (!r) return;
    lastFocus = btn || document.activeElement;
    fill('#rp-title', r.ref); fill('#rp-says', r.says); fill('#rp-context', r.context);
    fill('#rp-argue', r.argue); fill('#rp-why', r.why);
    $('#rp-disputed', panel).hidden = !r.disputed; $('#rp-disputed', panel).textContent = VAR;
    panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false');
    $('.rp-close', panel).focus();
  };
  GU.closeRef = function () {
    if (!panel.classList.contains('open')) return false;
    panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    return true;
  };
  $('.rp-close', panel).addEventListener('click', GU.closeRef);

  /* ---------------- ambient sound ---------------- */
  let ambOn = false, ambMuted = false, tracks = null, synthNodes = null, ctx = null, pageAudio = null;
  function startSynth() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = ctx || new AC();
    if (ctx.state === 'suspended') ctx.resume();
    if (synthNodes) { synthNodes.gain.gain.value = ambMuted ? 0 : 0.5; return; }
    const len = ctx.sampleRate * 4, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 240;
    const swell = ctx.createGain(); swell.gain.value = 0.05;
    const lfo = ctx.createOscillator(), lfoG = ctx.createGain(); lfo.frequency.value = 0.07; lfoG.gain.value = 0.03;
    lfo.connect(lfoG); lfoG.connect(swell.gain);
    const hum = ctx.createOscillator(), humG = ctx.createGain(); hum.frequency.value = 52; humG.gain.value = 0.012;
    const master = ctx.createGain(); master.gain.value = ambMuted ? 0 : 0.5;
    src.connect(lp); lp.connect(swell); swell.connect(master); hum.connect(humG); humG.connect(master); master.connect(ctx.destination);
    src.start(); lfo.start(); hum.start();
    synthNodes = { gain: master, nodes: [src, lfo, hum] };
  }
  function stopSynth() { if (synthNodes) synthNodes.gain.gain.value = 0; }
  GU.ambient = {
    on: function () { return ambOn; },
    toggle: function () {
      ambOn = !ambOn;
      if (ambOn) {
        if (!tracks) tracks = cfg.ambient.map(function (t) { const a = new Audio(cfg.audioDir + t.file); a.loop = true; a.volume = t.volume; return a; });
        let ok = 0, settled = 0;
        tracks.forEach(function (a) {
          const done = function (good) { settled++; if (good) ok++; if (settled === tracks.length && !ok && ambOn) startSynth(); };
          if (ambMuted) { done(true); return; }
          const p = a.play();
          if (p && p.then) p.then(function () { done(true); }, function () { done(false); }); else done(true);
        });
      } else { tracks && tracks.forEach(function (a) { a.pause(); }); stopSynth(); }
      return ambOn;
    },
    setMuted: function (m) {
      ambMuted = m;
      if (tracks) tracks.forEach(function (a) { a.muted = m; });
      if (synthNodes) synthNodes.gain.gain.value = (m || !ambOn) ? 0 : 0.5;
    },
    pageTurn: function () {
      if (!ambOn || ambMuted) return;
      try {
        pageAudio = pageAudio || new Audio(cfg.audioDir + cfg.pageTurn.file);
        pageAudio.volume = cfg.pageTurn.volume; pageAudio.currentTime = 0;
        const p = pageAudio.play(); if (p && p.catch) p.catch(function () {});
      } catch (e) {}
    }
  };

  /* ---------------- toast + share ---------------- */
  let toastT;
  GU.toast = function (msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 2600);
  };
  GU.share = function () {
    const data = { title: 'The Gift Unasked', text: cfg.shareText, url: location.href };
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(location.href).then(function () { GU.toast('Link copied.'); }, function () { GU.toast(location.href); });
    } else { GU.toast(location.href); }
  };

  /* ---------------- "Who won?" ---------------- */
  GU.verdict = async function (hooks) {
    const v = $('#verdict'), steps = v.querySelectorAll('.vstep'), choices = $('#vchoices'), after = $('#vafter');
    steps.forEach(function (s) { s.classList.remove('in'); });
    choices.classList.remove('in'); after.classList.remove('in'); after.hidden = true;
    v.querySelectorAll('.vc').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    v.classList.add('active'); v.removeAttribute('aria-hidden');
    const gaps = [3200, 3600, 3400, 3400, 3400, 3000];
    for (let i = 0; i < steps.length; i++) { await sleep(i === 0 ? 1200 : 300); steps[i].classList.add('in'); await sleep(gaps[i] || 3000); }
    choices.classList.add('in');
    $('#vskip').focus({ preventScroll: true });
    const go = function () { v.classList.remove('active'); v.setAttribute('aria-hidden', 'true'); hooks.done(); };
    $('#vskip').onclick = go; $('#vgo').onclick = go;
    v.querySelectorAll('.vc').forEach(function (b) {
      b.onclick = function () {
        v.querySelectorAll('.vc').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        after.hidden = false; requestAnimationFrame(function () { after.classList.add('in'); });
      };
    });
  };

  /* ---------------- final scene ---------------- */
  let finaleTok = 0;
  GU.finale = async function () {
    const f = $('#finale'), my = ++finaleTok, lines = f.querySelectorAll('.fl'), end = $('#fend');
    document.body.classList.add('finale');
    f.classList.add('active'); f.removeAttribute('aria-hidden');
    lines.forEach(function (l) { l.classList.remove('in', 'out'); }); end.classList.remove('in'); end.hidden = true;
    await sleep(3500);
    for (let i = 0; i < lines.length; i++) {
      if (my !== finaleTok) return;
      lines[i].classList.add('in');
      await sleep(i === lines.length - 1 ? 7000 : 3600);
      if (i < lines.length - 1) { lines[i].classList.add('out'); await sleep(1600); }
    }
    if (my !== finaleTok) return;
    lines[lines.length - 1].classList.add('out'); await sleep(2200);
    end.hidden = false; requestAnimationFrame(function () { end.classList.add('in'); });
  };
  GU.finaleReset = function () {
    finaleTok++; const f = $('#finale');
    f.classList.remove('active'); f.setAttribute('aria-hidden', 'true'); document.body.classList.remove('finale');
  };
  $('#candle').addEventListener('click', function () {
    const c = this; c.classList.add('bright'); setTimeout(function () { c.classList.remove('bright'); }, 1600);
  });
  $('#share').addEventListener('click', GU.share);
})();
