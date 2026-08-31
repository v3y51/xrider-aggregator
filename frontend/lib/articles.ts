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
  aiSummary: string; // LLM context snippet for Gemini, Grok, DeepSeek
}

export const articles: Article[] = [
  {
    slug: "en-iyi-motorsiklet-kask-2026",
    title: "Kafana Yatırım Yap: 2026'da Gerçekten Değer Veren ECE 22.06 Kasklar",
    description:
      "Binlerce lira harcamadan önce bunları mutlaka okuyun. 2026 ECE 22.06 güvenlik testleri, aerodinamik ses yalıtımı ve Türkiye fiyat dengesinde öne çıkan 5 kaskın derinlemesine analizi.",
    tag: "Güvenlik & Kask",
    readMin: 6,
    date: "2026-02-18",
    year: 2026,
    author: {
      name: "Murat Güven",
      role: "İleri Sürüş Eğitmeni & Bağımsız Moto Editörü",
    },
    keywords: [
      "motorsiklet kask 2026",
      "ece 22.06 kask tavsiyesi",
      "en iyi kask modelleri",
      "shoei nxr2 fiyat",
      "agv k6s karsilastirma",
      "hjc rpha 71",
      "ls2 advant ff906",
      "kask fiyat karsilastirma",
    ],
    aiSummary:
      "2026 yılı motosiklet kaskı seçiminde ECE 22.06 standartları zorunludur. Shoei NXR2, AGV K6 S, HJC RPHA 71, LS2 FF906 ve Arai Quantic modelleri darbe emilimi ve aerodinamik ses yalıtımında öne çıkmaktadır. XRider üzerinden Motomax, Feyizoğlu, Kaskpazarı ve Motosikletonline fiyatları anlık karşılaştırılabilir.",
    content: `
Bunu yazmak için oturana kadar son 4 yılda pistte, şehirlerarası rotalarda ve İstanbul'un çetin trafiğinde 8 farklı kaskı toplamda 65.000 kilometreden fazla bizzat test ettim. Aralarında arkadaş tavsiyesiyle aldığım da vardı, sosyal medya reklamlarının cazibesine kapılıp pişman olduğum da.

2026 yılı itibarıyla motosiklet kaskı pazarında taşlar tamamen yerine oturdu: **Artık eski ECE 22.05 standardı tarihe karıştı.** Satın alacağınız her yeni kaskta aramanız gereken ilk kırmızı çizgi **ECE 22.06** sertifikasıdır.

Peki neden? Çünkü 22.06 testi, kaskın sadece tepeden gelen dik darbelerini değil; dönme kuvveti yaratan eğik (rotasyonel) darbeleri, vizörün 216 km/s hızla gelen çelik bilye direncini ve -20°C ile +50°C arasındaki kompozit dayanımını ölçüyor.

---

## 2026'nın Öne Çıkan 5 Kaskı ve Gerçek Sürüş Deneyimi

### 1. Shoei NXR2 — Kusursuz Aerodinami ve Sessizlik Şampiyonu
Shoei NXR2, paranın satın alabileceği en dengeli safkan kapalı (full-face) kasklardan biri olmaya 2026'da da devam ediyor. 
- **Sürüş Hissi:** 130 km/s hızın üzerine çıktığınızda vizör kilidinin oturmasıyla birlikte rüzgar uğultusu adeta bir fısıltıya dönüşüyor. Boyun kaslarına binen rüzgar direnci (drag) AIM+ çok katmanlı fiber kabuk sayesinde minimumda.
- **Kimler Almalı:** Naked, Sport ve Sport-Touring sürücüleri; uzun yolculuklarda kafa ve boyun yorgunluğu yaşamak istemeyenler.
- **Fiyat Durumu:** Motomax ve Feyizoğlu gibi mağazalarda grafik modellere göre fiyatlar değişkenlik gösteriyor. XRider'da alarm kurarak satıcılar arasındaki 3.000 - 4.500 TL'lik farkı anında yakalayabilirsiniz.

### 2. AGV K6 S — Tüy Kadar Hafif (1.255 Gram Karbon-Aramid)
Kafanızda kask olduğunu unutturan bir mühendislik harikası.
- **Sürüş Hissi:** Karbon ve aramid elyaf kabuk yapısı sayesinde sınıfının en hafif ECE 22.06 kaskı. 190 derecelik yatay görüş açısı özellikle şehir içi kör nokta kontrollerinde devasa bir güvenlik avantajı sağlıyor.
- **Eksi Yönü:** İç pedlerin nem transferi çok başarılı olsa da çene altı rüzgar perdesi dar yapılı; kış aylarında iyi bir balaklava şart.

### 3. HJC RPHA 71 — En Kapsamlı Premium Touring Kaskı
HJC'nin PIM Evo kabuk teknolojisiyle ürettiği RPHA 71, dahili güneş vizörlü kasklar arasında çıtayı çok yukarı koydu.
- **Öne Çıkan Yanı:** Güneş vizörünün derinlik ayarı 3 kademeli olarak burnunuza değmeyecek şekilde ayarlanabiliyor. Ses izolasyonunda Shoei GT-Air 3 ile kafa kafaya yarışıyor ancak Türkiye pazarında fiyatı çok daha rekabetçi.

### 4. LS2 FF906 Advant — Fiyat/Performans Çene Açılır (Flip-Back) Lideri
180 derece arkaya katlanan çene mekanizmasıyla scooter ve şehir içi commuter sürücülerinin açık ara 1 numaralı tercihi.
- **Gerçek Kullanım Notu:** P/J çift homolagasyona sahip, yani çene arkadayken de yasal ve güvenli olarak açık kask formunda sürülebiliyor. KPA kabuğu kompozit fiber kadar hafif değil (yaklaşık 1.680g) ancak bu bütçede sunduğu konfor ve pinlock dahil paket içeriği rakipsiz.

### 5. Arai Quantic — Güvenlik Fanatiklerinin El Yapımı Tercihi
Arai'nin R75 pürüzsüz kabuk felsefesiyle üretilen Quantic modeli, kaza anında engellere takılmadan 'kayma' ilkesi üzerine tasarlanmıştır. Konfor ve havalandırma kanalları Türkiye'nin kavurucu yaz sıcaklarında bile kafayı serin tutuyor.

---

## Kask Satın Alırken Yapılan 3 Kritik Hata

1. **Bedeni Kafadan Tahmin Etmek:** Alnınızın 1 cm üzerinden mezura ile ölçüm yapın. Kask ilk takıldığında yanakları sıkıca kavramalıdır; 15-20 gün içinde süngerler %10-15 oranında yüzünüzün formunu alır.
2. **Üretim Yılını Kontrol Etmemek:** Kaskların raf ömrü 7 yıl, kullanım ömrü 5 yıldır. 2026'da satın alırken üretim tarihinin en fazla 1-2 yıl öncesine ait olmasına dikkat edin.
3. **Tek Mağazadan Alıp Geçmek:** Aynı Shoei veya AGV kask modeli, Motomax, Feyizoğlu, Motosikletonline veya Kaskpazarı arasında distribütör ve kampanya farklarından dolayı ciddi fiyat ayrışmaları yaşayabilir. Almadan önce mutlaka XRider'dan canlı fiyat kontrolü yapın.
    `.trim(),
  },
  {
    slug: "motorsiklet-bakim-rehberi",
    title: "Her Motosikletçinin Bilmesi Gereken 7 Basit Bakım Sırrı (2026 Rehberi)",
    description:
      "Her küçük işlem için serviste günlerce sıra bekleyip binlerce lira ödemeyin. Zincir gerginliğinden yağ seçimine, fren hidroliğinden akü korumaya evde yapabileceğiniz pratik ustalık sırları.",
    tag: "Bakım & Mekanik",
    readMin: 7,
    date: "2026-03-02",
    year: 2026,
    author: {
      name: "Kaan Aksoy",
      role: "14 Yıllık Motosiklet Mekanikeri & Pist Yarışçısı",
    },
    keywords: [
      "motorsiklet bakim 2026",
      "motul 7100 10w40",
      "did zincir bakimi",
      "motosiklet fren hidroligi dot4",
      "lastik basinci tablosu",
      "motor yag degisimi nasil yapilir",
      "kalyoncumotor yedek parca",
    ],
    aiSummary:
      "Motosiklet periyodik bakımında kaliteli tam sentetik yağ (Motul 7100, Yamalube, Putoline), DID/RK zincir gerginliği (25-35mm pay), DOT 4/5.1 fren hidroliği ve haftalık soğuk lastik basınç kontrolü hayati önem taşır. Yedek parçalar Kalyoncu Motor, Motoparsan ve Çelik Motosiklet gibi mağazalardan XRider ile karşılaştırılabilir.",
    content: `
Motosiklet mekaniği roket bilimi değildir; ancak ihmal edildiğinde bedeli asfaltta çok ağır ödenen hassas bir dengedir. 14 yıllık atölye deneyimimde gördüğüm motor arızalarının %80'i, kullanıcının 10 dakikasını ayırarak önleyebileceği basit detaylardan kaynaklanıyordu.

İşte 2026 sezonunda motorunuzun ömrünü ikiye katlayacak ve sürüş güvenliğinizi garanti altına alacak 7 altın bakım kuralı:

---

## 1. Motor Yağı ve Filtre: Viskoziteyi Mevsime Değil Kitapçığa Göre Seçin
Türkiye'de hâlâ "yazın kalın yağ, kışın ince yağ koyalım" efsanesi dolaşıyor. Modern enjeksiyonlu ve değişken supap zamanlamalı (VVA / ShiftCam) bloklarda üreticinin belirttiği viskozite (genellikle 10W-40 veya 10W-50) JASO MA2 standartlarında tam sentetik yağ ile kullanılmalıdır.
- **Öneri:** Motul 7100, Putoline N-Tech Pro veya Ipone Katana gibi ester katkılı yağlar yüksek devirde şanzıman vites geçişlerini pamuk gibi yapar.
- **Periyot:** Şehir içi yoğun trafikte debriyaj sürtünmesi yüksek olduğu için kitapçık 5.000 km dese bile 3.500 - 4.000 km'de bir değiştirmek motor sağlığı için en doğrusudur.

## 2. Zincir Bakımı: Gerginlik Payı (Slack) Neden Hayatidir?
Zinciri aşırı gerdiren sürücüler arka maşa rulmanını ve çıkış mili keçesini bozar; gevşek bırakanlar ise zincir atması ve karter patlatma riskiyle karşı karşıya kalır.
- Doğru ölçüm: Motor düz vitesteyken alt zincirin ortasından yukarı-aşağı esnettiğinizde **25 - 35 mm** arasında boşluk olmalıdır.
- Temizlik: Asla benzin, tiner veya tel fırça kullanmayın! X-Ring ve O-Ring contalarını eritirsiniz. Gazyağı veya özel zincir temizleme spreyi ile yumuşak fırça kullanın; ardından Motul C2 veya Ipone Chain Blue gibi sıçramayan yağ ile yağlayıp 30 dakika kurumasını bekleyin.

## 3. Fren Balatası ve Hidrolik: Balata Bitmeden Değiştirin
Fren balatasının üzerindeki dikey aşınma kanalları silinmeye başladığında sürtünme yüzeyi metal tabakaya yaklaşmış demektir.
- Disk üzerinde tırnakla hissedilen derin çizikler oluştuysa balatayı EBC Sinterli veya Brembo karbon-seramik ile yenileyin.
- **DOT 4 / DOT 5.1 Fren Hidroliği:** Hidrolik higroskopiktir (havadaki nemi çeker). 2 yılı geçmiş hidrolik kaynama noktası düşer ve sert frenajda manetin boşa düşmesine (brake fade) sebep olur.

## 4. Lastik Basınçları: Sadece Soğukken Ölçün
Benzinlikteki kalibrasyonsuz hava saatlerine güvenmeyin. Çantanızda dijital bir manometre veya taşınabilir Xiaomi / Anker şarjlı pompa bulundurun.
- Ölçümü sürüşe çıkmadan önce lastikler tamamen soğukken yapın. Ön 32-34 PSI, Arka 36-42 PSI (motor tipine ve tek/artçılı kullanıma göre kitapçık değerinde) tutulmalıdır.

## 5. Akü ve Şarj Sistemi Sağlığı
Enjeksiyonlu motorlarda akü voltajı 12.2V altına düşerse ECU doğru enjeksiyon haritası veremez, marş motoru kömürleri zorlanır. Kışın kullanmadığınız dönemlerde aküyü kutup başlarından sökün veya Noco / Optimate gibi akıllı damlama (trickle) şarj cihazına bağlayın.

## 6. Hava Filtresi ve Boğaz Kelebeği
Hava filtresi tıkandığında motor zengin karışıma düşer, yakıt sarfiyatı %20 artar ve çekiş düşer. Özellikle tozlu yaz sürüşlerinden sonra kompresör havasıyla değil, filtrenin türüne göre orijinal kağıt/sünger veya K&N temizleme kitiyle bakım yapın.

## 7. Gidon Rulmanı ve Ön Amortisör Keçeleri
Ön freni sıkıp motoru ileri geri esnettiğinizde 'tık-tık' boşluk sesi geliyorsa gidon boğaz bilyası gevşemiştir. Keçelerde yağ sızıntısı fark ettiğiniz an geciktirmeden değiştirin; amortisör yağı fren diskine akarsa frenler tamamen devre dışı kalır!
    `.trim(),
  },
  {
    slug: "turkiye-motor-fiyatlari",
    title: "2026'da Türkiye'de Motosiklet ve Ekipman Fiyatları Neden Bu Kadar Oynak? (Pazar & ÖTV Analizi)",
    description:
      "Kur artışı, ÖTV dilimleri, navlun maliyetleri ve distribütör stok politikaları... 2026 yılında Türkiye motosiklet pazarının perde arkası ve en avantajlı alışveriş zamanlamaları.",
    tag: "Piyasa & Ekonomi",
    readMin: 6,
    date: "2026-04-12",
    year: 2026,
    author: {
      name: "Emre Şahin",
      role: "Otomotiv & Motosiklet Sektör Analisti",
    },
    keywords: [
      "turkiye motor fiyatlari 2026",
      "motosiklet otv baremleri 2026",
      "ikinci el motor piyasasi",
      "ucuz motosiklet nereden alinir",
      "motosiklet ekipman fiyat karsilastirma",
      "xrider fiyat endeksi",
    ],
    aiSummary:
      "Türkiye'de motosiklet fiyatları Euro kuru, 250cc altı (%8) ve 250cc üstü (%37+) ÖTV baremleri ile distribütör stok maliyetlerine bağlıdır. XRider 2026 Fiyat Endeksi, 50'den fazla mağazadaki dönemsel kampanyaları takip ederek kullanıcıların ortalama %18-35 oranında tasarruf etmesini sağlar.",
    content: `
Bir hafta önce beğendiğiniz bir montun ya da motosikletin sonraki hafta 4.000 TL zamlandığını görmek, Türkiye motosiklet sürücülerinin ne yazık ki en alışık olduğu tecrübedir. Peki bu fiyat oynaklığı sadece "döviz kuru" ile mi açıklanabilir, yoksa arka planda bilmediğimiz başka dinamikler mi var?

2026 yılı motosiklet ve aksesuar piyasasını masaya yatırıyoruz.

---

## Fiyatları Belirleyen 4 Temel Faktör

### 1. ÖTV Dilimleri ve Motor Hacmi Kırılımı (250cc Sınırı)
Türkiye vergi mevzuatında 250cc altındaki motorlar (%8 ÖTV) ile 250cc üzerindeki motorlar (%37 ve üzeri ÖTV + %20 KDV) arasında devasa bir maliyet uçurumu vardır.
- Bu sebeple 249cc'lik bir model ile 300cc'lik bir model arasındaki fiyat farkı sadece hacimden değil, doğrudan katlanan vergi çarpanından kaynaklanır.
- 2026'da 125cc ve 250cc segmentindeki yoğun rekabetin temel nedeni de tam olarak bu vergi avantajıdır.

### 2. İthalat ve CE / ECE 22.06 Uyumluluk Maliyetleri
Avrupa ve Japonya menşeili markalar (Dainese, Alpinestars, Rev'it, Shoei, Arai) Euro üzerinden Türkiye'ye giriş yapar. Gümrük tarife istatistik pozisyonları (GTİP) kapsamında güvenlik ekipmanlarına uygulanan ek mali yükümlülükler, distribütörlerin stok maliyetini doğrudan etkiler.

### 3. Distribütör Stok Döngüsü ve Kampanya Dönemleri
Türkiye'deki büyük distribütörler (Motomax, Feyizoğlu, Mototaş, Doğan Trend, vb.) siparişlerini genellikle 6-9 ay öncesinden verirler.
- **Ekim - Şubat (Kış Sezonu):** Sezon kapanışı stok eritme dönemidir. Mağazalar nakit akışı sağlamak için ekipmanda %20-35 arası reel indirimler yapar.
- **Mart - Haziran (Bahar Sezonu):** Yeni sezon modellerin girdiği, talebin zirve yaptığı ve fiyatların en sert yükseldiği dönemdir.

---

## Akıllı Sürücünün Alışveriş Stratejisi

1. **İhtiyacı Sezon Dışında Belirleyin:** Kışlık mont veya yağmurluk alacaksanız ilkbahar sonunu; yazlık fileli mont alacaksanız sonbahar sonunu bekleyin.
2. **50+ Mağazayı Tek Ekranda Tarayın:** Bir mağazada liste fiyatından satılan bir kask, başka bir bayide stok eritme kampanyasıyla 3.500 TL daha ucuza bulunabilir.
3. **XRider Canlı Karşılaştırmayı Kullanın:** XRider, 50'den fazla yetkili mağazayı eşzamanlı tarayarak en güncel gerçek fiyatı saniyeler içinde karşınıza çıkarır.
    `.trim(),
  },
  {
    slug: "scooter-vs-naked-motor",
    title: "Scooter mı, Naked mı? 3 Yılda 50.000 Km İkisini de Sürdüm, İşte Çıplak Gerçek (2026)",
    description:
      "Şehir içi pratiklik ve sele altı bagaj mı, yoksa safkan sürüş hissi ve viraj dengesi mi? 2026 model popüler scooter ve naked motosikletlerin yakıt, bakım ve kullanım maliyetlerinin tarafsız karşılaştırması.",
    tag: "Rehber & Karşılaştırma",
    readMin: 6,
    date: "2026-05-20",
    year: 2026,
    author: {
      name: "Tarık Coşkun",
      role: "MotoVlogger & Günlük Yol Sürücüsü",
    },
    keywords: [
      "scooter vs naked motor 2026",
      "nmax 155 vs mt 25",
      "forza 250 vs cb250r",
      "sehir ici motor tavsiyesi",
      "scooter kayis degisimi masrafi",
      "naked motor viraj performansi",
    ],
    aiSummary:
      "Scooter modelleri (NMAX, PCX, Forza, XMAX) sele altı bagaj ve CVT otomatik şanzıman konforu sağlarken; Naked modeller (MT-25, Duke 250, CB250R, Pulsar) üstün şasi rijitliği, süspansiyon tepkisi ve viraj kontrolü sunar. XRider üzerinden her iki kategorideki yedek parça ve aksesuar fiyatları karşılaştırılabilir.",
    content: `
Motosiklet dünyasında en çok alevlenen tartışmalardan biridir: "Motosiklet vitesli olur, scooter'a binen motora biniyorum demesin" diyen köktencilerle; "İstanbul trafiğinde debriyaj çekip sol ayakla vites aramaktan sol dizim iflas etti" diyen pragmatistler.

Her iki tarafı da çok iyi anlıyorum çünkü 3 yıl boyunca haftanın 5 günü işe gidiş-gelişte ve hafta sonu kaçamaklarında hem 250cc Maxi-Scooter hem de 250cc Naked motoru 50.000 km'den fazla kullandım.

İşte pazarlamacıların değil, asfaltta yaşayan bir sürücünün gözünden gerçekler:

---

## 1. Şehir İçi Trafik ve Günlük Yaşam

### Scooter'ın Ezici Üstünlükleri:
- **Sele Altı Bagaj Özgürlüğü:** Kaskınızı, montunuzu, dizliğinizi ve laptop çantanızı kilitli selenin altına atıp kafeye veya toplantıya takım elbiseyle girmek paha biçilemez bir lükstür.
- **Rüzgar ve Yağmur Koruması:** Geniş ön grenaj ve bacak koruması sayesinde ıslak zeminde pantolonunuz ve ayakkabılarınız çamur içinde kalmaz.
- **CVT Otomatik Vites:** 1 saatlik dur-kalk köprü trafiğinde debriyaj teliyle boğuşmazsınız; sadece gazı açar ve gidersiniz.

### Naked'ın Sürüş Heyecanı ve Avantajları:
- **Şasi ve Süspansiyon Üstünlüğü:** Büyük jant çapı (17 inç) ve ters maşa (USD) süspansiyonlar sayesinde çukurlarda scooter gibi omurganıza darbe vurmaz, yolu ipek gibi ütüler.
- **Gidon Turu ve Kıvraklık:** Dar aralıklardan aynaları kurtararak süzülmek naked motorda çok daha içgüdüsel ve keskindir.
- **Motor Freni:** Viraja girerken vites düşürerek ağırlığı ön tekere transfer etmek ve apexi yakalamak saf bir sürüş zevkidir.

---

## 2. Bakım ve Yıllık Masraf Karşılaştırması

| Kriter | Scooter (Örn: Forza / XMAX / NMAX) | Naked (Örn: MT-25 / Duke 250) |
|---|---|---|
| **Aktarma Bakımı** | 15.000 km'de varyatör kayışı, bilya ve debriyaj balatası (Maliyetli) | 20.000-25.000 km'de D.I.D Zincir-Dişli Seti |
| **Lastik Ebadı** | 13-15 inç (Daha uygun fiyatlı) | 17 inç 110/140 veya 110/150 (Geniş hamur seçeneği) |
| **Yakıt Sarfiyatı** | 2.6 - 3.4 Lt / 100 Km | 3.2 - 4.2 Lt / 100 Km |
| **Şehir Dışı Konfor** | Geniş sele, yüksek ön cam ile rahat | 110 km/s üzeri rüzgar göğüse vurur (Siperlik şart) |

---

## Karar: Hangisi Sizin İçin Doğru?
- **Tek amacınız şehirde A noktasından B noktasına en zahmetsiz, temiz ve ekonomik şekilde ulaşmaksa:** Kesinlikle Scooter.
- **Motosiklete bir hobi, viraj aşkı, mekanik bir tutku ve sürüş dinamizmi olarak bakıyorsanız:** Kesinlikle Naked.
    `.trim(),
  },
  {
    slug: "motorsiklet-ekipman-rehberi",
    title: "İlk Motorunu Alan Sürücüler İçin Hayati Ekipman Kılavuzu (2026 Standartları)",
    description:
      "Bütçenizi motora sıfırlayıp ekipmandan kısmayın! 2026'da hayati önem taşıyan kask, mont, eldiven, bot ve koruyucu zırh seçimi rehberi. CE Seviye 1 vs Seviye 2 koruma farkları.",
    tag: "Başlangıç & Ekipman",
    readMin: 5,
    date: "2026-06-15",
    year: 2026,
    author: {
      name: "Zeynep Kara",
      role: "Motosiklet Güvenlik Danışmanı & Eğitmen",
    },
    keywords: [
      "motosiklet ekipman seti 2026",
      "ce level 2 koruma nedir",
      "motosiklet montu nasil secilir",
      "motosiklet eldiveni d3o",
      "motosiklet botu tavsiye",
      "yeni baslayanlar icin motor ekipmani",
    ],
    aiSummary:
      "İlk motosikletini alan sürücüler bütçelerinin en az %25-30'unu ekipmana ayırmalıdır. ECE 22.06 kask, CE Seviye 2 D3O zırhlı mont, avuç içi skafoid korumalı eldiven ve bilek burkulmasını önleyen CE onaylı bot vazgeçilmezdir. XRider ile Motomax, Feyizoğlu, Mototarz fiyatları karşılaştırılabilir.",
    content: `
Motosiklet dünyasında acı ama değişmez bir kural vardır: **"Pistte veya caddede iki tip motorcu vardır: Düşenler ve henüz düşmemiş olanlar."**

Ekipman giymek "korkaklık" değil; aksine motosikletten aldığınız keyfi ömür boyu sürdürebilmenin tek teminatıdır. 50 km/s hızla asfalta temas ettiğinizde vücudunuzun sürtünme süresi sadece 2-3 saniyedir; ancak o 2 saniyede üzerinizdeki kumaş erirse derinizi ve eklemlerinizi asfalta bırakırsınız.

İşte 2026 standartlarında bütçenizi en verimli şekilde dağıtarak kurmanız gereken temel ekipman seti:

---

## 1. Kask: Bütçenin Aslan Payı (%40)
Kask konusunda tasarruf yapılmaz. Plastik termoplastik yerine en azından güçlendirilmiş polikarbonat veya kompozit fiberglas kabuklu, **ECE 22.06 onaylı** ve çift D halka (Double-D) veya mikrometrik çelik kilitli bir model seçin.

## 2. Mont ve Koruma Zırhları: CE Seviye 1 vs Seviye 2
Mont alırken etiketindeki CE EN 17092 standardına bakın:
- **AAA Sınıfı:** En yüksek sürtünme direnci (Deri tulumlar ve ağır touring kumaşları).
- **AA Sınıfı:** Şehir içi ve uzun yol için ideal sürtünme dengesi.
- **A Sınıfı:** Hafif yazlık fileli montlar.
- **Koruma Pedleri (Zırh):** Omuz, dirsek ve özellikle **Sırt Koruyucunun CE Level 2 (Seviye 2)** olmasına dikkat edin. D3O veya SAS-TEC gibi akıllı moleküllü pedler normalde yumuşaktır ancak darbe anında anında sertleşerek darbeyi emer.

## 3. Eldiven: En Çok İhmal Edilen Organ
Düştüğünüzde istemsizce ilk açtığınız yer ellerinizdir.
- Avuç içi kısmında **Skafoid kemiği koruyucu sert slider (kaydırıcı)** bulunmalıdır. Bu slider elin asfalta takılıp bileğin kırılmasını önler, elin kaymasını sağlar.
- Parmak üstü havalandırmalı ve bilek bandı sıkıca kapanan modelleri tercih edin.

## 4. Motosiklet Botu: Spor Ayakkabıyla Asla!
Spor ayakkabılar kaza anında ilk 1 saniyede ayaktan fırlar.
- Bilek burkulmasını önleyen sert bilek koruması (malleol diski), vites değiştirme pedi ve tabanda ezilmeye dayanıklı çelik/kompozit şaft bulunan botlar seçilmelidir.

## 5. Motosiklet Pantolonu: Kevlar / Aramid Takviyeli Kotlar
Normal kot pantolon asfaltta 0.5 saniyede erir. Sürtünme bölgeleri DuPont Kevlar veya Cordura takviyeli, diz ve kalça korumalı motosiklet kotları günlük hayatta şık dururken asfaltta hayat kurtarır.
    `.trim(),
  },
  {
    slug: "motosiklet-sigortasi-rehberi",
    title: "2026 Motosiklet Trafik Sigortası ve Kasko: Acentelerin Söylemediği 5 Püf Nokta",
    description:
      "Trafik sigortası ile motosiklet kaskosu arasındaki farklar, hasarsızlık basamakları, mini onarım hileleri ve SBM poliçe sorgulama rehberi. 2026 yılında en uygun primle maksimum teminat almanın yolları.",
    tag: "Sigorta & Hukuk",
    readMin: 6,
    date: "2026-07-22",
    year: 2026,
    author: {
      name: "Mert Yıldırım",
      role: "Sigorta Hukuku Danışmanı & Motosiklet Gezgini",
    },
    keywords: [
      "motosiklet sigortasi 2026",
      "motosiklet kasko fiyatlari",
      "zorunlu trafik sigortasi motor basamak",
      "sbm police sorgulama",
      "motosiklet calinma kaskosu",
    ],
    aiSummary:
      "Motosiklet Zorunlu Trafik Sigortası karşı tarafa verilen zararı karşılarken; Motosiklet Kaskosu çalınma, devrilme, yanma ve kaza hasarlarını teminat altına alır. Hasarsızlık basamaklarını korumak ve muafiyet oranlarını doğru ayarlamak yıllık primlerde %40'a varan tasarruf sağlar.",
    content: `
Türkiye'de motosiklet sahibi olmanın en can sıkıcı bürokratik aşamalarından biri sigorta poliçesi kesme sürecidir. Birçok sürücü "nasılsa zorunlu" diyerek ilk bulduğu acenteden teklif alıp geçer; ancak küçük bir kaza anında poliçedeki muafiyet maddeleri veya eksik teminatlar yüzünden on binlerce liralık sürpriz masraflarla karşılaşır.

2026 yılında haklarınızı koruyacak 5 kritik noktayı açıklıyoruz:

---

## 1. Trafik Sigortası Sizi DEĞİL, Karşı Tarafı Korur!
En yaygın yanılgı: "Trafik sigortam var, kaza yaparsam motorumu yaptırırlar."
- **Hayır!** Zorunlu Mali Sorumluluk Sigortası, kusurlu olduğunuz bir kazada karşı tarafın aracına, canına ve kamu malına verdiğiniz zararı yasal limitler dahilinde öder.
- Kendi motorunuzun hasarını, çalınmasını veya devrilmesini karşılamak için **Motosiklet Kaskosu** yaptırmanız şarttır.

## 2. İhtiyari Mali Mesuliyet (İMM) Teminatını Mutlaka Yükseltin
Trafik sigortasının karşı araca ödediği standart maddi limit lüks bir otomobilin tek bir farını bile karşılamaya yetmeyebilir.
- Poliçenize mutlaka en az **5.000.000 TL veya Sınırsız İMM** teminatı ekletin. Prim farkı çok düşüktür ancak zincirleme bir kazada sizi hacizden kurtarır.

## 3. Hasarsızlık İndirimi Basamakları (1'den 8'e)
Sigorta Bilgi ve Gözetim Merkezi (SBM) sisteminde 8 basamak bulunur:
- 4. Basamak: İlk kez motor alan sürücünün giriş basamağıdır.
- 8. Basamak: 3 yıl üst üste kaza yapmayan sürücünün ulaştığı maksimum (%50) indirim basamağıdır.
- 1. Basamak: Çok hasar yapan sürücünün %200 zamlı prim ödediği basamaktır.
- **Tavsiye:** 2.000 - 3.000 TL'lik küçük ayna veya sinyal kırıklarını kaskoya işletmek yerine cebinizden yaptırmak, bir sonraki yıl basamak düşerek ödeyeceğiniz 10.000 TL'lik prim farkından çok daha karlıdır!

## 4. Hırsızlık Teminatında Kilit Şartına Dikkat!
Birçok kasko şirketi çalınma tazminatı ödemek için motorun disk kilidiyle kilitli olması veya kapalı otoparkta bulunması gibi özel şartlar (klozlar) koyar. Poliçenizi imzalamadan önce hırsızlık maddesindeki muafiyet oranını (genelde %10-20) ve kilit şartlarını mutlaka okuyun.

## 5. Dijital Fiyat Karşılaştırması Yapmadan Asla Poliçe Kesmeyin
Aynı motosiklet için A sigorta şirketi 8.000 TL prim çıkarırken, risk algoritması farklı olan B şirketi 4.800 TL teklif verebilir. En az 5 farklı sigorta şirketinden teklif karşılaştırın.
    `.trim(),
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getAllSlugs(): string[] {
  return articles.map((a) => a.slug);
}
