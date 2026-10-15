// =============================================
//  地元の最強  音（効果音：Kenney「Impact Sounds」CC0／BGM：自作）
// =============================================
(function () {
  const JM = window.JM = window.JM || {};
  let ac = null, bus = null, master = null, mus = null, nbuf = null, sfx = null, SP = null, MB = {}, mark = 0;
  let muted = (() => { try { return localStorage.getItem('jm_mute') === '1'; } catch (e) { return false; } })();
  const url = n => (JM.ASSETS && JM.ASSETS[n]) || ('assets/' + n);
  function A() {
    try {
      if (!ac) {
        ac = new (window.AudioContext || window.webkitAudioContext)();
        const c = ac.createDynamicsCompressor(); c.threshold.value = -14; c.ratio.value = 4;
        master = ac.createGain(); master.gain.value = muted ? 0 : 1; c.connect(master); master.connect(ac.destination); bus = c;
        mus = ac.createGain(); mus.gain.value = 0.32; mus.connect(master);
        nbuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate); const d = nbuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        load(); ac.onstatechange = () => { if (ac.state === 'running' && bg.want && !bg.src) bg.start(bg.want); };
      }
      if (ac.state === 'suspended') ac.resume();
    } catch (e) {} return ac;
  }
  async function buf(n) { const r = await fetch(url(n)); const b = await r.arrayBuffer(); return await new Promise((res, rej) => ac.decodeAudioData(b, res, rej)); }
  function first(b, th) { const d = b.getChannelData(0), n = Math.min(d.length, b.sampleRate * 0.4); for (let i = 0; i < n; i++) if (Math.abs(d[i]) > th) return i / b.sampleRate; return 0; }
  async function load() {
    try { const [b, j] = await Promise.all([buf('sfx.mp3'), fetch(url('sfx.json')).then(r => r.json())]); sfx = b; SP = j; mark = first(b, 0.5); } catch (e) {}
    for (const k of ['bgm', 'title']) { try { MB[k] = await buf(k + '.mp3'); MB[k].lp = first(MB[k], 0.002); } catch (e) {} }
    if (bg.want) bg.start(bg.want);
  }
  const ok = () => { const a = A(); return a && a.state === 'running' ? a : null; };
  function smp(name, v = 1, rate = 1, delay = 0) {
    const a = ok(); if (!a || !sfx || !SP || !SP[name]) return;
    const L = SP[name], it = L[(Math.random() * L.length) | 0], s = a.createBufferSource(), g = a.createGain();
    s.buffer = sfx; s.playbackRate.value = rate; g.gain.value = v; s.connect(g); g.connect(bus); s.start(a.currentTime + delay, mark + it[0], it[1] + 0.02);
  }
  function tone(f, d, type = 'triangle', v = 0.07, delay = 0, f2) { const a = ok(); if (!a) return; const t = a.currentTime + delay, o = a.createOscillator(), g = a.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(g); g.connect(bus); o.start(t); o.stop(t + d + 0.02); }
  function noise(d, v = 0.15, f = 1200, type = 'lowpass', delay = 0, f2) { const a = ok(); if (!a) return; const t = a.currentTime + delay, s = a.createBufferSource(), fl = a.createBiquadFilter(), g = a.createGain(); fl.type = type; fl.frequency.setValueAtTime(f, t); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + d); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d); s.buffer = nbuf; s.connect(fl); fl.connect(g); g.connect(bus); s.start(t, 0, d + 0.05); }
  const rr = (a, b) => a + Math.random() * (b - a);
  const FX = {
    ui() { tone(880, 0.05, 'square', 0.03); },
    start() { tone(70, 0.6, 'sine', 0.35, 0, 45); noise(0.4, 0.2, 300); tone(70, 0.6, 'sine', 0.3, 0.32, 45); },
    go() { tone(80, 0.5, 'sine', 0.4, 0, 40); noise(0.3, 0.25, 900, 'lowpass', 0, 200); },
    hit(v = 1) { smp('stone', 0.4 + v * 0.5, rr(0.85, 1.05)); tone(90, 0.25, 'sine', 0.18 * v, 0, 45); },
    crack(v = 1) { smp('rock', 0.6 + v * 0.4, rr(0.9, 1.1)); smp('stone', 0.4 * v, rr(0.8, 0.95), 0.01); tone(110, 0.3, 'sine', 0.2 * v, 0, 50); },
    break(v = 1) { smp('rock', 0.9, rr(0.75, 0.9)); smp('rock', 0.7, rr(1.0, 1.2), 0.05); smp('punch', 0.6, 0.8); noise(0.6, 0.25, 1500, 'lowpass', 0, 200); tone(60, 0.5, 'sine', 0.35, 0, 35); },
    wall(v = 1) { smp('wood', 0.3 + v * 0.4, rr(0.9, 1.1)); },
    win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.45, 'triangle', 0.08, i * 0.12)); smp('bell', 0.5, 1, 0.1); },
    draw() { [523, 523, 392].forEach((f, i) => tone(f, 0.35, 'triangle', 0.07, i * 0.15)); },
  };
  const SEC = { bgm: 16 * 16 * 60 / 132 / 4, title: 8 * 16 * 60 / 84 / 4 };
  const bg = {
    want: null, cur: null, src: null, g: null,
    start(k) {
      this.want = k; const a = ok(); if (!a) return; if (this.cur === k && this.src) return; const B = MB[k]; if (!B) return;
      this.stop(); this.want = k;
      const s = a.createBufferSource(), g = a.createGain(); s.buffer = B; s.loop = true; s.loopStart = B.lp; s.loopEnd = Math.min(B.duration, B.lp + SEC[k]);
      g.gain.setValueAtTime(0, a.currentTime); g.gain.linearRampToValueAtTime(1, a.currentTime + 0.8); s.connect(g); g.connect(mus); s.start(a.currentTime, B.lp); this.src = s; this.g = g; this.cur = k;
    },
    stop() { if (this.src && ac) { const s = this.src, g = this.g; g.gain.setValueAtTime(g.gain.value, ac.currentTime); g.gain.linearRampToValueAtTime(0, ac.currentTime + 0.3); s.stop(ac.currentTime + 0.35); } this.src = null; this.cur = null; },
  };
  JM.S = {
    unlock() { A(); if (bg.want) bg.start(bg.want); },
    play(k, v) { if (FX[k]) FX[k](v == null ? 1 : v); },
    bgm(k) { bg.want = k === 'battle' ? 'bgm' : 'title'; bg.start(bg.want); },
  };
  JM.mute = v => { if (v != null) { muted = v; try { localStorage.setItem('jm_mute', v ? '1' : '0'); } catch (e) {} if (master) master.gain.value = v ? 0 : 1; } return muted; };
  window.addEventListener('pointerdown', () => JM.S.unlock(), { once: false, passive: true });
})();
