// =============================================
//  地元の最強  結果画像（SNSに貼る画像 1200×675）
//  ・左：決着の一撃の瞬間を大きく
//  ・右：勝ち名乗り（勝った名前を大きく、「〇〇を破る」、残りの割合、自慢の一言）
// =============================================
(function () {
  const JM = window.JM, D = JM.D, R = JM.R;
  const W = 1200, H = 675, LW = 700, RX = 935;
  const F_BIG = '"Dela Gothic One", sans-serif', F_FUDE = '"Yuji Syuku", serif', F_UI = '"M PLUS Rounded 1c", sans-serif';
  const fmt = n => Math.round(n).toLocaleString('ja-JP');
  const isCountry = e => e.p === 48;
  const nameOf = e => e.n;
  const whereOf = e => e.where || (e.pn + (e.c ? ' ' + e.c : ''));

  // 自慢の一言（条件にあうものを、強い順に2つまで）
  JM.resultTags = function (r, e0, e1) {
    const out = [];
    if (r.winner < 0) { if (r.endBy === 'time') out.push({ t: '時間切れ判定' }); return out; }
    const w = r.winner ? e1 : e0, l = r.winner ? e0 : e1, wr = r.winner ? r.rb : r.ra;
    if (r.gk) out.push({ t: '下剋上！', gold: true });
    if (!isCountry(w) && isCountry(l)) out.push({ t: '国を倒した！', gold: true });
    if (w.t && !l.t) out.push({ t: '時代をこえて', gold: true });
    if (r.endBy === 'break' && r.hitN === 1) out.push({ t: '一撃！', gold: true });
    if (w.p === l.p && w.p !== 48) out.push({ t: w.p < 48 ? '地元対決' : '国内対決' });
    if (r.endBy === 'break' && wr < 0.45) out.push({ t: 'ギリギリの勝ち' });
    if (r.endBy === 'time') out.push({ t: '時間切れ判定' });
    return out.slice(0, 2);
  };

  // 人口の差がとても大きいときのひと言（例：人口は相手の24分の1）
  function popNote(w, l) {
    if (!w.pop || !l.pop) return '';
    const k = l.pop / w.pop;
    if (k >= 5) return `人口は相手の${fmt(k)}分の1`;
    return '';
  }

  // 横はばに入るまで文字を小さくする。それでも入らないときは2行にする
  function fitLines(c, text, font, size, min, maxW) {
    let s = size; c.font = font(s);
    while (c.measureText(text).width > maxW && s > min) { s -= 2; c.font = font(s); }
    if (c.measureText(text).width <= maxW) return { s, lines: [text] };
    // 2行：区切りやすい文字（＝・ー・空白）の近くで切る。なければ真ん中
    let cut = -1, best = 1e9;
    for (let i = 1; i < text.length; i++) if ('＝・ 　'.includes(text[i - 1]) && Math.abs(i - text.length / 2) < best) { best = Math.abs(i - text.length / 2); cut = i; }
    if (cut < 0) cut = Math.ceil(text.length / 2);
    const lines = [text.slice(0, cut).replace(/[ 　]+$/, ''), text.slice(cut)];
    s = size; c.font = font(s);
    while (Math.max(...lines.map(t => c.measureText(t).width)) > maxW && s > 20) { s -= 2; c.font = font(s); }
    return { s, lines };
  }

  async function fontsReady() {
    if (!document.fonts || !document.fonts.load) return;
    const wait = Promise.all([
      document.fonts.load('400 80px "Dela Gothic One"', '地元の最強勝ち'),
      document.fonts.load('400 60px "Yuji Syuku"', '勝負ありの勝ち！引き分け'),
      document.fonts.load('800 20px "M PLUS Rounded 1c"', 'のこり破る'),
    ]);
    await Promise.race([wait, new Promise(r => setTimeout(r, 2500))]).catch(() => {});
  }

  // cv：描く先（1200×675）。o：{ m, r, e:[e0,e1], cards:[[],[]], pol, chal }
  JM.drawResultImage = async function (cv, o) {
    await fontsReady();
    const c = cv.getContext('2d'), { m, r } = o, [e0, e1] = o.e;
    c.setTransform(1, 0, 0, 1, 0, 0); c.textBaseline = 'middle';
    c.fillStyle = '#17110d'; c.fillRect(0, 0, W, H);
    // ---- 左：決着の瞬間 ----
    const SNAP = 900;
    let snap = null; try { snap = R.snapshot(m, SNAP, r.endBy === 'break' ? r.lastEv : null); } catch (e) { snap = null; }
    const hx = r.endBy === 'break' && r.lastEv ? r.lastEv.x : (m.A.x + m.B.x) / 2, hy = r.endBy === 'break' && r.lastEv ? r.lastEv.y : (m.A.y + m.B.y) / 2;
    const zoom = 0.85, sw = LW / zoom, sh = H / zoom;
    let fx = LW / 2, fy = H / 2;
    c.save(); c.beginPath(); c.rect(0, 0, LW, H); c.clip();
    if (snap) {
      const sc = snap.sc;
      let sx = SNAP / 2 + hx * sc - sw / 2, sy = SNAP / 2 + hy * sc - sh / 2;
      sx = Math.max(0, Math.min(SNAP - sw, sx)); sy = Math.max(0, Math.min(SNAP - sh, sy));
      c.drawImage(snap, sx, sy, sw, sh, 0, 0, LW, H);
      R.free(snap);
      fx = (SNAP / 2 + hx * sc - sx) * zoom; fy = (SNAP / 2 + hy * sc - sy) * zoom;
    } else {
      // 絵を作れない端末：試合画面の絵（土俵のまわり）をそのまま使う
      const a = document.getElementById('arena');
      if (a && a.width && R.sc) {
        const k = a.width / a.clientWidth, s2 = R.sc * JM.R_ARENA * 2.1 * k, cx = R.cx * k, cy = R.cy * k;
        try { c.drawImage(a, cx - s2 / 2, cy - s2 / 2, s2, s2, LW / 2 - H * 0.55, -H * 0.05, H * 1.1, H * 1.1); } catch (e) {}
      }
    }
    // 集中線（当たった所から）
    if (r.winner >= 0) {
      c.save(); c.translate(fx, fy); c.globalAlpha = 0.16; c.fillStyle = '#fff';
      for (let i = 0; i < 72; i++) { const an = i / 72 * Math.PI * 2 + (i % 3) * 0.021, r0 = 240 + (i * 37 % 70); c.beginPath(); c.moveTo(Math.cos(an) * r0, Math.sin(an) * r0); c.lineTo(Math.cos(an + 0.011) * 1000, Math.sin(an + 0.011) * 1000); c.lineTo(Math.cos(an - 0.011) * 1000, Math.sin(an - 0.011) * 1000); c.fill(); }
      c.restore();
    }
    const vg = c.createRadialGradient(fx, fy, 170, fx, fy, 600); vg.addColorStop(0, 'rgba(23,17,13,0)'); vg.addColorStop(1, 'rgba(23,17,13,.85)'); c.fillStyle = vg; c.fillRect(0, 0, LW, H);
    const fade = c.createLinearGradient(LW - 230, 0, LW, 0); fade.addColorStop(0, 'rgba(23,17,13,0)'); fade.addColorStop(1, 'rgba(23,17,13,1)'); c.fillStyle = fade; c.fillRect(LW - 230, 0, 230, H);
    c.restore();
    // ロゴ
    c.textAlign = 'left'; c.font = '400 30px ' + F_BIG;
    c.lineWidth = 6; c.strokeStyle = 'rgba(23,17,13,.8)'; c.lineJoin = 'round';
    c.strokeText('地元の最強', 30, 44); c.fillStyle = '#fff'; c.fillText('地元の', 30, 44); c.fillStyle = '#ffcf3a'; c.fillText('最強', 30 + c.measureText('地元の').width, 44);
    // ---- 右：勝ち名乗り ----
    const draw = r.winner < 0, w = draw ? null : (r.winner ? e1 : e0), l = draw ? null : (r.winner ? e0 : e1);
    // 朱のはんこ
    c.save(); c.translate(1100, 92); c.rotate(0.12);
    c.fillStyle = draw ? '#6a5a4a' : '#c8281c'; c.beginPath(); c.arc(0, 0, 58, 0, Math.PI * 2); c.fill();
    c.strokeStyle = '#f6eedb'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 50, 0, Math.PI * 2); c.stroke();
    c.fillStyle = '#f6eedb'; c.textAlign = 'center'; c.font = '400 34px ' + F_FUDE;
    if (draw) { c.fillText('痛み', 0, -16); c.fillText('分け', 0, 22); } else { c.fillText('勝負', 0, -16); c.fillText('あり', 0, 22); }
    c.restore();
    c.textAlign = 'center';
    let y;
    if (draw) {
      c.font = '400 92px ' + F_FUDE; c.fillStyle = '#fff'; c.fillText('引き分け', RX, 250);
      c.font = '800 26px ' + F_UI; c.fillStyle = '#d8c6a4';
      const a = fitLines(c, D.fname(e0) + ' と ' + D.fname(e1), s => `800 ${s}px ${F_UI}`, 26, 18, 470);
      a.lines.forEach((t, i) => c.fillText(t, RX, 350 + i * 32)); y = 350 + a.lines.length * 32;
    } else {
      // 位置は固定（長い名前でも下の段とかさならないように）
      c.font = '800 24px ' + F_UI; c.fillStyle = '#d8c6a4';
      const wh = fitLines(c, whereOf(w), s => `800 ${s}px ${F_UI}`, 24, 16, 470); c.font = `800 ${wh.s}px ${F_UI}`; c.fillText(wh.lines.join(' '), RX, 172);
      let nm = fitLines(c, nameOf(w), s => `400 ${s}px ${F_BIG}`, 108, 50, 470);
      if (nm.lines.length > 1) nm.s = Math.min(nm.s, 62);
      const lh = nm.s * 1.06, top = nm.lines.length === 1 ? 252 : 252 - lh / 2;
      c.lineJoin = 'round';
      nm.lines.forEach((t, i) => {
        const yy = top + i * lh; c.font = `400 ${nm.s}px ${F_BIG}`;
        c.lineWidth = Math.max(8, nm.s * 0.13); c.strokeStyle = '#7a1a12'; c.strokeText(t, RX, yy);
        const gr = c.createLinearGradient(0, yy - nm.s / 2, 0, yy + nm.s / 2); gr.addColorStop(0, '#fff6d8'); gr.addColorStop(1, '#ffcf3a'); c.fillStyle = gr; c.fillText(t, RX, yy);
      });
      c.font = '400 64px ' + F_FUDE; c.fillStyle = '#fff'; c.fillText('の勝ち！', RX, 340);
      const lt = fitLines(c, D.fname(l) + ' を破る', s => `800 ${s}px ${F_UI}`, 26, 20, 480);
      c.fillStyle = '#e9dcc0'; c.font = `800 ${lt.s}px ${F_UI}`;
      if (lt.lines.length === 1) c.fillText(lt.lines[0], RX, 396); else { c.fillText(lt.lines[0], RX, 386); c.fillText(lt.lines[1], RX, 386 + lt.s + 4); }
      const pn = popNote(w, l); if (pn) { c.font = '800 19px ' + F_UI; c.fillStyle = '#ffcf3a'; c.fillText(pn, RX, lt.lines.length === 1 ? 428 : 440); }
      y = 0;
    }
    // のこり（バー）。白い線は負けになる35%
    const by = draw ? Math.max(y + 40, 452) : 470;
    const bar = (yy, e, b, side) => {
      const x0 = RX - 210, bw = 420, p = Math.round(b.ratio() * 100);
      c.textAlign = 'left'; c.font = '800 20px ' + F_UI; c.fillStyle = '#efe4cc';
      const nmx = e.n.length > 11 ? e.n.slice(0, 11) + '…' : e.n; c.fillText(nmx, x0, yy);
      c.textAlign = 'right'; c.font = '400 26px ' + F_BIG; c.fillStyle = side === r.winner ? '#ffcf3a' : '#a89c90'; c.fillText(p + '%', x0 + bw, yy);
      c.fillStyle = 'rgba(255,255,255,.13)'; c.fillRect(x0, yy + 18, bw, 10);
      c.fillStyle = R.COL[side].f; c.fillRect(x0, yy + 18, bw * Math.max(0, Math.min(1, b.ratio())), 10);
      c.fillStyle = '#fff'; c.fillRect(x0 + bw * JM.LOSE - 1, yy + 14, 2, 18);
    };
    bar(by, e0, m.A, 0); bar(by + 54, e1, m.B, 1);
    // 札（自慢の一言・政策・挑戦状）
    const tags = JM.resultTags(r, e0, e1).slice();
    if (!draw && o.pol) for (const k of o.cards[r.winner] || []) tags.push({ t: JM.POL[k].n });
    if (o.chal) tags.push({ t: o.chal.n + 'さんの挑戦状' });
    let tx = RX - 210, ty = by + 98; c.textAlign = 'left'; c.font = '800 19px ' + F_UI;
    for (const g of tags) {
      const tw = c.measureText(g.t).width + 26; if (tx + tw > RX + 215) break;
      c.fillStyle = g.gold ? '#ffcf3a' : 'rgba(255,255,255,.15)'; c.beginPath(); (c.roundRect ? c.roundRect(tx, ty, tw, 34, 17) : c.rect(tx, ty, tw, 34)); c.fill();
      c.fillStyle = g.gold ? '#2a211b' : '#efe4cc'; c.fillText(g.t, tx + 13, ty + 18); tx += tw + 9;
    }
    // 下の帯
    c.fillStyle = 'rgba(255,255,255,.08)'; c.fillRect(0, H - 44, W, 44);
    c.font = '800 18px ' + F_UI; c.fillStyle = '#d8c6a4'; c.textAlign = 'left'; c.fillText('#地元の最強', 24, H - 22);
    c.textAlign = 'right'; c.fillText(o.url.replace('https://', '').replace(/\/$/, ''), W - 24, H - 22);
  };
})();
