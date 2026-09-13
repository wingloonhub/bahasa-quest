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

  /* ---------------- KATA TANYA (100 soalan) ----------------
     Bahagian A & C: lengkapkan ayat. Bahagian B: pilih ayat tanya yang sesuai.
     Sumber: Bahasa_Quest_Kata_Tanya_100_MCQ.docx */
  kata_tanya: [
    { q: "___ nama guru kelas kamu?", options: ["Siapakah", "Apakah", "Bilakah", "Mengapakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ yang sedang membaca buku itu?", options: ["Bilakah", "Berapakah", "Siapakah", "Apakah"], answer: 2, cat: "lengkap_ayat" },
    { q: "___ kamu pergi ke sekolah?", options: ["Bilakah", "Siapakah", "Apakah", "Berapakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "___ ayah membeli ikan?", options: ["Mengapakah", "Di manakah", "Siapakah", "Bagaimanakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ Amir tidak datang ke sekolah hari ini?", options: ["Mengapakah", "Berapakah", "Apakah", "Bilakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "___ kamu datang ke sekolah setiap hari?", options: ["Siapakah", "Bagaimanakah", "Bilakah", "Apakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ harga buku itu?", options: ["Apakah", "Siapakah", "Berapakah", "Bilakah"], answer: 2, cat: "lengkap_ayat" },
    { q: "___ makanan kegemaran kamu?", options: ["Apakah", "Siapakah", "Bilakah", "Mengapakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "___ yang membantu ibu di dapur?", options: ["Apakah", "Siapakah", "Berapakah", "Bilakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ pertandingan bola sepak itu akan diadakan?", options: ["Bilakah", "Apakah", "Siapakah", "Bagaimanakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "___ kakak menyimpan buku-bukunya?", options: ["Mengapakah", "Di manakah", "Bilakah", "Apakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ Siti membawa payung ke sekolah?", options: ["Siapakah", "Mengapakah", "Bilakah", "Berapakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ ibu membuat jus buah?", options: ["Bagaimanakah", "Siapakah", "Bilakah", "Apakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "___ orang murid di dalam kelas kamu?", options: ["Apakah", "Bilakah", "Berapakah", "Siapakah"], answer: 2, cat: "lengkap_ayat" },
    { q: "___ yang terdapat di dalam kotak itu?", options: ["Apakah", "Siapakah", "Bagaimanakah", "Bilakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "___ yang menjaga pesakit di hospital?", options: ["Bilakah", "Apakah", "Siapakah", "Berapakah"], answer: 2, cat: "lengkap_ayat" },
    { q: "___ hari lahir kamu?", options: ["Siapakah", "Bilakah", "Apakah", "Mengapakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ kamu membeli kasut baharu itu?", options: ["Di manakah", "Mengapakah", "Siapakah", "Berapakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "___ Aiman menangis?", options: ["Apakah", "Mengapakah", "Bilakah", "Siapakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ kamu membuka tin itu?", options: ["Berapakah", "Bilakah", "Bagaimanakah", "Apakah"], answer: 2, cat: "lengkap_ayat" },
    { q: "___ batang pensel yang kamu ada?", options: ["Berapakah", "Apakah", "Siapakah", "Mengapakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "___ pekerjaan ayah kamu?", options: ["Siapakah", "Apakah", "Bilakah", "Berapakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ yang mengetuk pintu tadi?", options: ["Apakah", "Siapakah", "Bilakah", "Mengapakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ kelas tambahan akan bermula?", options: ["Di manakah", "Siapakah", "Bilakah", "Apakah"], answer: 2, cat: "lengkap_ayat" },
    { q: "___ burung itu membuat sarangnya?", options: ["Di manakah", "Bagaimanakah", "Bilakah", "Berapakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "___ Mei Ling berlari dengan pantas?", options: ["Mengapakah", "Apakah", "Siapakah", "Bilakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "___ kamu membuat kapal kertas?", options: ["Bilakah", "Bagaimanakah", "Siapakah", "Berapakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ umur adik kamu?", options: ["Apakah", "Siapakah", "Berapakah", "Bilakah"], answer: 2, cat: "lengkap_ayat" },
    { q: "___ yang hendak kamu beli di kantin?", options: ["Apakah", "Siapakah", "Bilakah", "Mengapakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "___ yang memenangi pertandingan itu?", options: ["Siapakah", "Apakah", "Berapakah", "Bilakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "___ keluarga kamu akan bercuti?", options: ["Mengapakah", "Bilakah", "Apakah", "Siapakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ kamu hendak pergi selepas sekolah?", options: ["Ke manakah", "Berapakah", "Siapakah", "Bilakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "___ Encik Lim datang?", options: ["Ke manakah", "Dari manakah", "Apakah", "Bilakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ buku yang sedang kamu baca?", options: ["Apakah", "Siapakah", "Bilakah", "Berapakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "___ yang memasak nasi goreng itu?", options: ["Apakah", "Mengapakah", "Siapakah", "Bilakah"], answer: 2, cat: "lengkap_ayat" },
    { q: "___ bas sekolah tiba setiap pagi?", options: ["Bagaimanakah", "Bilakah", "Siapakah", "Apakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ kamu bermain badminton?", options: ["Di manakah", "Siapakah", "Berapakah", "Mengapakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "___ adik memakai baju tebal?", options: ["Berapakah", "Mengapakah", "Apakah", "Bilakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ kamu pergi ke perpustakaan?", options: ["Siapakah", "Apakah", "Bagaimanakah", "Bilakah"], answer: 2, cat: "lengkap_ayat" },
    { q: "___ buah mangga yang dibeli oleh ibu?", options: ["Bilakah", "Berapakah", "Apakah", "Siapakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ warna beg sekolah Amin?", options: ["Apakah", "Siapakah", "Bilakah", "Mengapakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "___ yang sedang menyiram pokok bunga?", options: ["Apakah", "Siapakah", "Berapakah", "Bilakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ majlis itu akan bermula?", options: ["Apakah", "Bilakah", "Di manakah", "Siapakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ pertandingan itu diadakan?", options: ["Bagaimanakah", "Di manakah", "Mengapakah", "Berapakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ Nadia tidak bermain di luar rumah?", options: ["Mengapakah", "Bilakah", "Apakah", "Siapakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "___ ayah pergi ke tempat kerja?", options: ["Berapakah", "Bagaimanakah", "Apakah", "Siapakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ harga sepasang kasut itu?", options: ["Siapakah", "Apakah", "Berapakah", "Bilakah"], answer: 2, cat: "lengkap_ayat" },
    { q: "___ yang dibawa oleh Farah ke sekolah?", options: ["Apakah", "Siapakah", "Mengapakah", "Bilakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "___ yang mengajar kamu Matematik?", options: ["Apakah", "Siapakah", "Bilakah", "Berapakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ kamu akan pulang ke kampung?", options: ["Mengapakah", "Bilakah", "Apakah", "Siapakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ abang meletakkan basikalnya?", options: ["Di manakah", "Bilakah", "Mengapakah", "Berapakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "___ murid-murid perlu beratur?", options: ["Siapakah", "Mengapakah", "Bilakah", "Apakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ ibu memotong buah itu?", options: ["Apakah", "Siapakah", "Bagaimanakah", "Bilakah"], answer: 2, cat: "lengkap_ayat" },
    { q: "___ buah buku yang terdapat di atas meja?", options: ["Apakah", "Berapakah", "Siapakah", "Mengapakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ permainan kegemaran adik?", options: ["Siapakah", "Apakah", "Bilakah", "Berapakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ yang sedang bercakap dengan guru itu?", options: ["Apakah", "Bilakah", "Siapakah", "Berapakah"], answer: 2, cat: "lengkap_ayat" },
    { q: "___ kapal terbang itu akan berlepas?", options: ["Bilakah", "Apakah", "Mengapakah", "Siapakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "___ ibu membeli sayur-sayuran?", options: ["Bagaimanakah", "Di manakah", "Siapakah", "Bilakah"], answer: 1, cat: "lengkap_ayat" },
    { q: "___ Kumar membawa bekal ke sekolah?", options: ["Berapakah", "Apakah", "Mengapakah", "Bilakah"], answer: 2, cat: "lengkap_ayat" },
    { q: "___ adik belajar menunggang basikal?", options: ["Bagaimanakah", "Siapakah", "Berapakah", "Bilakah"], answer: 0, cat: "lengkap_ayat" },
    { q: "Ayat tanya manakah yang sesuai? Jawapan: Siti membeli sebuah buku cerita.", options: ["Siapakah yang dibeli oleh Siti?", "Apakah yang dibeli oleh Siti?", "Bilakah Siti membeli buku?", "Mengapakah Siti membeli buku?"], answer: 1, cat: "pilih_ayat" },
    { q: "Ayat tanya manakah yang sesuai? Jawapan: Encik Ali ialah guru besar sekolah itu.", options: ["Siapakah guru besar sekolah itu?", "Apakah guru besar sekolah itu?", "Bilakah guru besar datang?", "Berapakah guru besar sekolah itu?"], answer: 0, cat: "pilih_ayat" },
    { q: "Ayat tanya manakah yang sesuai? Jawapan: Pertandingan itu akan diadakan pada hari Sabtu.", options: ["Siapakah yang mengadakan pertandingan itu?", "Apakah pertandingan itu?", "Bilakah pertandingan itu akan diadakan?", "Bagaimanakah pertandingan itu diadakan?"], answer: 2, cat: "pilih_ayat" },
    { q: "Ayat tanya manakah yang sesuai? Jawapan: Mereka bermain bola di padang sekolah.", options: ["Mengapakah mereka bermain bola?", "Di manakah mereka bermain bola?", "Bilakah mereka bermain bola?", "Siapakah bermain bola?"], answer: 1, cat: "pilih_ayat" },
    { q: "Ayat tanya manakah yang sesuai? Jawapan: Aiman tidak datang kerana demam.", options: ["Mengapakah Aiman tidak datang?", "Bilakah Aiman datang?", "Siapakah Aiman?", "Di manakah Aiman?"], answer: 0, cat: "pilih_ayat" },
    { q: "Ayat tanya manakah yang sesuai? Jawapan: Mei Ling pergi ke sekolah dengan menaiki bas.", options: ["Bilakah Mei Ling pergi ke sekolah?", "Siapakah yang pergi ke sekolah?", "Bagaimanakah Mei Ling pergi ke sekolah?", "Berapakah harga bas itu?"], answer: 2, cat: "pilih_ayat" },
    { q: "Ayat tanya manakah yang sesuai? Jawapan: Harga beg itu RM40.", options: ["Apakah warna beg itu?", "Berapakah harga beg itu?", "Siapakah membeli beg itu?", "Bilakah beg itu dibeli?"], answer: 1, cat: "pilih_ayat" },
    { q: "Ayat tanya manakah yang sesuai? Jawapan: Ibu memasak sup ayam.", options: ["Apakah yang dimasak oleh ibu?", "Siapakah ibu?", "Mengapakah ibu memasak?", "Bilakah ibu memasak?"], answer: 0, cat: "pilih_ayat" },
    { q: "Ayat tanya manakah yang sesuai? Jawapan: Doktor sedang memeriksa pesakit itu.", options: ["Apakah yang diperiksa?", "Bilakah pesakit itu diperiksa?", "Siapakah yang sedang memeriksa pesakit itu?", "Berapakah pesakit itu?"], answer: 2, cat: "pilih_ayat" },
    { q: "Ayat tanya manakah yang sesuai? Jawapan: Kami akan bertolak pada pukul 8.00 pagi.", options: ["Di manakah kamu bertolak?", "Bilakah kamu akan bertolak?", "Mengapakah kamu bertolak?", "Siapakah yang bertolak?"], answer: 1, cat: "pilih_ayat" },
    { q: "Ayat tanya manakah yang sesuai? Jawapan: Ayah membeli ikan di pasar.", options: ["Apakah yang dibeli oleh ayah?", "Siapakah ayah?", "Di manakah ayah membeli ikan?", "Bilakah ikan itu berenang?"], answer: 2, cat: "pilih_ayat" },
    { q: "Ayat tanya manakah yang sesuai? Jawapan: Siti membawa payung kerana hari hujan.", options: ["Mengapakah Siti membawa payung?", "Berapakah payung Siti?", "Siapakah Siti?", "Bilakah Siti membeli payung?"], answer: 0, cat: "pilih_ayat" },
    { q: "Ayat tanya manakah yang sesuai? Jawapan: Amir membuka kotak itu dengan menggunakan gunting.", options: ["Bilakah Amir membuka kotak itu?", "Bagaimanakah Amir membuka kotak itu?", "Siapakah yang membuka kotak?", "Di manakah kotak itu?"], answer: 1, cat: "pilih_ayat" },
    { q: "Ayat tanya manakah yang sesuai? Jawapan: Terdapat lima biji epal di dalam bakul.", options: ["Apakah warna epal itu?", "Siapakah membeli epal itu?", "Berapakah biji epal di dalam bakul?", "Bilakah epal itu dibeli?"], answer: 2, cat: "pilih_ayat" },
    { q: "Ayat tanya manakah yang sesuai? Jawapan: Amir hendak pergi ke perpustakaan.", options: ["Dari manakah Amir datang?", "Ke manakah Amir hendak pergi?", "Bilakah Amir membaca?", "Mengapakah Amir tidur?"], answer: 1, cat: "pilih_ayat" },
    { q: "Ayat tanya manakah yang sesuai? Jawapan: Keluarga Mei Ling datang dari Johor.", options: ["Di manakah keluarga Mei Ling tinggal?", "Ke manakah keluarga Mei Ling pergi?", "Dari manakah keluarga Mei Ling datang?", "Bilakah mereka datang?"], answer: 2, cat: "pilih_ayat" },
    { q: "Ayat tanya manakah yang sesuai? Jawapan: Hari lahir Johan pada 20 September.", options: ["Siapakah Johan?", "Bilakah hari lahir Johan?", "Apakah hadiah Johan?", "Di manakah Johan tinggal?"], answer: 1, cat: "pilih_ayat" },
    { q: "Ayat tanya manakah yang sesuai? Jawapan: Adik menangis kerana mainannya rosak.", options: ["Mengapakah adik menangis?", "Bilakah adik menangis?", "Siapakah adik?", "Berapakah permainan adik?"], answer: 0, cat: "pilih_ayat" },
    { q: "Ayat tanya manakah yang sesuai? Jawapan: Farah membuat kad dengan menggunakan kertas warna.", options: ["Mengapakah Farah membuat kad?", "Bilakah Farah membuat kad?", "Bagaimanakah Farah membuat kad?", "Siapakah Farah?"], answer: 2, cat: "pilih_ayat" },
    { q: "Ayat tanya manakah yang sesuai? Jawapan: Terdapat 30 orang murid di dalam kelas itu.", options: ["Bilakah murid masuk ke kelas?", "Siapakah guru kelas itu?", "Apakah yang terdapat di kelas?", "Berapakah orang murid di dalam kelas itu?"], answer: 3, cat: "pilih_ayat" },
    { q: "Aina bermain badminton di ___?", options: ["apa", "mana", "siapa"], answer: 1, cat: "bulatkan" },
    { q: "Adik pergi ke taman dengan ___?", options: ["siapa", "bila", "berapa"], answer: 0, cat: "bulatkan" },
    { q: "Amir membeli ___ di kantin?", options: ["siapa", "apa", "bila"], answer: 1, cat: "bulatkan" },
    { q: "Ayah pulang dari pejabat ___?", options: ["bila", "siapa", "berapa"], answer: 0, cat: "bulatkan" },
    { q: "Siti menerima hadiah daripada ___?", options: ["bila", "siapa", "apa"], answer: 1, cat: "bulatkan" },
    { q: "Kakak menyimpan buku di ___?", options: ["mana", "berapa", "siapa"], answer: 0, cat: "bulatkan" },
    { q: "Mereka pergi bercuti ke ___?", options: ["bila", "mana", "siapa"], answer: 1, cat: "bulatkan" },
    { q: "Ibu membeli ___ di pasar?", options: ["apa", "bila", "mana"], answer: 0, cat: "bulatkan" },
    { q: "Farid datang ke sekolah bersama ___?", options: ["siapa", "berapa", "bila"], answer: 0, cat: "bulatkan" },
    { q: "Kamu mempunyai ___ batang pensel?", options: ["siapa", "berapa", "mana"], answer: 1, cat: "bulatkan" },
    { q: "___ harga jam tangan itu?", options: ["Apakah", "Siapakah", "Berapakah"], answer: 2, cat: "bulatkan" },
    { q: "___ yang sedang menyapu lantai?", options: ["Siapakah", "Bilakah", "Berapakah"], answer: 0, cat: "bulatkan" },
    { q: "___ Hari Sukan sekolah akan diadakan?", options: ["Bilakah", "Manakah", "Siapakah"], answer: 0, cat: "bulatkan" },
    { q: "___ makanan kegemaran kamu?", options: ["Berapakah", "Apakah", "Siapakah"], answer: 1, cat: "bulatkan" },
    { q: "___ kamu tidak hadir semalam?", options: ["Mengapakah", "Bilakah", "Siapakah"], answer: 0, cat: "bulatkan" },
    { q: "___ kamu datang ke sekolah pagi tadi?", options: ["Bagaimanakah", "Apakah", "Berapakah"], answer: 0, cat: "bulatkan" },
    { q: "___ kamu membeli beg sekolah itu?", options: ["Di manakah", "Siapakah", "Berapakah"], answer: 0, cat: "bulatkan" },
    { q: "___ yang memenangi pertandingan bercerita?", options: ["Apakah", "Siapakah", "Bilakah"], answer: 1, cat: "bulatkan" },
    { q: "___ umur abang kamu?", options: ["Siapakah", "Berapakah", "Apakah"], answer: 1, cat: "bulatkan" },
    { q: "___ adik menangis?", options: ["Mengapakah", "Di manakah", "Berapakah"], answer: 0, cat: "bulatkan" }
  ],

  /* ---------------- KATA ARAH (80 soalan) ----------------
     atas, bawah, luar, dalam, kiri, kanan, hadapan, belakang, sebelah, tepi.
     Sumber: Bahasa_Quest_Kata_Arah_80_MCQ.docx */
  kata_arah: [
    { q: "Ibu menjemur pakaian di ______ rumah.", options: ["dalam", "luar", "atas", "bawah"], answer: 1, cat: "kata_arah" },
    { q: "Abang memasang kipas angin di ______ bilik.", options: ["luar", "belakang", "dalam", "tepi"], answer: 2, cat: "kata_arah" },
    { q: "Ibu meletakkan bakul pakaian di ______ dinding.", options: ["tepi", "atas", "luar", "hadapan"], answer: 0, cat: "kata_arah" },
    { q: "Buku cerita itu terletak di ______ meja.", options: ["bawah", "sebelah", "atas", "belakang"], answer: 2, cat: "kata_arah" },
    { q: "Kucing itu tidur di ______ kerusi.", options: ["bawah", "atas", "luar", "dalam"], answer: 0, cat: "kata_arah" },
    { q: "Murid-murid berdiri di ______ kelas sebelum masuk.", options: ["dalam", "belakang", "luar", "bawah"], answer: 2, cat: "kata_arah" },
    { q: "Cikgu sedang mengajar di ______ kelas.", options: ["luar", "tepi", "dalam", "atas"], answer: 2, cat: "kata_arah" },
    { q: "Kereta ayah diletakkan di ______ rumah.", options: ["hadapan", "atas", "dalam", "kiri"], answer: 0, cat: "kata_arah" },
    { q: "Taman kecil itu terletak di ______ rumah kami.", options: ["tepi", "belakang", "atas", "dalam"], answer: 1, cat: "kata_arah" },
    { q: "Kedai buku terletak di ______ kedai alat tulis.", options: ["bawah", "belakang", "sebelah", "luar"], answer: 2, cat: "kata_arah" },
    { q: "Amin menulis menggunakan tangan ______ kerana tangan kirinya memegang buku.", options: ["belakang", "kanan", "atas", "dalam"], answer: 1, cat: "kata_arah" },
    { q: "Kumar memegang buku dengan tangan ______ kerana tangan kanannya memegang pensel.", options: ["kiri", "bawah", "luar", "belakang"], answer: 0, cat: "kata_arah" },
    { q: "Pensel itu berada di ______ buku latihan.", options: ["bawah", "atas", "tepi", "luar"], answer: 1, cat: "kata_arah" },
    { q: "Bola itu bergolek ke ______ meja.", options: ["atas", "belakang", "bawah", "sebelah"], answer: 2, cat: "kata_arah" },
    { q: "Ayah menunggu kami di ______ restoran.", options: ["luar", "dalam", "atas", "kanan"], answer: 0, cat: "kata_arah" },
    { q: "Makanan disimpan di ______ peti sejuk.", options: ["tepi", "luar", "dalam", "hadapan"], answer: 2, cat: "kata_arah" },
    { q: "Adik duduk di ______ katil sambil membaca buku.", options: ["tepi", "belakang", "atas", "luar"], answer: 0, cat: "kata_arah" },
    { q: "Bas sekolah berhenti di ______ pintu pagar sekolah.", options: ["bawah", "hadapan", "belakang", "dalam"], answer: 1, cat: "kata_arah" },
    { q: "Stor sekolah terletak di ______ bangunan utama.", options: ["belakang", "atas", "kanan", "dalam"], answer: 0, cat: "kata_arah" },
    { q: "Klinik itu terletak di ______ bank.", options: ["bawah", "luar", "sebelah", "atas"], answer: 2, cat: "kata_arah" },
    { q: "Jam dinding tergantung di ______ papan putih.", options: ["atas", "bawah", "tepi", "luar"], answer: 0, cat: "kata_arah" },
    { q: "Kasut disusun di ______ rak.", options: ["belakang", "bawah", "atas", "sebelah"], answer: 1, cat: "kata_arah" },
    { q: "Kanak-kanak sedang bermain di ______ rumah.", options: ["dalam", "bawah", "luar", "belakang"], answer: 2, cat: "kata_arah" },
    { q: "Adik menyimpan permainannya di ______ kotak.", options: ["luar", "dalam", "atas", "hadapan"], answer: 1, cat: "kata_arah" },
    { q: "Nenek duduk di ______ tingkap.", options: ["tepi", "dalam", "belakang", "bawah"], answer: 0, cat: "kata_arah" },
    { q: "Ayah menanam pokok bunga di ______ rumah.", options: ["belakang", "atas", "hadapan", "dalam"], answer: 2, cat: "kata_arah" },
    { q: "Ibu menanam pokok pisang di ______ rumah.", options: ["belakang", "hadapan", "atas", "tepi"], answer: 0, cat: "kata_arah" },
    { q: "Rumah Ali terletak di ______ rumah Kumar.", options: ["bawah", "sebelah", "dalam", "hadapan"], answer: 1, cat: "kata_arah" },
    { q: "Semasa berjalan, kita perlu berada di ______ jalan yang selamat.", options: ["tengah", "atas", "tepi", "dalam"], answer: 2, cat: "kata_arah" },
    { q: "Pemandu kereta di Malaysia duduk di bahagian ______ kereta.", options: ["kanan", "bawah", "luar", "belakang"], answer: 0, cat: "kata_arah" },
    { q: "Pintu kelas berada di sebelah ______ papan putih; tingkap pula di sebelah kanan.", options: ["kanan", "kiri", "atas", "belakang"], answer: 1, cat: "kata_arah" },
    { q: "Burung itu hinggap di ______ bumbung rumah.", options: ["bawah", "dalam", "atas", "tepi"], answer: 2, cat: "kata_arah" },
    { q: "Anak kucing bersembunyi di ______ sofa.", options: ["atas", "bawah", "luar", "hadapan"], answer: 1, cat: "kata_arah" },
    { q: "Murid-murid berkumpul di ______ dewan sebelum masuk.", options: ["luar", "dalam", "atas", "belakang"], answer: 0, cat: "kata_arah" },
    { q: "Datuk sedang berehat di ______ rumah.", options: ["luar", "belakang", "dalam", "bawah"], answer: 2, cat: "kata_arah" },
    { q: "Sebuah pasu bunga diletakkan di ______ pintu.", options: ["tepi", "belakang", "bawah", "atas"], answer: 0, cat: "kata_arah" },
    { q: "Pengawal keselamatan berdiri di ______ pintu pagar.", options: ["belakang", "hadapan", "atas", "dalam"], answer: 1, cat: "kata_arah" },
    { q: "Kolam ikan berada di ______ rumah datuk.", options: ["atas", "sebelah", "belakang", "dalam"], answer: 2, cat: "kata_arah" },
    { q: "Kedai roti terletak di ______ kedai runcit.", options: ["sebelah", "bawah", "atas", "luar"], answer: 0, cat: "kata_arah" },
    { q: "Amir mengangkat tangan ______ untuk menjawab soalan kerana tangan kirinya memegang buku.", options: ["kiri", "belakang", "kanan", "atas"], answer: 2, cat: "kata_arah" },
    { q: "Guru meletakkan buku latihan di ______ meja.", options: ["bawah", "atas", "luar", "belakang"], answer: 1, cat: "kata_arah" },
    { q: "Selipar adik berada di ______ katil.", options: ["bawah", "atas", "sebelah", "luar"], answer: 0, cat: "kata_arah" },
    { q: "Kami makan malam di ______ rumah kerana cuaca baik.", options: ["dalam", "luar", "belakang", "bawah"], answer: 1, cat: "kata_arah" },
    { q: "Wang itu disimpan di ______ dompet.", options: ["atas", "luar", "dalam", "tepi"], answer: 2, cat: "kata_arah" },
    { q: "Ayah berhenti di ______ jalan untuk melihat peta.", options: ["tengah", "tepi", "atas", "belakang"], answer: 1, cat: "kata_arah" },
    { q: "Murid-murid beratur di ______ bilik darjah.", options: ["hadapan", "belakang", "bawah", "dalam"], answer: 0, cat: "kata_arah" },
    { q: "Sebuah gelanggang badminton terletak di ______ sekolah.", options: ["atas", "belakang", "dalam", "kanan"], answer: 1, cat: "kata_arah" },
    { q: "Balai polis berada di ______ pejabat pos.", options: ["belakang", "bawah", "sebelah", "atas"], answer: 2, cat: "kata_arah" },
    { q: "Adik memegang sudu dengan tangan ______ kerana tangan kanannya cedera.", options: ["kiri", "kanan", "belakang", "atas"], answer: 0, cat: "kata_arah" },
    { q: "Kakak memakai jam pada pergelangan tangan ______, bukan tangan kiri.", options: ["kiri", "bawah", "kanan", "luar"], answer: 2, cat: "kata_arah" },
    { q: "Beg sekolah Amir diletakkan di ______ kerusi.", options: ["bawah", "atas", "dalam", "belakang"], answer: 1, cat: "kata_arah" },
    { q: "Bola sepak itu tersangkut di ______ kereta.", options: ["atas", "sebelah", "bawah", "luar"], answer: 2, cat: "kata_arah" },
    { q: "Kasut perlu ditanggalkan dan diletakkan di ______ rumah.", options: ["dalam", "bawah", "luar", "belakang"], answer: 2, cat: "kata_arah" },
    { q: "Ibu menyimpan beras di ______ bekas.", options: ["dalam", "atas", "luar", "belakang"], answer: 0, cat: "kata_arah" },
    { q: "Kanak-kanak itu duduk di ______ kolam sambil melihat ikan.", options: ["atas", "tepi", "belakang", "dalam"], answer: 1, cat: "kata_arah" },
    { q: "Teksi berhenti di ______ hotel.", options: ["belakang", "hadapan", "atas", "dalam"], answer: 1, cat: "kata_arah" },
    { q: "Ayah membina sebuah stor kecil di ______ rumah.", options: ["hadapan", "dalam", "belakang", "atas"], answer: 2, cat: "kata_arah" },
    { q: "Restoran itu terletak di ______ pasar raya.", options: ["sebelah", "bawah", "belakang", "dalam"], answer: 0, cat: "kata_arah" },
    { q: "Hafiz berdiri di sebelah ______ guru; Ali berada di sebelah kanan guru.", options: ["kanan", "kiri", "bawah", "belakang"], answer: 1, cat: "kata_arah" },
    { q: "Pintu masuk kantin terletak di bahagian ______ bangunan, manakala pintu keluar di bahagian kiri.", options: ["kanan", "atas", "dalam", "bawah"], answer: 0, cat: "kata_arah" },
    { q: "Ibu meletakkan buah-buahan di ______ meja makan.", options: ["bawah", "dalam", "atas", "belakang"], answer: 2, cat: "kata_arah" },
    { q: "Kucing itu bersembunyi di ______ meja makan.", options: ["bawah", "atas", "luar", "sebelah"], answer: 0, cat: "kata_arah" },
    { q: "Adik bermain bola di ______ rumah bersama rakannya.", options: ["dalam", "luar", "bawah", "atas"], answer: 1, cat: "kata_arah" },
    { q: "Baju-baju itu disimpan di ______ almari.", options: ["luar", "atas", "dalam", "tepi"], answer: 2, cat: "kata_arah" },
    { q: "Kami duduk di ______ sungai sambil menikmati pemandangan.", options: ["dalam", "belakang", "tepi", "atas"], answer: 2, cat: "kata_arah" },
    { q: "Guru besar berdiri di ______ murid-murid semasa perhimpunan.", options: ["hadapan", "belakang", "bawah", "sebelah"], answer: 0, cat: "kata_arah" },
    { q: "Tong sampah besar diletakkan di ______ kantin.", options: ["atas", "belakang", "dalam", "kanan"], answer: 1, cat: "kata_arah" },
    { q: "Kedai bunga berada di ______ kedai kek.", options: ["bawah", "luar", "sebelah", "atas"], answer: 2, cat: "kata_arah" },
    { q: "Siti duduk di sebelah ______ Farah; Kumar duduk di sebelah kanan Farah.", options: ["kiri", "kanan", "belakang", "atas"], answer: 0, cat: "kata_arah" },
    { q: "Kumar berdiri di sebelah ______ abangnya; adiknya berdiri di sebelah kiri abangnya.", options: ["bawah", "kanan", "kiri", "dalam"], answer: 1, cat: "kata_arah" },
    { q: "Sebuah lampu tergantung di ______ meja makan.", options: ["bawah", "belakang", "atas", "dalam"], answer: 2, cat: "kata_arah" },
    { q: "Anak anjing tidur di ______ bangku.", options: ["atas", "tepi", "bawah", "luar"], answer: 2, cat: "kata_arah" },
    { q: "Ayah sedang mencuci kereta di ______ rumah.", options: ["dalam", "luar", "atas", "bawah"], answer: 1, cat: "kata_arah" },
    { q: "Murid-murid sedang membaca buku di ______ perpustakaan.", options: ["luar", "belakang", "dalam", "tepi"], answer: 2, cat: "kata_arah" },
    { q: "Pokok kelapa tumbuh di ______ pantai.", options: ["dalam", "atas", "tepi", "belakang"], answer: 2, cat: "kata_arah" },
    { q: "Sebuah bas berhenti di ______ sekolah.", options: ["hadapan", "belakang", "dalam", "bawah"], answer: 0, cat: "kata_arah" },
    { q: "Dapur rumah nenek terletak di bahagian ______ rumah.", options: ["atas", "hadapan", "belakang", "kanan"], answer: 2, cat: "kata_arah" },
    { q: "Farmasi itu terletak di ______ klinik.", options: ["bawah", "sebelah", "dalam", "belakang"], answer: 1, cat: "kata_arah" },
    { q: "Ketika menaiki tangga, Amir berdiri di sebelah ______ bapanya; kakaknya berada di sebelah kanan bapanya.", options: ["kanan", "bawah", "kiri", "atas"], answer: 2, cat: "kata_arah" },
    { q: "Mei Ling duduk di sebelah ______ ibunya; abangnya duduk di sebelah kiri ibunya.", options: ["kanan", "kiri", "belakang", "bawah"], answer: 0, cat: "kata_arah" }
  ],

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
