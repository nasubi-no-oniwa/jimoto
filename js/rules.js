// =============================================
//  地元の最強  きまり（政策カード・交付金・能力）
//  ここを変えると強さのバランスが変わる
// =============================================
(function (G) {
  const JM = G.JM = G.JM || {};
  JM.STATS = [
    { k: 'hp', n: '体力', from: '面積' },
    { k: 'atk', n: '勢い', from: '人口' },
    { k: 'def', n: 'かたさ', from: '形のまとまり' },
    { k: 'shp', n: '鋭さ', from: '形のトゲ' },
    { k: 'spd', n: '速さ', from: '人口密度' },
  ];
  // 政策カード（値段・能力の上げ下げ・特別な効果）
  JM.POLICIES = [
    { k: 'road', n: '道路整備', c: 3, d: { spd: 25, hp: -5 }, t: '速さ↑↑ 体力↓' },
    { k: 'dam', n: 'ダム建設', c: 3, d: { def: 15, spd: -10 }, t: 'かたさ↑ 速さ↓' },
    { k: 'redev', n: '再開発', c: 3, d: { shp: 25, hp: -5 }, t: '鋭さ↑↑ 体力↓' },
    { k: 'port', n: '港湾整備', c: 2, d: {}, t: 'かべで跳ね返ると加速し、次の一撃が強い' },
    { k: 'pr', n: '観光PR', c: 4, d: { atk: 10 }, t: '勢い↑ 相手を強く引き寄せる' },
    { k: 'drill', n: '防災訓練', c: 4, d: {}, t: '大きな一撃を1回だけ防ぐ' },
    { k: 'shinkansen', n: '新幹線開通', c: 5, d: {}, t: '最初の一撃だけ超強力' },
    { k: 'gappei', n: '合併協議', c: 5, d: {}, t: '割った欠片の分だけ回復' },
    { k: 'furusato', n: 'ふるさと納税', c: 6, d: {}, t: '当てるたびに勢いが増す' },
    { k: 'castle', n: '城下町保存', c: 6, d: {}, t: '中心部だけは絶対に割れない' },
  ];
  JM.POL = Object.fromEntries(JM.POLICIES.map(p => [p.k, p]));
  // 階級（人口で分ける。人口がわからないものは村の部）
  JM.CLASSES = [
    { k: 'all', n: '全体の部', t: 'すべての市町村', min: 0, max: Infinity },
    { k: 's', n: '村の部', t: '人口1万人まで', min: 0, max: 10000 },
    { k: 'm', n: '町の部', t: '人口1万〜5万人', min: 10000, max: 50000 },
    { k: 'l', n: '市の部', t: '人口5万〜30万人', min: 50000, max: 300000 },
    { k: 'xl', n: '大都市の部', t: '人口30万人以上', min: 300000, max: Infinity },
  ];
  JM.CLS = Object.fromEntries(JM.CLASSES.map(c => [c.k, c]));
  JM.inClass = (k, pop) => { const c = JM.CLS[k] || JM.CLS.all; const p = pop || 0; return p >= c.min && p < c.max; };
  // 下剋上：もとの能力の合計が、負けた相手より大きく下なのに勝ったとき
  JM.statSum = st => st.reduce((a, b) => a + b, 0);
  JM.GEKOKUJO = 25;
  JM.MAXCARDS = 3;
  JM.BASE_BUDGET = 10;
  // 交付金：人口が少ないほど多い（5万人以上はなし）
  JM.kofukin = pop => (!pop ? 0 : pop < 5000 ? 10 : pop < 20000 ? 6 : pop < 50000 ? 3 : 0);
  // 政策をつけた後の能力。cards は選んだ順
  JM.compose = function (base, cards, pop) {
    const st = { hp: base[0], atk: base[1], def: base[2], shp: base[3], spd: base[4] };
    const add = { hp: [0, 0], atk: [0, 0], def: [0, 0], shp: [0, 0], spd: [0, 0] };   // [ふつうの予算, 交付金]
    let spent = 0;
    for (const k of cards || []) {
      const p = JM.POL[k]; if (!p) continue;
      const byKofu = spent + p.c > JM.BASE_BUDGET; spent += p.c;
      for (const s in p.d) add[s][byKofu ? 1 : 0] += p.d[s];
    }
    const out = {};
    for (const s in st) out[s] = Math.max(0, Math.min(110, st[s] + add[s][0] + add[s][1]));
    return { st: out, add, spent, budget: JM.BASE_BUDGET + JM.kofukin(pop) };
  };
  JM.canAdd = function (cards, k, pop) {
    if (!cards || cards.includes(k) || cards.length >= JM.MAXCARDS) return false;
    const spent = cards.reduce((s, c) => s + JM.POL[c].c, 0);
    return spent + JM.POL[k].c <= JM.BASE_BUDGET + JM.kofukin(pop);
  };
})(typeof window !== 'undefined' ? window : globalThis);
