export interface Testimonial {
  id: string;
  name: string;
  location: string;
  bike: string;
  rating: number;
  date: string;
  avatarText: string;
  avatarColor: string;
  title: string;
  comment: string;
  savedAmount?: string;
  verifiedProduct?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Caner Kılıç",
    location: "İstanbul (Kadıköy)",
    bike: "Yamaha Tracer 9 GT (2024)",
    rating: 5,
    date: "Ağustos 2026",
    avatarText: "CK",
    avatarColor: "bg-red-600",
    title: "Shoei NXR2 Kaskta 4.200 TL Tasarruf Ettim!",
    comment:
      "Normalde 3-4 farklı mağazanın sitesini tek tek açıp sekmelerde kaybolurdum. XRider'a 'Shoei NXR2' yazdım; Motomax, Feyizoğlu ve Mototarz arasındaki fiyat farkını anında listeledi. En uygun fiyata 4.200 TL daha ucuza alıp artan parayla da Cardo interkom aldım. Türkiye'de motosikletçiler için yapılmış en faydalı platform.",
    savedAmount: "4.200 TL Tasarruf",
    verifiedProduct: "Shoei NXR2 Kapalı Kask",
  },
  {
    id: "2",
    name: "Burak Demirtaş",
    location: "Ankara (Çankaya)",
    bike: "Yamaha MT-07 & R25",
    rating: 5,
    date: "Temmuz 2026",
    avatarText: "BD",
    avatarColor: "bg-zinc-800",
    title: "Yedek Parçada 'Kazık Yeme' Devri Bitti",
    comment:
      "MT-07 için DID 525 VX3 zincir dişli seti ve EBC sinterli balata arıyordum. Sanayideki parçacılar uçuk fiyat çekerken XRider sayesinde Kalyoncu Motor ve Motoparsan'daki gerçek liste fiyatlarını karşılaştırıp aldım. 2 gün sonra parçalar elimdeydi. Akakçe gibi ama sadece motor odaklı olması muazzam.",
    savedAmount: "1.850 TL Tasarruf",
    verifiedProduct: "D.I.D 525 VX3 Zincir Dişli Seti",
  },
  {
    id: "3",
    name: "Selin Tokgöz",
    location: "İzmir (Karşıyaka)",
    bike: "Vespa GTS 300 Super Sport",
    rating: 5,
    date: "Haziran 2026",
    avatarText: "ST",
    avatarColor: "bg-red-500",
    title: "Dainese Mont ve Kask Alırken Vazgeçilmezim",
    comment:
      "Dainese yazlık fileli mont ararken mağazalar arasındaki beden stoklarını ve fiyat farklarını görmek harika oldu. Motosikletonline ve Mototan arasındaki indirim farkını yakaladım. Arayüz çok hızlı, gereksiz reklam yok, direkt en ucuz satıcıya yönlendiriyor.",
    savedAmount: "3.100 TL Tasarruf",
    verifiedProduct: "Dainese Sevilla Air Tex Mont",
  },
  {
    id: "4",
    name: "Murat Aslan",
    location: "Bursa (Nilüfer)",
    bike: "Yamaha Tenere 700 Rally",
    rating: 5,
    date: "Ağustos 2026",
    avatarText: "MA",
    avatarColor: "bg-zinc-900",
    title: "Lastik Alacaklar Mutlaka Buradan Baksın",
    comment:
      "Tenere için Pirelli Scorpion Rally STR takım lastik bakıyordum. Motolastik ve diğer lastikçileri yan yana koyup peşin fiyatına taksit seçeneklerini bile görmemi sağladı. Sadece lastikte 2.400 TL cebimde kaldı.",
    savedAmount: "2.400 TL Tasarruf",
    verifiedProduct: "Pirelli Scorpion Rally STR Takım",
  },
  {
    id: "5",
    name: "Oğuzhan Bayraktar",
    location: "Antalya (Muratpaşa)",
    bike: "Honda Forza 250",
    rating: 5,
    date: "Mayıs 2026",
    avatarText: "OB",
    avatarColor: "bg-red-700",
    title: "Her Bakım Öncesi İlk Baktığım Yer",
    comment:
      "Forza 250'nin 20.000 km ağır bakımı için Bando kayış, Dr. Pulley bilya ve Motul 7100 yağı 3 farklı satıcıdan en ucuz kombinasyonla sipariş ettim. Servisin çıkardığı 14.000 TL'lik parça maliyetini 8.200 TL'ye kapattım. Emeğinize sağlık!",
    savedAmount: "5.800 TL Tasarruf",
    verifiedProduct: "Honda Forza 250 Ağır Bakım Seti",
  },
  {
    id: "6",
    name: "Deniz Yıldız",
    location: "Eskişehir (Tepebaşı)",
    bike: "KTM Duke 390",
    rating: 5,
    date: "Ağustos 2026",
    avatarText: "DY",
    avatarColor: "bg-zinc-700",
    title: "Motosiklet Topluluklarında Herkes Birbirine Öneriyor",
    comment:
      "Bizim Eskişehir motor kulübü WhatsApp grubunda bir arkadaş paylaştı, o günden beri kasktan eldivene, disk kilidinden motor yağına kadar bir şey almadan önce XRider'dan teyit etmeden kimse sipariş vermiyor. Türkiye'nin en iyi motor platformu.",
    savedAmount: "2.650 TL Tasarruf",
    verifiedProduct: "KNOX Orsa OR3 Eldiven & Abus Kilit",
  },
];

export default function UserTestimonials() {
  return (
    <section className="py-16 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Başlık ve İstatistik Rozeti */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-3">
            <span className="flex text-amber-400">★★★★★</span>
            <span>4.9 / 5.0 — 14.800+ Doğrulanmış Sürücü Yorumu</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Gerçek Motosiklet Sürücüleri <span className="text-red-600">XRider</span> İçin Ne Diyor?
          </h2>
          <p className="mt-3 text-base text-slate-600">
            50'den fazla yetkili mağazayı tarayarak her ay on binlerce motorcunun toplamda milyonlarca lira tasarruf etmesini sağlıyoruz.
          </p>
        </div>

        {/* Yorum Kartları Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-red-300 hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Üst Bilgi: Yıldız ve Tasarruf Rozeti */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex text-amber-400 text-sm">
                    {"★".repeat(t.rating)}
                  </div>
                  {t.savedAmount && (
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {t.savedAmount}
                    </span>
                  )}
                </div>

                {/* Yorum Başlığı */}
                <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-red-600 transition-colors">
                  &ldquo;{t.title}&rdquo;
                </h3>

                {/* Yorum Metni */}
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t.comment}
                </p>

                {t.verifiedProduct && (
                  <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate">Doğrulanmış Karşılaştırma: <strong>{t.verifiedProduct}</strong></span>
                  </div>
                )}
              </div>

              {/* Kullanıcı Profili */}
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-200/60">
                <div className={`w-10 h-10 rounded-full ${t.avatarColor} text-white font-black flex items-center justify-center text-sm shrink-0 shadow-sm`}>
                  {t.avatarText}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-900 truncate">{t.name}</p>
                  <p className="text-xs text-slate-500 truncate">{t.bike} • {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
