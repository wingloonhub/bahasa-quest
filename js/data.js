/* data.js — struktur kandungan Bahasa Quest.

   ADVENTURES  : mod "Pilih Pengembaraan" (masih kosong = AKAN DATANG).
   EXAM_PREP   : set latihan peperiksaan, disusun ikut tahun & semester.

   Untuk menambah topik nanti:
   1. Tambah objek topik di dalam `topics` set berkenaan, cth:
        { id: "kata_nama", label: "Kata Nama", desc: "Kata nama am & khas" }
   2. Tambah bank soalan dengan id yang SAMA di dalam js/questions_exam.js.
   Tiada perubahan lain diperlukan — skrin latihan, markah dan
   Sejarah & Analisis akan mengambilnya secara automatik. */
(function () {
  "use strict";

  // Mod pengembaraan — kosong buat masa ini, skrin akan papar "Akan Datang".
  const ADVENTURES = [];

  // Setiap topik biasa = 15 soalan satu sesi (lalai EXAM_SESSION_SIZE).
  // Ujian Cabaran Akhir = 8 soalan daripada SETIAP topik di atas (10 × 8 = 80).
  const EXAM_PREP = [
    {
      id: "tahun3_sem2",
      label: "Tahun 3 — Semester 2",
      desc: "Latihan mengikut topik peperiksaan Bahasa Melayu Tahun 3, Semester 2.",
      topics: [
        { id: "kosa_kata",         label: "Kosa Kata",             desc: "Perbendaharaan kata" },
        { id: "kata_tanya",        label: "Kata Tanya",            desc: "Apa, siapa, bila, mengapa, bagaimana…" },
        { id: "kata_pasif",        label: "Kata Pasif",            desc: "Ayat pasif" },
        { id: "kata_hubung",       label: "Kata Hubung",           desc: "dan, tetapi, kerana, supaya…" },
        { id: "kata_arah",         label: "Kata Arah",             desc: "atas, bawah, dalam, luar, antara…" },
        { id: "kata_waktu",        label: "Kata Waktu",            desc: "Kata adjektif waktu — awal, lewat, baharu, lama",
          catLabels: { adjektif_waktu: "Kata adjektif waktu" } },
        { id: "kata_perintah",     label: "Kata Perintah",         desc: "sila, tolong, jangan, harap…" },
        { id: "bina_ayat",         label: "Bina Ayat",             desc: "Membina ayat yang lengkap & betul" },
        { id: "penulisan",         label: "Penulisan",             desc: "Karangan pendek" },
        { id: "timbul_tenggelam",  label: "Timbul atau Tenggelam", desc: "Petikan & pemahaman" },
        { id: "ejaan",             label: "Ejaan",                 desc: "Dengar perkataan, kemudian eja",
          catLabels: { kata_arah: "Kata arah" } },
        {
          id: "cabaran_akhir",
          label: "Ujian Cabaran Akhir",
          desc: "Campuran semua topik — 8 soalan daripada setiap topik.",
          challengeMode: true,
          perSection: 8
        }
      ]
    }
  ];

  function examSet(setId) {
    return EXAM_PREP.filter(function (s) { return s.id === setId; })[0] || null;
  }
  function examTopic(setId, topicId) {
    const set = examSet(setId);
    if (!set) return null;
    return set.topics.filter(function (t) { return t.id === topicId; })[0] || null;
  }
  // Cari topik dalam mana-mana set (berguna untuk Sejarah & Analisis).
  function anyTopic(topicId) {
    for (const s of EXAM_PREP) {
      const t = s.topics.filter(function (x) { return x.id === topicId; })[0];
      if (t) return t;
    }
    return null;
  }
  function setOfTopic(topicId) {
    for (const s of EXAM_PREP) {
      if (s.topics.some(function (x) { return x.id === topicId; })) return s;
    }
    return EXAM_PREP[0] || null;
  }

  window.DATA = { ADVENTURES, EXAM_PREP, examSet, examTopic, anyTopic, setOfTopic };
})();
