/* questions_exam.js — bank soalan untuk Persediaan Peperiksaan.

   Kuncinya mesti sama dengan `id` topik di dalam js/data.js
   (kosa_kata, kata_tanya, kata_pasif, kata_hubung, kata_arah,
    kata_perintah, bina_ayat, penulisan, timbul_tenggelam, ejaan).

   ============================================================
   FORMAT 1 — soalan aneka pilihan
   ============================================================
     {
       q: "Pilih kata nama khas yang betul: ___ pergi ke pasar.",
       options: ["ali", "Ali", "ALI", "aLi"],
       answer: 1,              // indeks jawapan betul dalam options
       cat: "huruf_besar"      // pilihan: kumpulan kecil untuk analisis
     }

   `cat` membolehkan skrin Sejarah & Analisis menunjukkan bahagian mana
   dalam satu topik yang paling lemah. Kalau tiada, ia dikira "Umum".

   ============================================================
   FORMAT 2 — latihan ejaan (dengar & eja)
   ============================================================
     {
       spelling: true,
       word: "atas",           // ejaan yang betul
       hint: "Lawan bagi 'bawah'",   // pilihan: petunjuk maksud
       alt: [],                // pilihan: ejaan lain yang diterima
       cat: "kata_arah"
     }

   Soalan ejaan memaparkan butang "🔊 Dengar perkataan" (Web Speech API,
   suara Bahasa Melayu jika ada, jika tidak Bahasa Indonesia) dan papan
   kekunci dalam skrin — bukan papan kekunci telefon — supaya autocorrect
   tidak membantu. Jika peranti langsung tiada suara, perkataan itu
   dipaparkan supaya latihan tetap boleh diteruskan.
*/

window.QUESTIONS_EXAM = {

  /* ---------------- EJAAN — kata arah (dengar & eja) ---------------- */
  ejaan: [
    { spelling: true, word: "atas",     hint: "Lawan bagi 'bawah'",            cat: "kata_arah" },
    { spelling: true, word: "bawah",    hint: "Lawan bagi 'atas'",             cat: "kata_arah" },
    { spelling: true, word: "luar",     hint: "Lawan bagi 'dalam'",            cat: "kata_arah" },
    { spelling: true, word: "dalam",    hint: "Lawan bagi 'luar'",             cat: "kata_arah" },
    { spelling: true, word: "kiri",     hint: "Lawan bagi 'kanan'",            cat: "kata_arah" },
    { spelling: true, word: "kanan",    hint: "Lawan bagi 'kiri'",             cat: "kata_arah" },
    { spelling: true, word: "hadapan",  hint: "Lawan bagi 'belakang'",         cat: "kata_arah" },
    { spelling: true, word: "belakang", hint: "Lawan bagi 'hadapan'",          cat: "kata_arah" },
    { spelling: true, word: "sebelah",  hint: "Bermaksud 'di sisi sesuatu'",   cat: "kata_arah" },
    { spelling: true, word: "tepi",     hint: "Bahagian pinggir sesuatu",      cat: "kata_arah" }
  ]

  // Topik lain akan ditambah di sini, contohnya:
  // kosa_kata: [ { q: "…", options: ["…","…","…","…"], answer: 0, cat: "maksud" } ],

};

/* Pembantu kecil — mengocok senarai (dipakai oleh enjin latihan). */
window.QUESTIONS = window.QUESTIONS || {
  shuffle: function (arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
};
