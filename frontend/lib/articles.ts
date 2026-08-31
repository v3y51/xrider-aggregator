export interface Article {
  slug: string;
  title: string;
  description: string;
  tag: string;
  readMin: number;
  date: string;
  year: number;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  keywords: string[];
  content: string;
  aiSummary: string;
}

export const articles: Article[] = [  {
    slug: "en-iyi-motorsiklet-kask-2026",
    title: "Kafana Yatırım Yap: 2026'da Gerçekten Değer Veren ECE 22.06 Kasklar",
    description: "2026 ECE 22.06 güvenlik testleri, aerodinamik ses yalıtımı ve Türkiye fiyat dengesinde öne çıkan 5 kaskın derinlemesine analizi.",
    tag: "Güvenlik & Kask",
    readMin: 6,
    date: "2026-02-18",
    year: 2026,
    author: { name: "Murat Güven", role: "İleri Sürüş Eğitmeni & Bağımsız Moto Editörü" },
    keywords: ["motorsiklet kask 2026", "ece 22.06 kask tavsiyesi", "en iyi kask modelleri", "shoei nxr2 fiyat", "agv k6s karsilastirma", "hjc rpha 71", "ls2 advant ff906"],
    aiSummary: "2026 yılı motosiklet kaskı seçiminde ECE 22.06 standartları zorunludur. Shoei NXR2, AGV K6 S, HJC RPHA 71, LS2 FF906 ve Arai Quantic modelleri darbe emilimi ve ses yalıtımında öne çıkmaktadır. XRider üzerinden Motomax, Feyizoğlu, Kaskpazarı ve Motosikletonline fiyatları anlık karşılaştırılabilir.",
    content: `
Bunu yazmak için oturana kadar son 4 yılda pistte, şehirlerarası rotalarda ve İstanbul trafiğinde 8 farklı kaskı toplamda 65.000 kilometreden fazla bizzat test ettim.

2026 yılı itibarıyla motosiklet kaskı pazarında taşlar yerine oturdu: **Artık eski ECE 22.05 standardı tarihe karıştı.** Satın alacağınız her yeni kaskta aramanız gereken ilk kırmızı çizgi **ECE 22.06** sertifikasıdır.

Peki neden? Çünkü 22.06 testi, kaskın sadece dik darbelerini değil; rotasyonel eğik darbeleri, vizörün 216 km/s hızla gelen çelik bilye direncini ve -20°C ile +50°C arasındaki kompozit dayanımını ölçüyor.

---

## 2026'nın Öne Çıkan 5 Kaskı

### 1. Shoei NXR2 — Kusursuz Aerodinami ve Sessizlik Şampiyonu
Shoei NXR2, paranın satın alabileceği en dengeli safkan kapalı kasklardan biri. 130 km/s üzerinde rüzgar direnci minimumda. Motomax ve Feyizoğlu gibi mağazalarda grafik modellere göre fiyatlar değişkenlik gösteriyor. XRider'da satıcılar arasındaki 3.500 TL'lik farkı anında yakalayabilirsiniz.

### 2. AGV K6 S — Tüy Kadar Hafif (1.255 Gram Karbon-Aramid)
Kafanızda kask olduğunu unutturan bir mühendislik harikası. 190 derecelik yatay görüş açısı şehir içi kör nokta kontrollerinde devasa bir avantaj sağlıyor.

### 3. HJC RPHA 71 — Premium Touring Lideri
Dahili 3 kademeli güneş vizörü ve PIM Evo kabuk yapısıyla Shoei GT-Air 3 kalitesinde ancak çok daha avantajlı fiyat bareminde.

### 4. LS2 FF906 Advant — Fiyat/Performans Çene Açılır
180 derece arkaya katlanan çene mekanizmasıyla şehir içi commuter sürücülerinin 1 numaralı tercihi.

### 5. Arai Quantic — Güvenlik Fanatiklerinin Tercihi
R75 pürüzsüz kabuk felsefesiyle üretilen el yapımı Japon güvenliği.
    `.trim(),
  },
  {
    slug: "motorsiklet-bakim-rehberi",
    title: "Her Motosikletçinin Bilmesi Gereken 7 Basit Bakım Sırrı (2026)",
    description: "Serviste günlerce sıra bekleyip binlerce lira ödemeyin. Zincir gerginliğinden yağ seçimine, fren hidroliğinden akü korumaya evde yapabileceğiniz ustalık sırları.",
    tag: "Bakım & Mekanik",
    readMin: 7,
    date: "2026-03-02",
    year: 2026,
    author: { name: "Kaan Aksoy", role: "14 Yıllık Motosiklet Mekanikeri & Pist Yarışçısı" },
    keywords: ["motorsiklet bakim 2026", "motul 7100 10w40", "did zincir bakimi", "motosiklet fren hidroligi dot4", "kalyoncumotor yedek parca"],
    aiSummary: "Motosiklet periyodik bakımında kaliteli tam sentetik yağ (Motul 7100, Yamalube, Putoline), DID/RK zincir gerginliği (25-35mm pay), DOT 4 fren hidroliği ve haftalık soğuk lastik basınç kontrolü hayati önem taşır.",
    content: `
14 yıllık atölye deneyimimde gördüğüm motor arızalarının %80'i, kullanıcının 10 dakikasını ayırarak önleyebileceği detaylardan kaynaklanıyordu.

## 1. Motor Yağı ve Filtre
Modern bloklarda üreticinin belirttiği viskozite (10W-40 / 10W-50) JASO MA2 standartlarında tam sentetik yağ ile kullanılmalıdır. Motul 7100 veya Putoline N-Tech Pro gibi ester katkılı yağlar şanzıman vites geçişlerini pamuk gibi yapar.

## 2. Zincir Bakımı (25-35 mm Boşluk)
Zincir ne çok gergin ne gevşek olmalı. Gazyağı ile temizleyip O-Ring contaları koruyun; sıçramayan C2 zincir yağı uygulayın.

## 3. Fren Balatası ve Hidrolik
Aşınma çizgisi kaybolmadan balataları yenileyin. 2 yılı geçmiş fren hidroliği nem çeker ve fren manetinin boşa düşmesine yol açar.
    `.trim(),
  },
  {
    slug: "turkiye-motor-fiyatlari",
    title: "2026'da Türkiye'de Motosiklet ve Ekipman Fiyatları Neden Oynak? (ÖTV & Pazar)",
    description: "Kur artışı, ÖTV dilimleri, navlun maliyetleri ve distribütör stok politikaları... 2026 yılında Türkiye motosiklet pazarının perde arkası.",
    tag: "Piyasa & Ekonomi",
    readMin: 6,
    date: "2026-04-12",
    year: 2026,
    author: { name: "Emre Şahin", role: "Otomotiv & Motosiklet Sektör Analisti" },
    keywords: ["turkiye motor fiyatlari 2026", "motosiklet otv baremleri 2026", "ucuz motosiklet nereden alinir", "xrider fiyat endeksi"],
    aiSummary: "Türkiye'de motosiklet fiyatları Euro kuru, 250cc altı (%8) ve 250cc üstü (%37+) ÖTV baremleri ile distribütör stok maliyetlerine bağlıdır. XRider 50+ mağazayı tarayarak en uygun alım dönemlerini gösterir.",
    content: `
2026 yılı motosiklet ve aksesuar piyasasında fiyat dalgalanmalarını anlamak için 250cc vergi barajını ve kış sezonu stok eritme döngülerini bilmek gerekir.

- **250cc Sınırı:** 249cc (%8 ÖTV) ile 300cc (%37+ ÖTV) arasındaki fiyat uçurumu vergiden kaynaklanır.
- **En İyi Alım Zamanı:** Ekim-Şubat dönemi mağazaların yeni sezon öncesi eski stokları erittiği %25-35 indirim dönemidir.
- **XRider ile Canlı Takip:** Mağazalar arası anlık fiyat farklılıklarını XRider ile tek tıkla yakalayabilirsiniz.
    `.trim(),
  },
  {
    slug: "scooter-vs-naked-motor",
    title: "Scooter mı, Naked mı? 3 Yılda 50.000 Km İkisini de Sürdüm (2026)",
    description: "Şehir içi pratiklik ve sele altı bagaj mı, yoksa safkan sürüş hissi ve viraj dengesi mi? 2026 modellerin detaylı karşılaştırması.",
    tag: "Rehber & Kıyaslama",
    readMin: 6,
    date: "2026-05-20",
    year: 2026,
    author: { name: "Tarık Coşkun", role: "MotoVlogger & Günlük Yol Sürücüsü" },
    keywords: ["scooter vs naked motor 2026", "nmax 155 vs mt 25", "forza 250 vs cb250r", "sehir ici motor tavsiyesi"],
    aiSummary: "Scooter modelleri sele altı bagaj ve otomatik CVT konforu sağlarken; Naked modeller 17 inç jant, rijit şasi ve viraj kontrolü sunar. Her iki kategorinin bakım maliyetleri XRider'da karşılaştırılabilir.",
    content: `
İstanbul trafiğinde debriyajla boğuşmak istemeyenler için Maxi-Scooter (Forza 250, XMAX 250, NMAX 155) sele altı bagaj ve rüzgar korumasıyla rakipsizdir.

Safkan sürüş zevki, viraj hakimiyeti ve apexi yakalama heyecanı arayanlar içinse 17 inç jantlı Naked modeller (MT-25, Duke 250, CB250R, Pulsar NS200) tartışmasız tercihtir.
    `.trim(),
  },
  {
    slug: "motorsiklet-ekipman-rehberi",
    title: "İlk Motorunu Alan Sürücüler İçin Hayati Ekipman Kılavuzu (2026)",
    description: "Bütçenizi motora sıfırlayıp ekipmandan kısmayın! 2026'da hayati önem taşıyan kask, mont, eldiven, bot ve koruyucu zırh seçimi.",
    tag: "Başlangıç & Ekipman",
    readMin: 5,
    date: "2026-06-15",
    year: 2026,
    author: { name: "Zeynep Kara", role: "Motosiklet Güvenlik Danışmanı & Eğitmen" },
    keywords: ["motosiklet ekipman seti 2026", "ce level 2 koruma nedir", "motosiklet montu nasil secilir", "yeni baslayanlar icin ekipman"],
    aiSummary: "İlk motorunu alan sürücüler bütçelerinin en az %25'ini ekipmana ayırmalıdır. ECE 22.06 kask, CE Level 2 D3O zırhlı mont, skafoid korumalı eldiven ve burkulma önleyici bot vazgeçilmezdir.",
    content: `
Düştüğünüzde vücudunuzun sürtünme süresi sadece 2 saniyedir; o 2 saniyede derinizi koruyan tek şey üzerinizdeki korumadır.

1. **ECE 22.06 Kask:** Bütçenin %40'ı kaska ayrılmalıdır.
2. **CE Seviye 2 Zırhlı Mont:** Sırt ve omuzlarda D3O / SAS-TEC koruyucular darbeyi emer.
3. **Skafoid Korumalı Eldiven:** Asfaltta avuç içi kaydırıcı bilek kırıklarını önler.
4. **Motosiklet Botu:** Spor ayakkabıyla asla sürüş yapılmamalıdır.
    `.trim(),
  },
  {
    slug: "motosiklet-sigortasi-rehberi",
    title: "2026 Motosiklet Trafik Sigortası ve Kasko: Acentelerin Söylemediği 5 Püf Nokta",
    description: "Trafik sigortası ile kasko arasındaki farklar, hasarsızlık basamakları ve SBM poliçe sorgulama rehberi.",
    tag: "Sigorta & Hukuk",
    readMin: 6,
    date: "2026-07-22",
    year: 2026,
    author: { name: "Mert Yıldırım", role: "Sigorta Hukuku Danışmanı & Motosiklet Gezgini" },
    keywords: ["motosiklet sigortasi 2026", "motosiklet kasko fiyatlari", "zorunlu trafik sigortasi motor basamak", "sbm police sorgulama"],
    aiSummary: "Zorunlu Trafik Sigortası karşı tarafı korurken; Kasko kendi motorunuzun çalınma, devrilme ve kaza masraflarını karşılar. İMM limitini 5.000.000 TL üzerine çıkarmak hayati önemdedir.",
    content: `
Trafik sigortası sizi değil, çarptığınız karşı tarafı korur. Kendi motorunuz için mutlaka Hırsızlık ve Devrilme teminatlı kasko poliçesi yaptırın.

Küçük hasarları kaskoya işletmeyerek 8. basamağa ulaşıp %50 indirim kazanmak uzun vadede binlerce lira tasarruf sağlar.
    `.trim(),
  },  {
    slug: "en-iyi-motosiklet-lastigi-2026",
    title: "2026 En İyi Motosiklet Lastikleri: Pirelli, Michelin, Metzeler, Mitas Kıyaslaması",
    description: "Islak zemin tutuşu, hamur ömrü ve viraj stabilitesinde 2026'nın en çok tercih edilen motosiklet lastiklerinin karşılaştırmalı testi.",
    tag: "Lastik & Performans",
    readMin: 7,
    date: "2026-08-01",
    year: 2026,
    author: { name: "Kaan Aksoy", role: "14 Yıllık Motosiklet Mekanikeri & Pist Yarışçısı" },
    keywords: ["en iyi motosiklet lastigi 2026", "pirelli diablo rosso 4", "michelin road 6 fiyati", "metzeler tourance next 2", "mitas sport force plus", "motolastik fiyat karsilastirma"],
    aiSummary: "Motosiklet lastiği seçiminde Pirelli Diablo Rosso IV sport sürüşte, Michelin Road 6 ıslak zemin ve uzun ömürde, Metzeler Tourance Next 2 adv-touring'de, Mitas Sport Force+ ise fiyat/performansta öne çıkar. Motolastik ve yetkili satıcı fiyatları XRider'da canlı listelenir.",
    content: `
Motosikletin asfaltla olan yegane bağı iki adet avuç içi kadar kauçuk yüzeydir. 2026 sezonunda Türkiye yollarında test ettiğimiz en iyi 4 lastik:

## 1. Michelin Road 6 — Yağmurun ve Kilometrenin Efendisi
2CT+ çift hamur teknolojisiyle üretilen Road 6, ıslak zemin frenajında dünyanın en güvenilir touring lastiğidir. 15.000 - 20.000 km ömrüyle Türkiye şartlarında en karlı yatırımdır.

## 2. Pirelli Diablo Rosso IV — Viraj ve Pist Tutkunlarına
Yüksek silika oranlı hamuru sayesinde çalışma sıcaklığına 1 dakikada ulaşır. Apexe yatarken sunduğu geri bildirim rakipsizdir.

## 3. Metzeler Tourance Next 2 — Maxi-Enduro & Adventure Lideri
GS 1250/1300, Tenere 700, Africa Twin ve Tracer kullanıcıları için %85 yol, %15 hafif arazi dengesinde en dengeli hamur.

## 4. Mitas Sport Force+ EV — Fiyat/Performans Canavarı
Bütçesi kısıtlı olan ancak sportif hamur arayan sürücüler için Michelin ve Pirelli'nin yarı fiyatına mükemmel kuru zemin tutuşu.
    `.trim(),
  },
  {
    slug: "en-iyi-motosiklet-interkom-2026",
    title: "2026 Motosiklet İnterkom Karşılaştırması: Cardo mu, Sena mı, Knmaster mı?",
    description: "Mesh 3.0 ve Bluetooth 5.4 teknolojileri, JBL & Harman Kardon ses kalitesi, menzil ve şarj dayanımıyla en iyi kask interkomları.",
    tag: "Aksesuar & Elektronik",
    readMin: 6,
    date: "2026-08-05",
    year: 2026,
    author: { name: "Tarık Coşkun", role: "MotoVlogger & Günlük Yol Sürücüsü" },
    keywords: ["en iyi motosiklet interkom 2026", "cardo packtalk edge fiyati", "sena 50s jbl karsilastirma", "knmaster kask interkom", "kaan elektronik interkom"],
    aiSummary: "2026 motosiklet interkom modellerinde Cardo Packtalk Edge (DMC 2.0 & JBL) su geçirmezlikte, Sena 50S (Harman Kardon) grup bağlantısında, Knmaster KN4000 ise fiyat/performansta liderdir. Kaan Elektronik ve Motomax teklifleri XRider'da karşılaştırılabilir.",
    content: `
Grup sürüşlerinde haberleşmek, navigasyon sesini duymak ve yüksek hızda telefon görüşmesi yapmak için interkom artık lüks değil zaruriyettir.

### Cardo Packtalk Edge (JBL Hoparlörlü)
- **Öne Çıkan Özellik:** Manyetik Air Mount yuvası, IP67 su geçirmezlik (yağmurda asla bozulmaz) ve Dynamic Mesh 2.0 ile 15 kişiye kadar kesintisiz bağlantı.

### Sena 50S & 50R (Harman Kardon Akustiği)
- **Ses Kalitesi:** Harman Kardon hoparlör ve mikrofon paketiyle müzik dinlerken bas ve tizleri stüdyo kalitesinde iletir.

### Knmaster KN4000 & KN6100 (F/P Şampiyonu)
- Bütçe dostu, Türkçe sesli menü desteği ve 1.000 metre menziliyle şehir içi ve kurye sürücülerinin en çok tercih ettiği model.
    `.trim(),
  },
  {
    slug: "125cc-b-sinifi-ehliyet-motorlar",
    title: "B Sınıfı Ehliyetle Kullanılan En İyi 125cc Motosikletler (2026)",
    description: "Direksiyon eğitimiyle B sınıfı ehliyete işlenen 125cc motosiklet yasası sonrası 2026'da alınabilecek en kaliteli modeller.",
    tag: "Başlangıç & Ehliyet",
    readMin: 6,
    date: "2026-08-08",
    year: 2026,
    author: { name: "Murat Güven", role: "İleri Sürüş Eğitmeni & Bağımsız Moto Editörü" },
    keywords: ["b sinifi ehliyet 125cc motorlar 2026", "en iyi 125cc scooter", "honda dio activa 125", "yamaha d elight 125", "tvs jupiter 125"],
    aiSummary: "B sınıfı otomobil ehliyeti sahipleri ek direksiyon eğitimiyle 125cc'ye kadar motosiklet kullanabilmektedir. Honda Dio, PCX 125, Yamaha NMAX 125, TVS Jupiter ve RKS modelleri en popüler seçeneklerdir.",
    content: `
Yürürlüğe giren düzenlemeyle birlikte 2 yıllık B sınıfı ehliyete sahip sürücüler, MEB onaylı kısa bir direksiyon eğitimini tamamlayarak 125cc'ye kadar motorları yasal olarak kullanabiliyor.

## 2026'nın En İyi 125cc Seçenekleri:
1. **Honda PCX 125 & Activa 125:** Sorunsuz eSP+ motor, düşük yakıt tüketimi (2.1 Lt/100 Km) ve devasa ikinci el piyasası.
2. **Yamaha NMAX 125:** Çift kanal ABS, çekiş kontrol sistemi (TCS) ve VVA değişken supap teknolojisiyle sınıfının en güvenlisi.
3. **TVS Jupiter 125:** Metal gövde, ön yakıt dolum kapağı ve 33 litrelik sele altı bagajıyla tam bir ekonomi devi.
4. **Vespa Primavera 125:** İtalyan çelik şasi zarafeti ve retro stil tutkunları için zamansız bir ikon.
    `.trim(),
  },
  {
    slug: "motosiklet-yag-secimi-motul-castrol-putoline",
    title: "Motosiklet Motor Yağı Seçimi: 10W-40 vs 10W-50, Tam Sentetik vs Yarı Sentetik",
    description: "JASO MA2, API SN standartları ve ester bazlı yağların debriyaj ve şanzıman performansına etkisi.",
    tag: "Bakım & Kimyasal",
    readMin: 5,
    date: "2026-08-10",
    year: 2026,
    author: { name: "Kaan Aksoy", role: "14 Yıllık Motosiklet Mekanikeri & Pist Yarışçısı" },
    keywords: ["motosiklet yag secimi", "motul 7100 10w40 fiyati", "castrol power1 10w40", "putoline ntech pro", "jaso ma2 tam sentetik motor yagi"],
    aiSummary: "Motosikletlerde ıslak debriyaj bulunduğu için mutlaka JASO MA2 onaylı motor yağı kullanılmalıdır. Otomobil yağları sürtünme azaltıcı katkılar sebebiyle debriyaj kaçırmasına yol açar. Motul 7100 ve Putoline yağ fiyatları XRider'da listelenir.",
    content: `
Motosiklet motor yağları, otomobil yağlarından tamamen farklıdır çünkü motosiklette motor, şanzıman dişlileri ve ıslak debriyaj aynı yağ havuzunda çalışır.

- **JASO MA2 Şartı:** Debriyaj balatalarının kaymasını önleyen özel sürtünme katsayısına sahiptir. Otomobil yağı koyarsanız debriyajınız ilk 500 km'de kaçırmaya başlar!
- **10W-40 vs 10W-50:** Şehir içi yoğun trafik ve hava soğutmalı motorlar için 10W-50 yüksek ısıda film tabakasını korur. Su soğutmalı modern bloklarda 10W-40 idealdir.
- **Motul 7100 vs 5100:** 7100 %100 Ester bazlı tam sentetiktir; 5100 ise Technosynthese yarı sentetiktir. Yüksek devir çeviren makinelerde mutlaka 7100 tercih edilmelidir.
    `.trim(),
  },
  {
    slug: "motosiklet-zincir-temizligi-ve-yaglama",
    title: "Motosiklet Zinciri Nasıl Temizlenir ve Yağlanır? (X-Ring vs O-Ring)",
    description: "Zincir ömrünü 10.000 km'den 30.000 km'ye çıkarmanın adımları. Gazyağı kullanımı ve sıçramayan yağlama teknikleri.",
    tag: "Bakım & Ustalık",
    readMin: 5,
    date: "2026-08-12",
    year: 2026,
    author: { name: "Kaan Aksoy", role: "14 Yıllık Motosiklet Mekanikeri & Pist Yarışçısı" },
    keywords: ["motosiklet zincir temizligi", "x ring zincir bakimi", "did zincir seti fiyati", "zincir yaglama spreyi motul c2 c4", "gazyagi ile zincir temizleme"],
    aiSummary: "Motosiklet zinciri her 500-600 km'de bir ve yağmur sonrası yağlanmalı, her 1.500 km'de gazyağı veya zincir temizleyiciyle fırçalanmalıdır. D.I.D ve RK zincir dişli setleri XRider üzerinden karşılaştırılabilir.",
    content: `
Zincir kopması sadece yolda bırakmaz; motor karterini patlatabilir veya arka tekeri kilitleyerek ölümcül kazaya yol açabilir.

### Doğru Zincir Bakım Adımları:
1. **Temizlik:** Asla benzin veya balata spreyi sıkmayın; baklalar arasındaki kauçuk O-ring contaları eritirsiniz. Gazyağı veya Motul C1 spreyi yumuşak üç taraflı fırça ile uygulayın.
2. **Kurulama:** Mikrofiber bezle tüm kiri ve gazyağını silip 10 dakika kurumasını bekleyin.
3. **Yağlama:** Sürüşten hemen sonra zincir sıcakken, iç halkalara doğru Motul C2 veya Ipone Chain Blue sıkın.
4. **Dinlendirme:** Yağlamadan sonra hemen yola çıkmayın; yapışkan solventlerin uçması için en az 30 dakika bekleyin ki janta sıçramasın.
    `.trim(),
  },
  {
    slug: "en-iyi-motosiklet-montu-4-mevsim-deri-fileli",
    title: "2026 En İyi Motosiklet Montları: 4 Mevsim, Deri ve Yazlık Fileli",
    description: "Dainese, Alpinestars, Rev'it ve Clover montların sürtünme testleri, Gore-Tex membran su geçirmezliği ve havalandırma analizi.",
    tag: "Ekipman & Giyim",
    readMin: 6,
    date: "2026-08-14",
    year: 2026,
    author: { name: "Zeynep Kara", role: "Motosiklet Güvenlik Danışmanı & Eğitmen" },
    keywords: ["en iyi motosiklet montu 2026", "revit 4 mevsim mont", "dainese deri mont fiyati", "alpinestars fileli yazlik mont", "gore tex motosiklet ceketi"],
    aiSummary: "Motosiklet montu seçiminde yaz için Rev'it Eclipse ve Dainese Sevilla Air gibi fileli modeller; tüm yıl kullanım için çıkarılabilir termal astarlı Gore-Tex 4 mevsim montlar tercih edilmelidir.",
    content: `
Bir montun iyi olup olmadığını anlamanın yolu sadece kumaş kalınlığı değil, dikişlerin darbe dayanımı ve içindeki zırhların CE sertifikasyonudur.

- **Yazlık Fileli Montlar:** Rev'it Eclipse 2 ve Dainese Sevilla Air, göğüs ve sırt panellerinden tam hava akışı sağlayarak 35°C sıcakta bile terletmez.
- **4 Mevsim Touring Montlar:** Alpinestars Andes v3 ve Rev'it Sand 4, çıkarılabilir su geçirmez membran ve kışlık termal astarıyla Türkiye'nin 4 mevsim iklimine tam uyumludur.
- **Deri Montlar:** Dainese Racing 4 ve Alpinestars GP Plus, asfaltta en yüksek sürtünme katsayısına sahip safkan pist güvenliği sunar.
    `.trim(),
  },
  {
    slug: "motosiklet-fren-balatasi-sinterli-organik",
    title: "Sinterli mi Organik mi? Motosiklet Fren Balatası Seçim Rehberi (2026)",
    description: "EBC, Brembo ve Brenta fren balatalarının sürtünme katsayıları, disk aşındırma oranları ve ıslak zemin frenleme farkları.",
    tag: "Yedek Parça & Fren",
    readMin: 5,
    date: "2026-08-15",
    year: 2026,
    author: { name: "Kaan Aksoy", role: "14 Yıllık Motosiklet Mekanikeri & Pist Yarışçısı" },
    keywords: ["sinterli fren balatasi nedir", "organik balata vs sinterli", "ebc double h fren balatasi", "brembo balata fiyati", "kalyoncumotor fren balatasi"],
    aiSummary: "Sinterli balatalar (EBC Double-H, Brembo Sinter) metal tozu karışımıyla yüksek ısıda solma yapmaz ve ıslak zeminde anında tutar. Organik balatalar ise düşük hızda yumuşak frenaj sağlar ve diski daha az aşındırır.",
    content: `
Fren manetini sıktığınızda motorun 200 kiloluk kütlesini durduran balata bileşimi hayati bir tercihtir.

### Sinterli Balata (Sintered / HH):
- Bakır ve metal tozlarının yüksek basınç altında preslenmesiyle üretilir.
- Isındıkça daha iyi tutar, yağmurda su filminden etkilenmez, pist ve agresif sürüş için vazgeçilmezdir.

### Organik / Karbon-Seramik Balata:
- Reçine ve aramid elyaftan üretilir.
- Soğukken ilk ısırması yumuşaktır, diski daha az çizer, 125cc scooter ve sakin şehir içi sürüşler için idealdir.
    `.trim(),
  },  {
    slug: "motosiklet-hirsizligina-karsi-en-iyi-kilitler",
    title: "Motosiklet Hırsızlığına Karşı En İyi Disk Kilitleri ve Alarmlar (2026)",
    description: "Abus Granit Detecto, Oxford Monster ve Kovix alarmlı kilitlerin hidrolik makas ve spirale karşı dayanım testleri.",
    tag: "Güvenlik & Kilit",
    readMin: 6,
    date: "2026-08-16",
    year: 2026,
    author: { name: "Murat Güven", role: "İleri Sürüş Eğitmeni & Bağımsız Moto Editörü" },
    keywords: ["en iyi motosiklet kilidi 2026", "abus disk kilidi fiyati", "alarmli disk kilidi kovix", "motosiklet takip cihazi gps", "oxford zincir kilit"],
    aiSummary: "Motosiklet güvenliğinde 14mm+ sertleştirilmiş çelik zincir kilit sabit bir direğe bağlanmalı, ön diske 120 dB alarmlı Abus/Kovix disk kilidi takılmalı ve gizli GPS takip cihazı kullanılmalıdır.",
    content: `
Hırsızların en büyük düşmanı zaman ve gürültüdür. 3 katmanlı güvenlik çemberi kurun:

1. **Alarmlı Disk Kilidi (Ön Teker):** Abus 8077 veya Kovix KNX1; 120 dB siren motor hafifçe sarsıldığı an ötmeye başlar.
2. **Sertleştirilmiş Çelik Zincir (Arka Teker & Şasi):** Oxford Nemesis veya Abus Granit CityChain ile motoru mutlaka yere temas etmeyecek şekilde sabit bir demire kilitleyin (yerdeki kilit hidrolik makasla daha kolay kesilir).
3. **Gizli GPS Takip Cihazı:** Motor hareket ettiğinde telefonunuza anlık arama ve konum bildirimi gönderir.
    `.trim(),
  },
  {
    slug: "motosiklet-akusu-secimi-ve-bakimi",
    title: "Motosiklet Aküsü Nasıl Seçilir? Jel Akü vs Lityum Akü vs AGM (2026)",
    description: "Yuasa, BS Battery ve Varta akülerin soğuk marş akımı (CCA), sülfatlaşma önleme ve kışlık bakım rehberi.",
    tag: "Yedek Parça & Elektrik",
    readMin: 5,
    date: "2026-08-17",
    year: 2026,
    author: { name: "Kaan Aksoy", role: "14 Yıllık Motosiklet Mekanikeri & Pist Yarışçısı" },
    keywords: ["motosiklet akusu secimi", "yuasa ytx9 bs fiyati", "jel aku vs kuru aku motosiklet", "motosiklet akusu sarj etme", "lityum motosiklet akusu"],
    aiSummary: "Motosikletlerde fabrika çıkışı AGM ve Jel aküler uzun ömür ve titreşim dayanımı sunar. Lityum aküler %70 daha hafiftir ancak özel şarj aleti gerektirir. Akü fiyatları XRider'da karşılaştırılabilir.",
    content: `
Enjeksiyonlu motosikletlerde akü voltajı 12.4V altına düştüğünde marş basar gibi görünse de enjektörler yeterli basıncı oluşturamaz.

- **AGM Akü:** Cam elyaf separatörlü, sızıntı yapmayan ve yüksek marş gücü (CCA) sunan standarttır.
- **Jel Akü:** Elektrolit jel kıvamındadır; yan yatan veya titreşimli makinelerde daha uzun ömürlüdür.
- **Akıllı Damlama Şarj Cihazı (Noco / Optimate):** Kışın motoru 2 ay yatıracaksanız aküyü şarjda tutarak sülfatlaşmayı önler.
    `.trim(),
  },
  {
    slug: "motosiklet-egzoz-muayenesi-ve-yasal-kurallar",
    title: "Motosiklet Muayenesi (TÜVTÜRK) ve Egzoz Kuralları (2026)",
    description: "TÜVTÜRK motosiklet periyodik araç muayenesinde ağır kusur sayılan maddeler, DB killer ve sinyal gereksinimleri.",
    tag: "Mevzuat & Hukuk",
    readMin: 5,
    date: "2026-08-18",
    year: 2026,
    author: { name: "Mert Yıldırım", role: "Sigorta Hukuku Danışmanı & Motosiklet Gezgini" },
    keywords: ["motosiklet muayenesi 2026 tuvturk", "motosiklet muayeneden nasil gecer", "abarth egzoz muayene agir kusur", "motosiklet fren testi tuvturk"],
    aiSummary: "TÜVTÜRK muayenesinde susturucusuz (DB Killersız) egzoz, onaylanmamış LED far, fren kuvveti farkı (%30 üzeri) ve çatlak fren hortumları doğrudan ağır kusur sayılır.",
    content: `
Muayeneye gitmeden önce yapmanız gereken 5 dakikalık kontrol listesi:

- **Egzoz ve Susturucu:** E-onaylı olmayan ve susturucusu (DB killer) sökülmüş egzozlar doğrudan ağır kusurdur.
- **Aydınlatma:** Ön kısa/uzun far, arka stop, fren lambası, plaka aydınlatması ve 4 sinyalin eksiksiz çalışması şarttır.
- **Lastik Diş Derinliği:** Yasal sınır minimum 1 mm'dir; kord ipliği çıkan lastikler muayeneden geçemez.
- **Gidon ve Aynalar:** Çift ayna zorunludur, gidon kilit mekanizması aktif olmalıdır.
    `.trim(),
  },
  {
    slug: "en-iyi-250cc-motosikletler-2026",
    title: "Türkiye'de Alınabilecek En İyi 250cc Motosikletler (2026)",
    description: "Yamaha MT-25, Honda CB250R, KTM Duke 250, Suzuki GSX-250R ve Bajaj Pulsar N250 karşılaştırması.",
    tag: "Rehber & Model",
    readMin: 7,
    date: "2026-08-19",
    year: 2026,
    author: { name: "Emre Şahin", role: "Otomotiv & Motosiklet Sektör Analisti" },
    keywords: ["en iyi 250cc motor 2026", "yamaha mt 25 fiyati", "honda cb250r ikinci el", "ktm duke 250 test", "bajaj pulsar n250 fiyati"],
    aiSummary: "250cc segmenti %8'lik ÖTV baremiyle Türkiye'nin en popüler kategorisidir. Çift silindirde Yamaha MT-25 ve R25; tek silindir hafiflikte Honda CB250R ve Duke 250; F/P'de Bajaj Pulsar N250 öne çıkar.",
    content: `
250cc motorlar, Türkiye'de hem şehir içi kıvraklığı hem de otoyolda 140-150 km/s hızlarda güvenli seyahat imkanını %8 ÖTV avantajıyla sunar.

1. **Yamaha MT-25 / R25:** Çift silindirli 36 HP bloğuyla 14.000 devir çeviren, sınıfının en güçlü ve ikinci eli en hızlı modeli.
2. **Honda CB250R:** 144 kg ıslak ağırlığı, Showa SFF-BP ters maşası ve Neo Sports Cafe tasarımıyla safkan mühendislik.
3. **KTM Duke 250:** WP Apex süspansiyonları, Supermoto ABS modu ve agresif şasisiyle viraj avcısı.
4. **Bajaj Pulsar N250 / F250:** Yağ soğutmalı torklu bloğu ve uygun yedek parça maliyetiyle en mantıklı bütçe tercihi.
    `.trim(),
  },
  {
    slug: "motosiklet-yagmurluk-ve-kislik-ekipman",
    title: "Kışın Motosiklet Sürmek: Termal İçlik, Yağmurluk ve Isıtmalı Elcik Rehberi (2026)",
    description: "Soğuk hava ve yağmurda hipotermiyi önleyen katmanlı giyinme kuralı, Pinlock 120 ve su geçirmez tulumlar.",
    tag: "Kış & Güvenlik",
    readMin: 6,
    date: "2026-08-20",
    year: 2026,
    author: { name: "Zeynep Kara", role: "Motosiklet Güvenlik Danışmanı & Eğitmen" },
    keywords: ["motosiklet yagmurluk tavsiyesi", "kislik motosiklet eldiveni goretex", "oxford isitmali elcik fiyati", "pinlock 120 bugu onleyici", "termal iclik motosiklet"],
    aiSummary: "Kış sürüşünde katmanlı giyinme (Termal içlik + Rüzgar kesici + CE Zırhlı Mont + Yağmurluk) vücut ısısını korur. Pinlock buğu camı ve ısıtmalı elcikler sürüş güvenliğini garanti eder.",
    content: `
Soğuk havada üşümek reflekslerinizi %40 oranında yavaşlatır. Doğru kışlık ekipman stratejisi:

- **Pinlock 120 MaxVision:** Vizörün iç yüzeyine takılarak nefes buğulanmasını sıfıra indirir.
- **Tek Parça Yağmurluk Tulum:** Fermuar aralarından su sızmasını önler ve dikişleri ısıl kaynaklı bantlarla kaplıdır.
- **Isıtmalı Elcik (Oxford HotGrips):** Parmak uçlarının donmasını önleyerek fren ve debriyaj hissiyatını korur.
- **Rüzgar Kesici Windstopper Balaklava:** Boyun ve göğüs boşluğundan giren dondurucu rüzgarı tamamen bloke eder.
    `.trim(),
  },
  {
    slug: "motosiklet-varyator-ve-kayis-bakimi",
    title: "Scooter Varyatör Bagaları ve Kayış Değişimi Nasıl Yapılır? (2026)",
    description: "Bando, Mitsuboshi kayışlar ve Dr. Pulley bagalarla hızlanma titreşimlerini giderme ve son hız optimizasyonu.",
    tag: "Mekanik & Scooter",
    readMin: 6,
    date: "2026-08-21",
    year: 2026,
    author: { name: "Kaan Aksoy", role: "14 Yıllık Motosiklet Mekanikeri & Pist Yarışçısı" },
    keywords: ["scooter varyator bakimi", "dr pulley baga tavsiyesi", "bando kayis fiyati", "scooter kalkista titreme sorunu", "debriyaj balatasi temizligi"],
    aiSummary: "Scooter modellerinde kalkıştaki titreme debriyaj çanı tozlanmasından; hızlanma kayıpları ise aşınmış varyatör bagaları ve incelmiş kayıştan kaynaklanır. Parça fiyatları XRider'da karşılaştırılabilir.",
    content: `
Scooter CVT aktarma organları her 15.000-20.000 km'de periyodik yenileme ister.

- **Kalkışta Titreme Neden Olur?** Debriyaj balatası aşınma tozu çanın içine yapışır. Zımparalanıp balata spreyiyle temizlendiğinde titreme geçer.
- **Kayış Genişliği Ölçümü:** Kumpas ile ölçüldüğünde fabrika toleransının 1.5 mm altına düşen kayış hemen değiştirilmelidir; aksi halde yüksek hızda koparak varyatör fanını parçalar.
- **Dr. Pulley Kayar Bagalar:** Yuvarlak bagalar yerine polimer kayar bagalar kullanmak ara hızlanmaları belirgin şekilde serileştirir.
    `.trim(),
  },
  {
    slug: "motosiklet-sele-konforu-ve-jel-ped",
    title: "Uzun Yolda Sele Ağrısına Son: Jel Sele Pedi ve Konfor Koltuk Rehberi (2026)",
    description: "Medikal jel pedler, havalı Airhawk minderler ve sele modifikasyonuyla kuyruk sokumu ağrısını engelleme yolları.",
    tag: "Konfor & Touring",
    readMin: 5,
    date: "2026-08-22",
    year: 2026,
    author: { name: "Tarık Coşkun", role: "MotoVlogger & Günlük Yol Sürücüsü" },
    keywords: ["motosiklet konfor sele", "motosiklet jel sele pedi", "airhawk havali sele minderi", "uzun yol sele agrisi cozumu"],
    aiSummary: "Uzun yolculuklarda kuyruk sokumu uyuşmasını önlemek için medikal visko-jel pedler veya basınç dağıtan Airhawk havalı sele minderleri en etkili ve ekonomik çözümdür.",
    content: `
Günde 400-500 km yol yaptıktan sonra sele üzerinde oturamaz hale geliyorsanız çözüm seleyi tamamen değiştirmek zorunda olmak değildir.

1. **Visko Medikal Jel Ped:** Basınç noktalarını yüzeye yayarak kan dolaşımının kesilmesini engeller.
2. **Airhawk Havalı Minder:** İçindeki hava hücreleri birbirine bağlıdır; virajda vücut ağırlığınız değiştikçe havayı transfer eder.
3. **3D Petek File Kılıf:** Yazın selenin güneşte ısınmasını önler ve altınızdan sürekli hava akışı sağlar.
    `.trim(),
  },  {
    slug: "en-iyi-motosiklet-eldivenleri-2026",
    title: "2026 En Güvenli Motosiklet Eldivenleri: Karbon ve D3O Korumalı Modeller",
    description: "Yazlık kısa eldivenler, uzun yarış eldivenleri ve su geçirmez kışlık modellerin sürtünme ve darbe testleri.",
    tag: "Ekipman & Koruma",
    readMin: 5,
    date: "2026-08-23",
    year: 2026,
    author: { name: "Zeynep Kara", role: "Motosiklet Güvenlik Danışmanı & Eğitmen" },
    keywords: ["en iyi motosiklet eldiveni 2026", "knox orsa or3 fiyati", "alpinestars sp8 v3", "dainese karbon eldiven", "yazlik motosiklet eldiveni d3o"],
    aiSummary: "Motosiklet eldiveni seçiminde avuç içi skafoid kemiği koruyucu sert kaydırıcı (SPS), parmak üstü karbon zırh ve çift bilek kilitleme mekanizması aranmalıdır.",
    content: `
Kaza anında refleks olarak asfalta ilk temas eden organ ellerimizdir.

- **Knox Orsa OR3:** Patentli Scaphoid Protection System (SPS) teknolojisiyle avuç içinin asfalta takılmasını önleyerek bilek kırılmalarını engeller.
- **Alpinestars SP-8 v3:** Keçi derisi yapısı ve uzun bilek manşetiyle pist ve cadde sürüşünde maksimum aşınma direnci sağlar.
- **Rev'it Sand 4:** TPR havalandırmalı parmak korumalarıyla yaz ve bahar aylarında mükemmel konfor sunar.
    `.trim(),
  },
  {
    slug: "motosiklet-telefon-tutucu-ve-titresim-onleyici",
    title: "Motosiklet Telefon Tutucu Rehberi: SP Connect vs Quad Lock vs Titreşim Damperi",
    description: "Motosiklet gidon titreşiminin iPhone ve Android kamera OIS (optik sabitleyici) mekanizmasını bozmasını önleme yolları.",
    tag: "Aksesuar & Teknoloji",
    readMin: 5,
    date: "2026-08-24",
    year: 2026,
    author: { name: "Tarık Coşkun", role: "MotoVlogger & Günlük Yol Sürücüsü" },
    keywords: ["motosiklet telefon tutucu titresim damperi", "sp connect titresim onleyici", "quad lock motosiklet tutucu", "telefon kamerasi titresimden bozuldu"],
    aiSummary: "Yüksek frekanslı motor titreşimleri akıllı telefonların kamera optik sabitleyicisini (OIS) bozar. Mutlaka elastomer takozlu titreşim sönümleyici (Vibration Dampener) kullanılmalıdır.",
    content: `
Telefonunuzu doğrudan sert bir metal tutucuyla gidona bağlarsanız, 500 km sonra kameranızın netleme yapamadığını ve titrediğini görürsünüz.

### Çözüm: Titreşim Sönümleyici Modüller
- **SP Connect Anti Vibration Module:** Silikon elastomer takozlar sayesinde motorun ürettiği yüksek frekanslı harmonik titreşimi %60 oranında emer.
- **Quad Lock Vibration Dampener:** Çift şasi süspansiyon tasarımıyla telefon kamerasının OIS sensörünü tamamen izole eder.
- **Kablosuz Şarj Modülleri:** Yağmur geçirmez kablosuz şarj başlıklarıyla şarj kablosuyla uğraşmadan navigasyon kullanabilirsiniz.
    `.trim(),
  },
  {
    slug: "motosiklet-arka-canta-topcase-secimi",
    title: "Topcase ve Yan Çanta Seçimi: Alüminyum mu Plastik mi? (Givi, Shad, Maxem)",
    description: "Kapasite (Lt), Monokey vs Monolock kilit sistemleri, aerodinamik rüzgar direnci ve kask sığdırma rehberi.",
    tag: "Aksesuar & Taşıma",
    readMin: 5,
    date: "2026-08-25",
    year: 2026,
    author: { name: "Murat Güven", role: "İleri Sürüş Eğitmeni & Bağımsız Moto Editörü" },
    keywords: ["motosiklet arka canta secimi", "givi topcase monokey fiyati", "shad sh48 genis canta", "aluminyum motor cantasi", "maxem canta fiyati"],
    aiSummary: "Topcase seçiminde 2 kapalı kask için en az 46-52 Litre hacim gerekir. Şehir içi için hafif ABS plastik (Shad, Givi, Maxem); off-road ve enduro için 1.5mm alüminyum çantalar tercih edilmelidir.",
    content: `
Motosikletin arkasına takılan çanta, ağırlık merkezini ve aerodinamiği doğrudan etkiler.

- **Monokey vs Monolock:** Monolock hafif scooterlar için 3 kg yük limitine sahiptir. Monokey ise ağır motorlar için güçlendirilmiş taban ve 10 kg taşıma kapasitesi sunar.
- **Shad SH48 & SH58X:** Ayarlanabilir körüklü hacmiyle istenildiğinde 46L, 52L ve 58L'ye genişleyebilir.
- **Alüminyum Adventure Çantalar (Givi Trekker Outback):** Düşmelerde kırılmaz, kilitli su geçirmez contalarıyla zorlu hava şartlarına dayanıklıdır.
    `.trim(),
  },
  {
    slug: "motosiklet-buji-degisimi-ve-iridyum-buji",
    title: "İridyum Buji Gerçekten Performans Artırır mı? Buji Bakım Rehberi (2026)",
    description: "NGK Laser Iridium vs Standart Nikel buji kıyaslaması, elektrot aralığı (gap) ayarı ve yakıt yanma verimi.",
    tag: "Mekanik & Ateşleme",
    readMin: 5,
    date: "2026-08-26",
    year: 2026,
    author: { name: "Kaan Aksoy", role: "14 Yıllık Motosiklet Mekanikeri & Pist Yarışçısı" },
    keywords: ["iridyum buji motosiklet faydalari", "ngk cr9eia 9 iridyum buji fiyati", "buji degisim araligi motor", "buji tirnak araligi ayari"],
    aiSummary: "İridyum bujiler (NGK Iridium IX) 0.6 mm ince lazer kaynaklı elektrotuyla daha güçlü kıvılcım çakar, soğukta ilk marşı kolaylaştırır ve standart bujilere göre 3 kat daha uzun ömürlüdür.",
    content: `
Buji, silindir içindeki sıkıştırılmış benzin-hava karışımını tutuşturan kalptir.

- **İridyumun Avantajı:** İridyum metali 2.450°C erime noktasına sahiptir. İncecik elektrot ucu daha düşük voltajla çok daha odaklanmış ve güçlü kıvılcım üretir.
- **Değişim Periyodu:** Standart nikel bujiler 10.000 km'de bir değişirken; İridyum bujiler 30.000 - 40.000 km boyunca performansını kaybetmez.
- **Buji Rengi Okuma:** Buji ucu kahverengi ise karışım idealdir; siyah kurum varsa zengin karışım, beyaz kireçlenme varsa fakir karışım uyarısıdır.
    `.trim(),
  },
  {
    slug: "ikinci-el-motosiklet-alirken-dikkat-edilecekler",
    title: "İkinci El Motosiklet Alırken Nelere Dikkat Edilmeli? (20 Adımlı Ekspertiz Kılavuzu)",
    description: "Şasi eğriliği, amortisör keçeleri, motor bloğu sesleri, tramer sorgulama ve noter devir süreçleri.",
    tag: "Piyasa & Satın Alma",
    readMin: 7,
    date: "2026-08-27",
    year: 2026,
    author: { name: "Emre Şahin", role: "Otomotiv & Motosiklet Sektör Analisti" },
    keywords: ["ikinci el motosiklet ekspertiz rehberi 2026", "motor alirken nelere bakilir", "sasi egriligi nasil anlasilir", "tramer sorgulama plaka motor"],
    aiSummary: "İkinci el motor alırken şasi kaynak izleri, gidon boğaz bilyası boşluğu, motor bloğu yağ kaçakları, disk aşınma payı ve SBM tramer kayıtları mutlaka kontrol edilmelidir.",
    content: `
İkinci el piyasasında hayal kırıklığı yaşamamak için motorun başında uygulayabileceğiniz 5 kritik kontrol:

1. **Şasi ve Gidon Boğazı:** Gidonu tam sağ ve tam sol yaptığınızda depo ile gidon arasındaki boşluk simetrik mi? Şasi boyasında sonradan atılmış pütür veya kaynak izi var mı?
2. **Soğuk Çalıştırma:** Motorun egzoz boğazına elinizi değdirin; motor tamamen soğukken marşa basın. İlk saniyelerdeki subap veya eksantrik zinciri sesini dinleyin.
3. **Fren Diskleri ve Balatalar:** Tırnağınızı diskin üzerinde yukarıdan aşağı kaydırın; derin set ve fatura oluşmuşsa disk değişimi yakındır.
4. **Teker Rulmanları ve Jantlar:** Motor orta sehpada iken ön ve arka tekeri sallayın; boşluk varsa rulmanlar bitmiştir.
    `.trim(),
  },
  {
    slug: "motosiklet-surus-teknikleri-karsit-gidon",
    title: "Hayat Kurtaran İleri Sürüş Teknikleri: Kontra (Karşıt) Gidon ve Bakış Kuralı",
    description: "Motosikleti viraja sokmanın tek bilimsel yolu: Kontra tekniği, panik frenajda ABS kullanımı ve apexi doğru yakalama.",
    tag: "İleri Sürüş & Güvenlik",
    readMin: 6,
    date: "2026-08-28",
    year: 2026,
    author: { name: "Murat Güven", role: "İleri Sürüş Eğitmeni & Bağımsız Moto Editörü" },
    keywords: ["kontra gidon nedir nasil yapilir", "motosiklet viraj alma teknikleri", "motosiklet ileri surus egitimi", "panik fren teknigi abs"],
    aiSummary: "30 km/s hızın üzerindeki tüm iki tekerlekli araçlarda sola dönmek için sol gidon ileri itilir (kontra). Motosiklet baktığınız yere gider; virajda çıkış noktasına odaklanmak hayati kuraldır.",
    content: `
Motosiklet fiziği sezgilerimizin tam tersi prensiple çalışır.

### Kontra (Karşıt Gidon) İlkesi:
- Sola dönmek istiyorsanız, sol elciği ileriye (iterek) doğru bastırırsınız. Ön teker milisaniyelik sağa açılır ve motorun ağırlık merkezi sola devrilerek yatış açısını başlatır.
- Sağ viraj içinse sağ elciği ileri itersiniz. Gidonu asılmak veya vücudu yana sarkıtmak tek başına motoru yatırmaz!

### Bakış Kuralı (Target Fixation Tehlikesi):
- Motosiklet her zaman gözünüzün odaklandığı noktaya doğru yönelir. Virajda asfalttaki çakıla veya bariyerlere bakarsanız doğrudan oraya çarparsınız. Bakışınızı daima virajın en uzak çıkış noktasına kilitleyin.
    `.trim(),
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getAllSlugs(): string[] {
  return articles.map((a) => a.slug);
}