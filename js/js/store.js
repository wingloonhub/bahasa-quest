/* store.js — satu sumber kebenaran untuk data pemain.
   Cache localStorage + tulis ke awan (Firestore) melalui firebase.js.
   Menyokong BEBERAPA PEMAIN (gaya Netflix) di bawah satu akaun. */
(function () {
  "use strict";
  const LS_PREFIX = "bq_save_";
  let uidKey = "guest";
  let cloudWriter = null;        // ditetapkan oleh firebase.js
  let saveTimer = null;
  const listeners = [];

  function newProfileId() { return "p_" + Math.random().toString(36).slice(2, 10); }

  function blankProfile(name, gender) {
    return {
      id: newProfileId(),
      name: (name || "Pemain").trim() || "Pemain",
      gender: gender === "girl" ? "girl" : "boy",
      createdAt: Date.now(),
      lastPlayed: Date.now(),
      quests: {},                              // kemajuan mod pengembaraan (akan datang)
      exam: { history: [] },                   // sesi Persediaan Peperiksaan
      stats: { byTopic: {}, recentWrong: [] }  // ketepatan terkumpul ikut topik
    };
  }

  function blankState() {
    return {
      account: { uid: null, email: null, createdAt: Date.now() },
      profiles: {},
      activeProfileId: null
    };
  }

  function normalise(data) {
    if (!data || typeof data !== "object") return blankState();
    const out = blankState();
    out.account = Object.assign(out.account, data.account || {});
    out.profiles = (data.profiles && typeof data.profiles === "object") ? data.profiles : {};
    // pastikan setiap profil ada bentuk penuh (simpanan lama / separa)
    Object.keys(out.profiles).forEach(function (pid) {
      const p = out.profiles[pid] || {};
      p.id = p.id || pid;
      p.name = p.name || "Pemain";
      p.gender = p.gender === "girl" ? "girl" : "boy";
      p.quests = p.quests || {};
      p.exam = p.exam || { history: [] };
      p.exam.history = p.exam.history || [];
      p.stats = p.stats || { byTopic: {}, recentWrong: [] };
      p.stats.byTopic = p.stats.byTopic || {};
      p.stats.recentWrong = p.stats.recentWrong || [];
      out.profiles[pid] = p;
    });
    out.activeProfileId = data.activeProfileId && out.profiles[data.activeProfileId]
      ? data.activeProfileId
      : (Object.keys(out.profiles)[0] || null);
    return out;
  }

  const STORE = {
    state: blankState(),

    init() {
      try {
        const raw = localStorage.getItem(LS_PREFIX + uidKey);
        STORE.state = raw ? normalise(JSON.parse(raw)) : blankState();
      } catch (e) { STORE.state = blankState(); }
      return STORE.state;
    },

    // Dipanggil oleh firebase.js dengan maklumat akaun.
    setUser(account) {
      uidKey = account && account.uid ? account.uid : "guest";
      STORE.init();
      STORE.state.account = Object.assign(STORE.state.account, account || {});
    },

    // Ambil salinan awan, tetapi gabungkan sejarah latihan tempatan supaya
    // sesi yang siap semasa luar talian tidak hilang. Gabungan ikut profil,
    // dedup mengikut cap masa sesi.
    hydrate(data) {
      if (!data) return;
      const cloud = normalise(data);
      const local = STORE.state;
      Object.keys(cloud.profiles || {}).forEach(function (pid) {
        const cp = cloud.profiles[pid];
        const lp = (local.profiles || {})[pid];
        if (!lp || !lp.exam || !lp.exam.history || !lp.exam.history.length) return;
        const cloudHist = (cp.exam && cp.exam.history) || [];
        const seen = {};
        cloudHist.forEach(function (h) { if (h && h.ts != null) seen[h.ts] = true; });
        const merged = cloudHist.slice();
        for (const lh of lp.exam.history) {
          if (lh && lh.ts != null && !seen[lh.ts]) merged.push(lh);
        }
        merged.sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });
        cp.exam = cp.exam || {};
        cp.exam.history = merged.slice(0, 50);
      });
      STORE.state = cloud;
      STORE.persistLocal();
      STORE.emit();
    },

    /* ---------------- PENGURUSAN PEMAIN ---------------- */
    profilesList() {
      return Object.keys(STORE.state.profiles || {})
        .map(function (k) { return STORE.state.profiles[k]; })
        .sort(function (a, b) { return (b.lastPlayed || 0) - (a.lastPlayed || 0); });
    },
    active() {
      const id = STORE.state.activeProfileId;
      return id ? STORE.state.profiles[id] : null;
    },
    createProfile(name, gender) {
      const p = blankProfile(name, gender);
      STORE.state.profiles[p.id] = p;
      STORE.state.activeProfileId = p.id;
      STORE.save();
      return p;
    },
    updateProfile(id, patch) {
      const p = STORE.state.profiles[id]; if (!p) return false;
      if (patch.name != null) p.name = String(patch.name).trim() || "Pemain";
      if (patch.gender === "boy" || patch.gender === "girl") p.gender = patch.gender;
      STORE.save();
      return true;
    },
    selectProfile(id) {
      if (!STORE.state.profiles[id]) return false;
      STORE.state.activeProfileId = id;
      STORE.state.profiles[id].lastPlayed = Date.now();
      STORE.save();
      return true;
    },
    deleteProfile(id) {
      if (!STORE.state.profiles[id]) return false;
      delete STORE.state.profiles[id];
      if (STORE.state.activeProfileId === id) {
        STORE.state.activeProfileId = Object.keys(STORE.state.profiles)[0] || null;
      }
      STORE.save();
      return true;
    },

    /* ---------------- SESI LATIHAN ---------------- */
    // Rekod satu sesi Persediaan Peperiksaan yang telah tamat.
    // Sejarah dihadkan kepada 50 sesi terkini.
    recordExamSession(entry) {
      const p = STORE.active(); if (!p || !entry) return;
      if (!p.exam) p.exam = { history: [] };
      if (!p.exam.history) p.exam.history = [];
      const clean = {
        setId:    entry.setId,
        topicId:  entry.topicId,
        ts:       entry.ts || Date.now(),
        total:    entry.total,
        correct:  entry.correct,
        pct:      entry.total ? Math.round(entry.correct / entry.total * 100) : 0,
        byCat:    entry.byCat || {},
        bySection: entry.bySection || null,   // hanya untuk Ujian Cabaran Akhir
        mistakes: (entry.mistakes || []).slice(0, 10)
      };
      p.exam.history.unshift(clean);
      p.exam.history = p.exam.history.slice(0, 50);
      // Tulis segera — sesi yang siap tidak boleh hilang kalau tab ditutup.
      STORE.save({ immediate: true });
    },

    // Rekod satu jawapan (untuk Laporan Ibu Bapa).
    recordAnswer(topic, correct, qtext) {
      if (!topic) return;
      const p = STORE.active(); if (!p) return;
      if (!p.stats) p.stats = { byTopic: {}, recentWrong: [] };
      const t = p.stats.byTopic;
      if (!t[topic]) t[topic] = { attempts: 0, correct: 0 };
      t[topic].attempts++;
      if (correct) t[topic].correct++;
      if (!correct) {
        p.stats.recentWrong = p.stats.recentWrong || [];
        p.stats.recentWrong.unshift({ topic, q: qtext, ts: Date.now() });
        p.stats.recentWrong = p.stats.recentWrong.slice(0, 60);
      }
      STORE.save();
    },

    persistLocal() {
      try { localStorage.setItem(LS_PREFIX + uidKey, JSON.stringify(STORE.state)); } catch (e) { }
    },

    // { immediate: true } untuk tindakan yang tidak boleh hilang.
    save(opts) {
      const p = STORE.active(); if (p) p.lastPlayed = Date.now();
      STORE.persistLocal();
      STORE.emit();
      if (saveTimer) clearTimeout(saveTimer);
      if (opts && opts.immediate) {
        if (cloudWriter) cloudWriter(STORE.state);
      } else {
        saveTimer = setTimeout(function () {
          if (cloudWriter) cloudWriter(STORE.state);
        }, 900);
      }
    },

    setCloudWriter(fn) { cloudWriter = fn; },
    onChange(fn) { listeners.push(fn); },
    emit() { listeners.forEach(function (fn) { try { fn(STORE.state); } catch (e) { } }); }
  };

  window.STORE = STORE;
})();
