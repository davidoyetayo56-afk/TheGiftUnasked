/* THE GIFT UNASKED — narration (native Web Speech API, no external service) */
(function () {
  'use strict';
  const GU = window.GU, cfg = GU.config;
  const synth = window.speechSynthesis;
  const supported = !!(synth && window.SpeechSynthesisUtterance);
  let voices = [], chosen = { poet: null, theo: null };
  let token = 0, paused = false, muted = false, cur = null;

  function store(k, v) { try { v === undefined ? localStorage.getItem(k) : localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  function pick(hints, exclude) {
    for (const h of hints) {
      const v = voices.find(function (x) { return x !== exclude && x.name.indexOf(h) !== -1; });
      if (v) return v;
    }
    return voices.find(function (x) { return x !== exclude; }) || exclude || null;
  }
  function refresh() {
    if (!supported) return;
    const all = synth.getVoices();
    voices = all.filter(function (v) { return /^en/i.test(v.lang); });
    if (!voices.length) voices = all;
    const sp = load('gu-voice-poet'), st = load('gu-voice-theo');
    chosen.poet = voices.find(function (v) { return v.voiceURI === sp; }) || pick(cfg.voiceHints.poet);
    chosen.theo = voices.find(function (v) { return v.voiceURI === st; }) || pick(cfg.voiceHints.theo, chosen.poet);
    if (GU.narration && GU.narration.onVoices) GU.narration.onVoices();
  }
  if (supported) { refresh(); synth.onvoiceschanged = refresh; }

  // Speech text only: join broken lines with a soft comma so the voice breathes at line ends.
  function speechText(t) {
    return t.replace(/([^.,;:!?—”’"\s])[ \t]*\n/g, '$1, ').replace(/\s*\n\s*/g, ' ').replace(/[“”]/g, '"');
  }
  function chunks(t) {
    const out = [], parts = t.match(/[^.!?]+[.!?"]*\s*/g) || [t];
    let buf = '';
    parts.forEach(function (p) {
      if ((buf + p).length > 180 && buf) { out.push(buf); buf = p; } else buf += p;
    });
    if (buf.trim()) out.push(buf);
    return out;
  }

  function run(c, my) {
    if (!c || my !== token) return;
    if (c.i >= c.parts.length) { const r = c.resolve; cur = null; r('done'); return; }
    const u = new SpeechSynthesisUtterance(c.parts[c.i]);
    const p = cfg.voices[c.who];
    u.voice = chosen[c.who] || null;
    if (u.voice) u.lang = u.voice.lang;
    u.rate = p.rate; u.pitch = p.pitch; u.volume = muted ? 0 : p.volume;
    c.u = u; // keep a reference (some browsers garbage-collect live utterances)
    u.onend = function () { if (my !== token) return; c.i++; run(c, my); };
    u.onerror = function (e) { if (my !== token) return; if (e && (e.error === 'interrupted' || e.error === 'canceled')) return; c.i++; run(c, my); };
    synth.speak(u);
  }

  GU.narration = {
    supported: supported,
    voices: function () { return voices; },
    chosen: function () { return chosen; },
    setVoice: function (who, uri) {
      const v = voices.find(function (x) { return x.voiceURI === uri; });
      if (v) { chosen[who] = v; store('gu-voice-' + who, uri); }
    },
    setMuted: function (m) { muted = m; if (m && supported) { /* current utterance finishes silently on next chunk */ } },
    isPaused: function () { return paused; },
    // Resolves 'done' when finished, never rejects. If speech is unavailable it resolves immediately.
    speak: function (text, who) {
      if (!supported) return Promise.resolve('done');
      const wasPaused = paused;
      this.stop();
      paused = wasPaused;
      const my = ++token;
      return new Promise(function (resolve) {
        cur = { who: who, parts: chunks(speechText(text)), i: 0, resolve: resolve };
        const c = cur;
        if (!paused) run(c, my);
      });
    },
    pause: function () { if (!supported) return; paused = true; token++; synth.cancel(); },
    resume: function () {
      if (!supported || !paused) return;
      paused = false;
      if (cur) run(cur, ++token); else token++;
    },
    stop: function () {
      if (!supported) return;
      token++; paused = false;
      const c = cur; cur = null;
      synth.cancel();
      if (c) c.resolve('stopped');
    }
  };
})();
