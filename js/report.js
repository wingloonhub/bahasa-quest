/* report.js — analitik Laporan Ibu Bapa.
   Sumber data: sesi Persediaan Peperiksaan yang direkodkan pada profil aktif.
   Apabila mod Pengembaraan dibuka nanti, statistik pertempuran akan
   digabungkan di sini juga (p.stats.byTopic). */
(function () {
  "use strict";

  function band(acc, attempts) {
    if (attempts < 4) return { txt: "Perlu lebih latihan", cls: "tag-mid", color: "#e0a83a" };
    if (acc >= 0.8)   return { txt: "Kukuh", cls: "tag-strong", color: "#4ec46a" };
    if (acc >= 0.55)  return { txt: "Semakin baik", cls: "tag-mid", color: "#e0a83a" };
    return              { txt: "Lemah — beri tumpuan", cls: "tag-weak", color: "#e2554d" };
  }

  function topicLabel(topicId) {
    const t = (window.DATA && DATA.anyTopic) ? DATA.anyTopic(topicId) : null;
    return (t && t.label) || topicId;
  }

  function timeAgo(ts) {
    const s = Math.max(1, (Date.now() - ts) / 1000);
    if (s < 60)     return "baru sahaja";
    if (s < 3600)   return Math.floor(s / 60) + " minit lalu";
    if (s < 86400)  return Math.floor(s / 3600) + " jam lalu";
    if (s < 604800) return Math.floor(s / 86400) + " hari lalu";
    return Math.floor(s / 604800) + " minggu lalu";
  }

  function build() {
    const p = STORE.active();
    const history = (p && p.exam && p.exam.history) || [];

    // Kumpul mengikut topik.
    const byTopic = {};
    history.forEach(function (h) {
      if (!byTopic[h.topicId]) byTopic[h.topicId] = { sessions: 0, total: 0, correct: 0, latest: null, ts: 0 };
      const b = byTopic[h.topicId];
      b.sessions++;
      b.total += h.total || 0;
      b.correct += h.correct || 0;
      if ((h.ts || 0) > b.ts) { b.ts = h.ts || 0; b.latest = h.pct; }
    });

    const rows = Object.keys(byTopic).map(function (tid) {
      const b = byTopic[tid];
      const acc = b.total ? b.correct / b.total : 0;
      return {
        topic: tid, label: topicLabel(tid),
        sessions: b.sessions, attempts: b.total, correct: b.correct,
        latest: b.latest, acc, pct: Math.round(acc * 100), band: band(acc, b.total)
      };
    }).sort(function (a, b) { return a.acc - b.acc; });

    const totalQ = rows.reduce(function (a, r) { return a + r.attempts; }, 0);
    const totalC = rows.reduce(function (a, r) { return a + r.correct; }, 0);
    const weakest = rows.filter(function (r) { return r.attempts >= 4 && r.acc < 0.7; }).slice(0, 3);

    let summary;
    if (!totalQ) {
      summary = "Belum ada sesi latihan direkodkan. Selesaikan satu sesi dalam <b>Persediaan Peperiksaan</b> dan laporan ini akan terisi sendiri.";
    } else if (weakest.length) {
      summary = "Ketepatan keseluruhan <b>" + Math.round(totalC / totalQ * 100) + "%</b> daripada <b>" + totalQ + "</b> soalan. " +
        "Topik yang paling perlu bantuan: <b>" + weakest.map(function (w) { return w.label; }).join(", ") + "</b>.";
    } else {
      summary = "Ketepatan keseluruhan <b>" + Math.round(totalC / totalQ * 100) + "%</b> daripada <b>" + totalQ + "</b> soalan. " +
        "Tiada topik lemah yang ketara — teruskan latihan untuk gambaran yang lebih tajam.";
    }

    // Kesilapan terkini daripada 5 sesi terakhir.
    const recent = [];
    for (const h of history.slice(0, 5)) {
      for (const m of (h.mistakes || [])) {
        recent.push({
          label: topicLabel(h.topicId),
          q: m.q || "Soalan",
          chosen: m.chosen,
          answer: m.answer,
          when: timeAgo(h.ts)
        });
        if (recent.length >= 12) break;
      }
      if (recent.length >= 12) break;
    }

    return {
      rows, totalQ, totalC, weakest, summary, recent,
      sessions: history.length,
      overallPct: totalQ ? Math.round(totalC / totalQ * 100) : 0
    };
  }

  window.REPORT = { build, band, topicLabel, timeAgo };
})();
