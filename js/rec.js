// =============================================
//  地元の最強  試合の録画（動画で投稿）
//  ・試合の様子を 720×960 の動画にする（上：名前・残り・時計、まん中：土俵、下：#と URL）
//  ・音も入れる。mp4 が作れるブラウザは mp4（X に上げられる）、だめなら webm
// =============================================
(function () {
  const JM = window.JM, R = JM.R;
  const T = (k, v) => I18N.t(k, v);
  const VW = 720, VH = 960, TOP = 176, BOT = 104;
  const COL = ['#f06a5a', '#5b8be0'];
  let cv = null, g = null, rec = null, vtrack = null, chunks = [], state = 'idle', blob = null, key = null, mime = null, cb = null;
  const Rec = JM.Rec = {};
  function pickMime() {
    if (mime !== null) return mime;
    mime = '';
    if (!window.MediaRecorder) return (mime = null);
    const L = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4;codecs=avc1,mp4a.40.2', 'video/mp4;codecs=avc1', 'video/mp4',
      'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
    for (const m of L) { try { if (MediaRecorder.isTypeSupported(m)) return (mime = m); } catch (e) {} }
    return mime;
  }
  Rec.supported = () => !!(window.MediaRecorder && window.HTMLCanvasElement && HTMLCanvasElement.prototype.captureStream) && pickMime() !== null;
  Rec.state = () => state;
  Rec.key = () => key;
  Rec.recording = () => state === 'rec';
  Rec.blob = k => (state === 'done' && key === k ? blob : null);
  Rec.type = () => (blob && blob.type) || (pickMime() || 'video/webm').split(';')[0];
  Rec.isMp4 = () => /mp4/.test(Rec.type());
  // mp4 でも音が AAC でないと、X に上げられないことがある
  Rec.xSafe = () => Rec.isMp4() && (/mp4a/.test(mime || '') || mime === 'video/mp4');
  Rec.ext = () => (Rec.isMp4() ? 'mp4' : 'webm');
  // 録画を始める。k：どの試合か（結果の digest）
  Rec.start = function (k) {
    Rec.cancel();
    if (!Rec.supported()) return false;
    try {
      if (!cv) { cv = document.createElement('canvas'); cv.width = VW; cv.height = VH; g = cv.getContext('2d'); }
      if (!g) return false;
      g.fillStyle = '#2a211b'; g.fillRect(0, 0, VW, VH);
      const vs = cv.captureStream(30); vtrack = vs.getVideoTracks()[0];
      const tracks = [vtrack];
      const as = JM.S && JM.S.recStream && JM.S.recStream();
      if (as) for (const t of as.getAudioTracks()) tracks.push(t);
      const opt = { videoBitsPerSecond: 3000000, audioBitsPerSecond: 128000 };
      if (mime) opt.mimeType = mime;
      rec = new MediaRecorder(new MediaStream(tracks), opt);
      chunks = []; blob = null; key = k; state = 'rec';
      const me = rec;
      rec.ondataavailable = e => { if (me === rec && e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = () => {
        if (me !== rec) return;
        const type = (rec.mimeType || mime || 'video/webm').split(';')[0];
        blob = chunks.length ? new Blob(chunks, { type }) : null; chunks = [];
        state = blob ? 'done' : 'idle';
        const f = cb; cb = null; if (f) f(blob);
      };
      rec.onerror = () => { if (me === rec) { state = 'idle'; blob = null; const f = cb; cb = null; if (f) f(null); } };
      rec.start(1000);
      return true;
    } catch (e) { state = 'idle'; rec = null; return false; }
  };
  // 止めて仕上げる（できたら done(blob)）
  Rec.stop = function (done) {
    if (state !== 'rec' || !rec) { if (done) done(Rec.blob(key)); return; }
    state = 'stopping'; cb = done || null;
    try { rec.stop(); } catch (e) { state = 'idle'; if (cb) { const f = cb; cb = null; f(null); } }
    try { if (vtrack) vtrack.stop(); } catch (e) {}   // 音の線は次の録画でも使うので止めない
  };
  // やめる（できかけの動画はすてる）
  Rec.cancel = function () {
    if (rec && (state === 'rec' || state === 'stopping')) { const r = rec; rec = null; try { r.stop(); } catch (e) {} }
    try { if (vtrack) vtrack.stop(); } catch (e) {}
    rec = null; vtrack = null; chunks = []; cb = null;
    if (state !== 'done') { state = 'idle'; blob = null; key = null; }
  };
  Rec.clear = function () { Rec.cancel(); state = 'idle'; blob = null; key = null; };

  // ---------- 1コマ描く ----------
  function fit(text, max, size, font) {
    let s = size; g.font = font.replace('#', s);
    while (s > 12 && g.measureText(text).width > max) { s -= 1; g.font = font.replace('#', s); }
    if (g.measureText(text).width > max) { while (text.length > 1 && g.measureText(text + '…').width > max) text = text.slice(0, -1); text += '…'; }
    return text;
  }
  const FONT_T = () => (I18N.lang === 'ko' ? "#px 'Black Han Sans','Dela Gothic One',sans-serif" : "#px 'Dela Gothic One',sans-serif");
  const FONT_M = "900 #px 'M PLUS Rounded 1c',sans-serif";
  // o: { names:[左,右], call: 文字（html）, end: 0〜1（おわりの帯） }
  Rec.frame = function (m, o) {
    if (state !== 'rec' || !g) return;
    R.drawTo(cv, g, VW, VH, m, { names: o.names, top: TOP, bot: BOT, dt: 1e-9 });
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.textBaseline = 'alphabetic';
    // 上の帯
    const gr = g.createLinearGradient(0, 0, 0, TOP); gr.addColorStop(0, 'rgba(20,15,11,.95)'); gr.addColorStop(1, 'rgba(20,15,11,0)');
    g.fillStyle = gr; g.fillRect(0, 0, VW, TOP);
    g.textAlign = 'center'; g.fillStyle = '#ffcf3a'; g.strokeStyle = '#1f1a17'; g.lineWidth = 6; g.lineJoin = 'round';
    const title = fit(T('doc_title'), 520, 34, FONT_T()); g.strokeText(title, VW / 2, 46); g.fillText(title, VW / 2, 46);
    const A = m.A.ratio(), B = m.B.ratio();
    for (let i = 0; i < 2; i++) {
      const r = Math.max(0, Math.min(1, i ? B : A)), x0 = i ? 410 : 24, w = 286;
      g.textAlign = i ? 'right' : 'left';
      const nm = fit(o.names[i] || '', w, 30, FONT_M);
      g.lineWidth = 5; g.strokeStyle = '#1f1a17'; g.strokeText(nm, i ? VW - 24 : 24, 92); g.fillStyle = '#fff'; g.fillText(nm, i ? VW - 24 : 24, 92);
      g.fillStyle = 'rgba(255,255,255,.18)'; rr(x0, 106, w, 20, 10); g.fill();
      g.fillStyle = COL[i]; const fw = w * r; if (fw > 1) { rr(i ? x0 + w - fw : x0, 106, fw, 20, 10); g.fill(); }
      g.fillStyle = 'rgba(255,255,255,.7)'; const lx = i ? x0 + w - w * JM.LOSE : x0 + w * JM.LOSE; g.fillRect(lx - 1, 104, 3, 24);
      g.font = FONT_M.replace('#', 24); g.fillStyle = '#f3ead6'; g.fillText(Math.round(r * 100) + '%', i ? VW - 24 : 24, 156);
    }
    g.textAlign = 'center'; g.font = "52px 'Dela Gothic One',sans-serif"; g.fillStyle = '#ffcf3a'; g.lineWidth = 6; g.strokeStyle = '#1f1a17';
    const ck = String(Math.max(0, Math.ceil(JM.TMAX - m.t))); g.strokeText(ck, VW / 2, 132); g.fillText(ck, VW / 2, 132);
    // まん中の大きな文字
    if (o.call) {
      const sm = (o.call.match(/<small>([\s\S]*?)<\/small>/) || [])[1] || '';
      const main = o.call.replace(/<small>[\s\S]*?<\/small>/, '').replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '').trim();
      const lines = main.split('\n').filter(Boolean);
      let y = VH * 0.47 - (lines.length - 1) * 40;
      for (const ln of lines) {
        const t = fit(ln, 660, 84, FONT_T());
        g.lineWidth = 12; g.strokeStyle = '#1f1a17'; g.strokeText(t, VW / 2, y); g.fillStyle = '#fff'; g.fillText(t, VW / 2, y); y += 92;
      }
      if (sm) { const t = fit(sm.replace(/<[^>]+>/g, ''), 620, 30, FONT_M); g.lineWidth = 6; g.strokeText(t, VW / 2, y - 40); g.fillStyle = '#f3ead6'; g.fillText(t, VW / 2, y - 40); }
    }
    // 下の帯
    const gb = g.createLinearGradient(0, VH - BOT, 0, VH); gb.addColorStop(0, 'rgba(20,15,11,0)'); gb.addColorStop(1, 'rgba(20,15,11,.95)');
    g.fillStyle = gb; g.fillRect(0, VH - BOT, VW, BOT);
    g.textAlign = 'center'; g.font = FONT_M.replace('#', 28); g.fillStyle = '#ffcf3a'; g.lineWidth = 5; g.strokeStyle = '#1f1a17';
    const tag = T('hashtag'); g.strokeText(tag, VW / 2, VH - 56); g.fillText(tag, VW / 2, VH - 56);
    g.font = FONT_M.replace('#', 22); g.fillStyle = '#f3ead6'; g.fillText('nasubi-no-oniwa.github.io/jimoto', VW / 2, VH - 22);
  };
  function rr(x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
})();
