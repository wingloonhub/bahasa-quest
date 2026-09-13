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

  /* ---------------- KATA WAKTU — kata adjektif waktu (80 soalan) ----------------
     awal / lewat / baharu / lama. Sumber: Bahasa_Quest_Kata_Adjektif_Waktu_80_MCQ.docx */
  kata_waktu: [
    { q: "Ayah bangun ______ setiap pagi untuk pergi bekerja.", options: ["lewat", "lama", "baharu", "awal"], answer: 3, cat: "adjektif_waktu" },
    { q: "Ibu membeli sebuah beg tangan yang ______ semalam.", options: ["awal", "baharu", "lama", "lewat"], answer: 1, cat: "adjektif_waktu" },
    { q: "Jangan tidur terlalu ______ pada malam hari.", options: ["baharu", "awal", "lewat", "lama"], answer: 2, cat: "adjektif_waktu" },
    { q: "Datuk masih menyimpan jam tangan ______ miliknya.", options: ["lama", "awal", "lewat", "baharu"], answer: 0, cat: "adjektif_waktu" },
    { q: "Kami tiba ______ di sekolah sebelum loceng berbunyi.", options: ["lama", "awal", "baharu", "lewat"], answer: 1, cat: "adjektif_waktu" },
    { q: "Mei Ling memakai kasut ______ ke sekolah hari ini.", options: ["lama", "baharu", "lewat", "awal"], answer: 1, cat: "adjektif_waktu" },
    { q: "Amir pulang ______ kerana menghadiri latihan bola sepak.", options: ["awal", "baharu", "lama", "lewat"], answer: 3, cat: "adjektif_waktu" },
    { q: "Ayah menjual kereta ______ untuk membeli kereta lain.", options: ["baharu", "lewat", "awal", "lama"], answer: 3, cat: "adjektif_waktu" },
    { q: "Siti datang ______ supaya dapat membantu gurunya.", options: ["lama", "lewat", "baharu", "awal"], answer: 3, cat: "adjektif_waktu" },
    { q: "Abang mendapat sebuah basikal ______ sebagai hadiah hari lahir.", options: ["lewat", "awal", "lama", "baharu"], answer: 3, cat: "adjektif_waktu" },
    { q: "Kami tidak mahu sampai ______ ke majlis itu.", options: ["lewat", "baharu", "awal", "lama"], answer: 0, cat: "adjektif_waktu" },
    { q: "Ibu menggantikan langsir ______ di ruang tamu.", options: ["awal", "lama", "lewat", "baharu"], answer: 1, cat: "adjektif_waktu" },
    { q: "Nenek suka berjalan-jalan pada ______ pagi.", options: ["awal", "baharu", "lewat", "lama"], answer: 0, cat: "adjektif_waktu" },
    { q: "Cikgu menggunakan komputer ______ di dalam kelas.", options: ["lewat", "lama", "baharu", "awal"], answer: 2, cat: "adjektif_waktu" },
    { q: "Kumar terlepas bas kerana dia keluar dari rumah terlalu ______.", options: ["lewat", "awal", "lama", "baharu"], answer: 0, cat: "adjektif_waktu" },
    { q: "Adik tidak mahu membuang permainan ______ kesayangannya.", options: ["baharu", "awal", "lewat", "lama"], answer: 3, cat: "adjektif_waktu" },
    { q: "Kami bertolak ______ untuk mengelakkan kesesakan jalan raya.", options: ["lewat", "lama", "awal", "baharu"], answer: 2, cat: "adjektif_waktu" },
    { q: "Ayah membeli telefon bimbit ______ minggu lalu.", options: ["lewat", "lama", "awal", "baharu"], answer: 3, cat: "adjektif_waktu" },
    { q: "Murid itu ditegur kerana datang ______ ke sekolah.", options: ["awal", "baharu", "lama", "lewat"], answer: 3, cat: "adjektif_waktu" },
    { q: "Pak cik membaiki motosikal ______ yang sudah rosak.", options: ["awal", "lama", "baharu", "lewat"], answer: 1, cat: "adjektif_waktu" },
    { q: "Farah bangun ______ untuk membuat persediaan ke sekolah.", options: ["lama", "baharu", "lewat", "awal"], answer: 3, cat: "adjektif_waktu" },
    { q: "Ibu membeli pinggan ______ untuk digunakan semasa Hari Raya.", options: ["lewat", "lama", "baharu", "awal"], answer: 2, cat: "adjektif_waktu" },
    { q: "Adik tidur ______ kerana menonton televisyen.", options: ["lama", "baharu", "awal", "lewat"], answer: 3, cat: "adjektif_waktu" },
    { q: "Kami melihat banyak gambar ______ di dalam album keluarga.", options: ["baharu", "awal", "lewat", "lama"], answer: 3, cat: "adjektif_waktu" },
    { q: "Ayah tiba di lapangan terbang lebih ______ daripada kami.", options: ["lama", "awal", "baharu", "lewat"], answer: 1, cat: "adjektif_waktu" },
    { q: "Saya mendapat kotak pensel ______ daripada ibu.", options: ["lama", "baharu", "lewat", "awal"], answer: 1, cat: "adjektif_waktu" },
    { q: "Jangan datang ______ ke kelas tambahan.", options: ["lewat", "baharu", "awal", "lama"], answer: 0, cat: "adjektif_waktu" },
    { q: "Nenek masih menggunakan almari ______ di dalam biliknya.", options: ["baharu", "lewat", "awal", "lama"], answer: 3, cat: "adjektif_waktu" },
    { q: "Kakak keluar rumah ______ supaya tidak terlepas bas.", options: ["lama", "lewat", "awal", "baharu"], answer: 2, cat: "adjektif_waktu" },
    { q: "Sekolah kami mempunyai sebuah perpustakaan ______.", options: ["lewat", "baharu", "lama", "awal"], answer: 1, cat: "adjektif_waktu" },
    { q: "Hafiz bangun ______ lalu tergesa-gesa ke sekolah.", options: ["lewat", "lama", "baharu", "awal"], answer: 0, cat: "adjektif_waktu" },
    { q: "Ibu memberikan pakaian ______ kami kepada orang yang memerlukan.", options: ["lama", "baharu", "awal", "lewat"], answer: 0, cat: "adjektif_waktu" },
    { q: "Kami tiba lebih ______ daripada masa yang ditetapkan.", options: ["lama", "baharu", "lewat", "awal"], answer: 3, cat: "adjektif_waktu" },
    { q: "Sarah menggunakan botol air ______ yang dibeli oleh ayah.", options: ["lama", "awal", "baharu", "lewat"], answer: 2, cat: "adjektif_waktu" },
    { q: "Jangan bermain sehingga ______ malam.", options: ["awal", "lama", "baharu", "lewat"], answer: 3, cat: "adjektif_waktu" },
    { q: "Abang menggantikan meja belajar ______ dengan meja yang baharu.", options: ["lama", "baharu", "lewat", "awal"], answer: 0, cat: "adjektif_waktu" },
    { q: "Datuk suka bangun pada ______ pagi untuk bersenam.", options: ["lewat", "baharu", "awal", "lama"], answer: 2, cat: "adjektif_waktu" },
    { q: "Murid-murid menerima buku teks ______ pada awal tahun.", options: ["baharu", "lama", "awal", "lewat"], answer: 0, cat: "adjektif_waktu" },
    { q: "Ali dihukum kerana selalu datang ______ ke sekolah.", options: ["awal", "lama", "baharu", "lewat"], answer: 3, cat: "adjektif_waktu" },
    { q: "Rumah ______ itu telah dibaiki oleh pemiliknya.", options: ["awal", "baharu", "lewat", "lama"], answer: 3, cat: "adjektif_waktu" },
    { q: "Ibu pergi ke pasar pada ______ pagi untuk membeli ikan segar.", options: ["baharu", "lama", "awal", "lewat"], answer: 2, cat: "adjektif_waktu" },
    { q: "Adik sangat gembira mendapat permainan ______.", options: ["awal", "lewat", "lama", "baharu"], answer: 3, cat: "adjektif_waktu" },
    { q: "Mereka pulang ______ selepas menonton persembahan itu.", options: ["lama", "awal", "baharu", "lewat"], answer: 3, cat: "adjektif_waktu" },
    { q: "Ayah menyimpan surat khabar ______ di dalam kotak.", options: ["lama", "awal", "baharu", "lewat"], answer: 0, cat: "adjektif_waktu" },
    { q: "Murid-murid diminta hadir ______ pada hari sukan.", options: ["lama", "awal", "lewat", "baharu"], answer: 1, cat: "adjektif_waktu" },
    { q: "Kami berpindah ke rumah ______ pada bulan lepas.", options: ["baharu", "lama", "lewat", "awal"], answer: 0, cat: "adjektif_waktu" },
    { q: "Ibu menasihati saya supaya tidak tidur ______.", options: ["lama", "lewat", "awal", "baharu"], answer: 1, cat: "adjektif_waktu" },
    { q: "Bas ______ itu sudah tidak digunakan lagi.", options: ["baharu", "lewat", "awal", "lama"], answer: 3, cat: "adjektif_waktu" },
    { q: "Abang pergi ke stesen bas lebih ______ supaya tidak ketinggalan bas.", options: ["awal", "baharu", "lama", "lewat"], answer: 0, cat: "adjektif_waktu" },
    { q: "Cikgu memperkenalkan seorang murid ______ kepada kelas kami.", options: ["baharu", "awal", "lewat", "lama"], answer: 0, cat: "adjektif_waktu" },
    { q: "Hari sudah ______ petang ketika mereka tiba di rumah.", options: ["baharu", "lama", "awal", "lewat"], answer: 3, cat: "adjektif_waktu" },
    { q: "Saya masih menyimpan buku cerita ______ pemberian datuk.", options: ["baharu", "lewat", "awal", "lama"], answer: 3, cat: "adjektif_waktu" },
    { q: "Kami perlu tiba ______ sebelum pertandingan bermula.", options: ["lama", "awal", "baharu", "lewat"], answer: 1, cat: "adjektif_waktu" },
    { q: "Ayah memasang lampu ______ di ruang tamu.", options: ["lewat", "awal", "baharu", "lama"], answer: 2, cat: "adjektif_waktu" },
    { q: "Daniel meminta maaf kerana datang ______ ke mesyuarat.", options: ["lama", "lewat", "baharu", "awal"], answer: 1, cat: "adjektif_waktu" },
    { q: "Kedai ______ itu telah beroperasi selama lebih 30 tahun.", options: ["awal", "lama", "lewat", "baharu"], answer: 1, cat: "adjektif_waktu" },
    { q: "Ibu menyediakan sarapan pada ______ pagi.", options: ["lewat", "awal", "baharu", "lama"], answer: 1, cat: "adjektif_waktu" },
    { q: "Adik memakai baju ______ yang dibeli semalam.", options: ["awal", "baharu", "lewat", "lama"], answer: 1, cat: "adjektif_waktu" },
    { q: "Kami sampai ______ kerana jalan raya sangat sesak.", options: ["baharu", "awal", "lama", "lewat"], answer: 3, cat: "adjektif_waktu" },
    { q: "Ayah membuang kerusi ______ yang sudah patah.", options: ["lewat", "lama", "awal", "baharu"], answer: 1, cat: "adjektif_waktu" },
    { q: "Kami bangun ______ kerana hendak pergi bercuti.", options: ["awal", "baharu", "lewat", "lama"], answer: 0, cat: "adjektif_waktu" },
    { q: "Sekolah membeli beberapa buah komputer ______.", options: ["awal", "baharu", "lewat", "lama"], answer: 1, cat: "adjektif_waktu" },
    { q: "Johan pulang ______ selepas kelas tambahan.", options: ["awal", "lama", "baharu", "lewat"], answer: 3, cat: "adjektif_waktu" },
    { q: "Nenek menunjukkan kepada kami gambar-gambar ______ keluarganya.", options: ["lama", "lewat", "awal", "baharu"], answer: 0, cat: "adjektif_waktu" },
    { q: "Saya suka tiba ______ supaya mempunyai masa untuk membuat persediaan.", options: ["baharu", "awal", "lewat", "lama"], answer: 1, cat: "adjektif_waktu" },
    { q: "Kakak mendapat pekerjaan ______ di sebuah pejabat.", options: ["lama", "awal", "lewat", "baharu"], answer: 3, cat: "adjektif_waktu" },
    { q: "Jangan makan terlalu ______ pada waktu malam.", options: ["lewat", "baharu", "awal", "lama"], answer: 0, cat: "adjektif_waktu" },
    { q: "Ibu menukar cadar ______ dengan cadar yang bersih.", options: ["awal", "baharu", "lama", "lewat"], answer: 2, cat: "adjektif_waktu" },
    { q: "Peserta diminta datang ______ sebelum pertandingan bermula.", options: ["lewat", "awal", "lama", "baharu"], answer: 1, cat: "adjektif_waktu" },
    { q: "Ayah membeli sebuah peti sejuk ______ untuk dapur.", options: ["lewat", "awal", "baharu", "lama"], answer: 2, cat: "adjektif_waktu" },
    { q: "Kami tiba ______ kerana kereta ayah rosak dalam perjalanan.", options: ["lama", "awal", "lewat", "baharu"], answer: 2, cat: "adjektif_waktu" },
    { q: "Bangunan ______ itu akan dibaik pulih tidak lama lagi.", options: ["lewat", "baharu", "awal", "lama"], answer: 3, cat: "adjektif_waktu" },
    { q: "Mei Mei bangun lebih ______ daripada kakaknya.", options: ["lama", "baharu", "lewat", "awal"], answer: 3, cat: "adjektif_waktu" },
    { q: "Saya menggunakan pensel warna ______ yang diberikan oleh ibu.", options: ["lewat", "awal", "baharu", "lama"], answer: 2, cat: "adjektif_waktu" },
    { q: "Jangan keluar bermain sehingga ______ petang.", options: ["lewat", "baharu", "awal", "lama"], answer: 0, cat: "adjektif_waktu" },
    { q: "Buku ______ itu masih berada dalam keadaan baik.", options: ["awal", "lewat", "lama", "baharu"], answer: 2, cat: "adjektif_waktu" },
    { q: "Ayah pergi berjoging pada ______ pagi.", options: ["lewat", "awal", "baharu", "lama"], answer: 1, cat: "adjektif_waktu" },
    { q: "Encik Wong membeli sebuah kereta ______ untuk keluarganya.", options: ["baharu", "awal", "lewat", "lama"], answer: 0, cat: "adjektif_waktu" },
    { q: "Kami terpaksa makan malam ______ kerana ayah pulang lambat.", options: ["awal", "lewat", "baharu", "lama"], answer: 1, cat: "adjektif_waktu" },
    { q: "Ibu menggantikan periuk ______ dengan periuk yang baharu.", options: ["lewat", "baharu", "awal", "lama"], answer: 3, cat: "adjektif_waktu" }
  ],

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
