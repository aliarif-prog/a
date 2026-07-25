/**
 * Peacesy prototip — veri şeması ve seed verisi
 *
 * Bu dosya ATILACAK bir prototipin parçasıdır. Burada hiçbir iş mantığı yoktur
 * ve olmamalıdır: puanlama, öneri algoritması, zorluk kapısı hesabı yok.
 * Ekranların test edilebilir olması için gereken minimum veri var, o kadar.
 *
 * MVP'de bu dosyanın hiçbir satırı kullanılmayacak.
 */

// ─────────────────────────────────────────────────────────────
// 1. Temel tipler
// ─────────────────────────────────────────────────────────────

export type Zorluk = 'kolay' | 'orta' | 'zor';

/**
 * Sosyal yük — daha önce "başka insan gerekir: evet/hayır" olarak
 * tasarlanmıştı, üçe böldüm. Gerekçe: "arkadaşına mesaj at" ile
 * "arkadaşınla buluş" arasındaki fark, depresif ataktaki biri için
 * ikili bir bayrağın taşıyabileceğinden çok daha büyük.
 */
export type SosyalYuk = 'yok' | 'asenkron' | 'senkron';

export type AlanId =
  | 'iliskiler'
  | 'arkadaslik'
  | 'is-egitim'
  | 'saglik-beden'
  | 'keyif-dinlenme'
  | 'gelisim-anlam';

// ─────────────────────────────────────────────────────────────
// 2. Yaşam alanları — değer haritası onboarding'i
// ─────────────────────────────────────────────────────────────

export interface YasamAlani {
  id: AlanId;
  ad: string;
  /** Onboarding'de alan adının altında görünen tek cümle. */
  aciklama: string;
  onemSorusu: string;
  vakitSorusu: string;
}

export const YASAM_ALANLARI: YasamAlani[] = [
  {
    id: 'iliskiler',
    ad: 'İlişkiler ve aile',
    aciklama: 'Sana en yakın insanlar: partner, aile, birlikte yaşadıkların.',
    onemSorusu: 'Bu alan senin için ne kadar önemli?',
    vakitSorusu: 'Şu sıralar bu alana ne kadar vakit ayırabiliyorsun?',
  },
  {
    id: 'arkadaslik',
    ad: 'Arkadaşlık ve sosyal hayat',
    aciklama: 'Arkadaşların, çevren, seçerek birlikte olduğun insanlar.',
    onemSorusu: 'Bu alan senin için ne kadar önemli?',
    vakitSorusu: 'Şu sıralar bu alana ne kadar vakit ayırabiliyorsun?',
  },
  {
    id: 'is-egitim',
    ad: 'İş ve eğitim',
    aciklama: 'Mesleğin, okulun, üretmek için harcadığın zaman.',
    onemSorusu: 'Bu alan senin için ne kadar önemli?',
    vakitSorusu: 'Şu sıralar bu alana ne kadar vakit ayırabiliyorsun?',
  },
  {
    id: 'saglik-beden',
    ad: 'Sağlık ve beden',
    aciklama: 'Hareket, uyku, beslenme, bedeninle kurduğun ilişki.',
    onemSorusu: 'Bu alan senin için ne kadar önemli?',
    vakitSorusu: 'Şu sıralar bu alana ne kadar vakit ayırabiliyorsun?',
  },
  {
    id: 'keyif-dinlenme',
    ad: 'Keyif ve dinlenme',
    aciklama: 'Sırf sevdiğin için yaptığın şeyler. Bir amaca hizmet etmesi gerekmiyor.',
    onemSorusu: 'Bu alan senin için ne kadar önemli?',
    vakitSorusu: 'Şu sıralar bu alana ne kadar vakit ayırabiliyorsun?',
  },
  {
    id: 'gelisim-anlam',
    ad: 'Kişisel gelişim ve anlam',
    aciklama: 'Öğrenmek, inandığın bir şeye katkı vermek, kendini geliştirmek.',
    onemSorusu: 'Bu alan senin için ne kadar önemli?',
    vakitSorusu: 'Şu sıralar bu alana ne kadar vakit ayırabiliyorsun?',
  },
];

/** Kullanıcının onboarding'de verdiği 0-10 puanlar. */
export interface AlanDegerlendirmesi {
  alanId: AlanId;
  onem: number; // 0-10
  vakit: number; // 0-10
  // NOT: önem-vakit farkı MVP'de öneri ağırlığı olacak.
  // Prototipte hesaplanmıyor — aktivite sırası aşağıda elle dizili.
}

// ─────────────────────────────────────────────────────────────
// 3. Aktivite bankası
// ─────────────────────────────────────────────────────────────

export interface Aktivite {
  id: string;
  alanId: AlanId;
  /** Kullanıcının gördüğü metin. İkinci tekil şahıs, emir kipi. */
  metin: string;
  zorluk: Zorluk;
  /** Tahmini süre, dakika. Kullanıcıya gösterilir. */
  dakika: number;
  disariCikmaGerekir: boolean;
  sosyalYuk: SosyalYuk;
  /**
   * Klinik gözden geçirme notu. UI'da ASLA görünmez.
   * Zorluk ataması neden böyle yapıldı, hangi tuzak var — buraya yazılır.
   * Boş bırakılan her aktivite gözden geçirilmemiş sayılır.
   */
  klinikNot?: string;
}

/**
 * ÖRNEK SET — 13 aktivite. Hedef 60 (alan başına 10: 4 kolay, 4 orta, 2 zor).
 * Aşağıdakiler format belirlemek için yazıldı; kalanı bu desende üretilecek
 * ve tek tek klinik gözden geçirmeden geçecek.
 */
export const AKTIVITELER: Aktivite[] = [
  // ── İlişkiler ve aile ──
  {
    id: 'ili-01',
    alanId: 'iliskiler',
    metin: "Ailenden birine 'aklıma geldin' diye mesaj at",
    zorluk: 'kolay',
    dakika: 2,
    disariCikmaGerekir: false,
    sosyalYuk: 'asenkron',
    klinikNot:
      'Cevap gelmese bile tamamlanmış sayılır. Bunu UI metninde netleştir; ' +
      'yoksa kullanıcı karşıdan yanıt gelmedi diye kendini başarısız sayar.',
  },
  {
    id: 'ili-02',
    alanId: 'iliskiler',
    metin: 'Bir aile üyeni ara ve 10 dakika konuş',
    zorluk: 'orta',
    dakika: 10,
    disariCikmaGerekir: false,
    sosyalYuk: 'senkron',
    klinikNot: 'Senkron ama evden. Yüz yüzeye geçiş için ara basamak.',
  },
  {
    id: 'ili-03',
    alanId: 'iliskiler',
    metin: 'Bir aile üyenle yüz yüze buluş',
    zorluk: 'zor',
    dakika: 90,
    disariCikmaGerekir: true,
    sosyalYuk: 'senkron',
    klinikNot: 'Dışarı + senkron: iki bariyer birden. İlk 2 haftada önerilmemeli.',
  },

  // ── Arkadaşlık ve sosyal hayat ──
  {
    id: 'ark-01',
    alanId: 'arkadaslik',
    metin: 'Bir arkadaşına sesli mesaj gönder',
    zorluk: 'kolay',
    dakika: 3,
    disariCikmaGerekir: false,
    sosyalYuk: 'asenkron',
    klinikNot:
      'Yazılı mesajdan biraz daha zor (ses tonu maruziyeti) ama randevu ' +
      'gerektirmiyor. Sosyal kaygı eşlik ediyorsa yazılıyla başlat.',
  },
  {
    id: 'ark-02',
    alanId: 'arkadaslik',
    metin: 'Uzun süredir görüşmediğin birine ne yaptığını sor',
    zorluk: 'orta',
    dakika: 5,
    disariCikmaGerekir: false,
    sosyalYuk: 'asenkron',
    klinikNot: 'Süre kısa ama eşik yüksek: temas kurma kararının kendisi zor kısım.',
  },
  {
    id: 'ark-03',
    alanId: 'arkadaslik',
    metin: 'Bir arkadaşınla kahve içmek için buluş',
    zorluk: 'zor',
    dakika: 60,
    disariCikmaGerekir: true,
    sosyalYuk: 'senkron',
    klinikNot: 'Dışarı + senkron + planlama. Bankadaki en zor üç aktiviteden biri.',
  },

  // ── İş ve eğitim ──
  {
    id: 'ise-01',
    alanId: 'is-egitim',
    metin: 'Ertelediğin işlerden birini bir kâğıda yaz. Sadece yaz.',
    zorluk: 'kolay',
    dakika: 5,
    disariCikmaGerekir: false,
    sosyalYuk: 'yok',
    klinikNot:
      'Ustalık yüksek / haz düşük tarafın temiz örneği. Onboarding’de ' +
      'ustalık sorusunun örneği olarak kullanılabilir.',
  },
  {
    id: 'ise-02',
    alanId: 'is-egitim',
    metin: 'Ertelediğin bir faturayı öde ya da bir formu doldur',
    zorluk: 'orta',
    dakika: 15,
    disariCikmaGerekir: false,
    sosyalYuk: 'yok',
  },

  // ── Sağlık ve beden ──
  {
    id: 'sag-01',
    alanId: 'saglik-beden',
    metin: 'Bir bardak su iç ve 5 dakika esne',
    zorluk: 'kolay',
    dakika: 5,
    disariCikmaGerekir: false,
    sosyalYuk: 'yok',
    klinikNot:
      'Bankadaki en düşük eşikli aktivite. Yataktan çıkamayan biri için ' +
      'giriş noktası. Silme.',
  },
  {
    id: 'sag-02',
    alanId: 'saglik-beden',
    metin: '15 dakika tempolu yürü',
    zorluk: 'orta',
    dakika: 15,
    disariCikmaGerekir: true,
    sosyalYuk: 'yok',
    klinikNot: 'Kanıt tabanı en güçlü aktivite; öneri sırasında öne alınmalı.',
  },

  // ── Keyif ve dinlenme ──
  {
    id: 'key-01',
    alanId: 'keyif-dinlenme',
    metin: 'Sevdiğin bir albümü baştan sona dinle',
    zorluk: 'kolay',
    dakika: 40,
    disariCikmaGerekir: false,
    sosyalYuk: 'yok',
    klinikNot:
      'Haz yüksek / ustalık düşük tarafın temiz örneği. Onboarding’de haz ' +
      'sorusunun örneği olarak kullanılabilir. ise-01 ile çift oluşturur.',
  },
  {
    id: 'key-02',
    alanId: 'keyif-dinlenme',
    metin: 'Mahallende 20 dakika, hiçbir yere varmadan yürü',
    zorluk: 'orta',
    dakika: 20,
    disariCikmaGerekir: true,
    sosyalYuk: 'yok',
    klinikNot: '"Hiçbir yere varmadan" kasıtlı: verimlilik baskısını kaldırıyor.',
  },

  // ── Kişisel gelişim ve anlam ──
  {
    id: 'gel-01',
    alanId: 'gelisim-anlam',
    metin: 'İlgini çeken bir konuda 10 dakika bir şey oku',
    zorluk: 'kolay',
    dakika: 10,
    disariCikmaGerekir: false,
    sosyalYuk: 'yok',
  },
];

// ─────────────────────────────────────────────────────────────
// 4. Planlama ve kayıt
// ─────────────────────────────────────────────────────────────

export interface PlanlanmisAktivite {
  id: string;
  aktiviteId: string;
  tarih: string; // 'YYYY-MM-DD'
  saat: string; // 'HH:mm' — ZORUNLU, uygulama saatsiz plan kabul etmez
  /** Opsiyonel if-then planı: "Akşam yemeğinden sonra ..." */
  ifThen?: string;
  durum: 'bekliyor' | 'tamamlandi' | 'kacirildi' | 'ertelendi';
}

export interface AktiviteKaydi {
  id: string;
  planlanmisId: string;
  tamamlanmaZamani: string; // ISO
  haz: number; // 0-10
  ustalik: number; // 0-10
  // NOT alanı BİLEREK YOK. Tamamlama akışı 3 saniyede kapanacak;
  // serbest metin alanı o hedefi imkânsız kılar.
}

/** Haftalık yansımadaki korelasyon grafiği için. */
export interface GunlukDuygudurum {
  tarih: string; // 'YYYY-MM-DD'
  puan: number; // 0-10
}

// ─────────────────────────────────────────────────────────────
// 5. Ölçekler — GÖSTERİLİYOR, PUANLANMIYOR
// ─────────────────────────────────────────────────────────────

export interface OlcekCevabi {
  olcek: 'PHQ-9' | 'GAD-7' | 'WHO-5';
  tarih: string;
  cevaplar: number[];
  // Toplam puan HESAPLANMIYOR. Prototipte ölçek ekranlarının işi
  // sadece "onboarding kaç dakika sürüyor" sorusuna katkı vermek.
}

// ─────────────────────────────────────────────────────────────
// 6. Klinisyen paneli — sahte danışanlar
// ─────────────────────────────────────────────────────────────

/**
 * Bu 5 danışan rastgele değil. Her biri panelin cevaplaması gereken
 * bir soruyu test ediyor. Test sorusu: klinisyen 5 danışanı 5 dakikada
 * tarayıp "kimle konuşmam gerek"i doğru seçebiliyor mu?
 *
 * Doğru cevap: 2 numara (anhedoni) ve 3 numara (düşüş).
 * Klinisyen bunları seçemiyorsa panel tasarımı başarısız.
 */
export interface SahteDanisan {
  id: string;
  /** Takma ad. Prototipte gerçek isim YOK. */
  takmaAd: string;
  baslangicTarihi: string;
  /** Son 14 gün, 0-1 arası. */
  tamamlanmaOrani: number;
  trend: 'yukselen' | 'sabit' | 'dusen';
  /** Haz sürekli düşük, ustalık normal → klinik dikkat gerektirir. */
  anhedoniBayragi: boolean;
  /** Panelde okunabilirliği test etmek için ~14 günlük kayıt. */
  kayitlar: AktiviteKaydi[];
  duygudurum: GunlukDuygudurum[];
  /** Sadece seed üretimine yön vermek için; UI'da görünmez. */
  senaryoNotu: string;
}

export const SAHTE_DANISANLAR: Pick<
  SahteDanisan,
  'id' | 'takmaAd' | 'tamamlanmaOrani' | 'trend' | 'anhedoniBayragi' | 'senaryoNotu'
>[] = [
  {
    id: 'd1',
    takmaAd: 'Danışan A',
    tamamlanmaOrani: 0.86,
    trend: 'yukselen',
    anhedoniBayragi: false,
    senaryoNotu:
      'İyi giden vaka. Haz ve ustalık birlikte yükseliyor. ' +
      'Kontrol grubu: panel bunu "sorun yok" diye okutabilmeli.',
  },
  {
    id: 'd2',
    takmaAd: 'Danışan B',
    tamamlanmaOrani: 0.79,
    trend: 'sabit',
    anhedoniBayragi: true,
    senaryoNotu:
      'KRİTİK VAKA. Aktiviteleri düzenli tamamlıyor (ustalık 6-8) ama haz ' +
      'hiç 3’ü geçmiyor. Tamamlanma oranına bakan bir panel bunu KAÇIRIR. ' +
      'Panelin tüm varlık sebebi bu vakayı görünür kılmak.',
  },
  {
    id: 'd3',
    takmaAd: 'Danışan C',
    tamamlanmaOrani: 0.31,
    trend: 'dusen',
    anhedoniBayragi: false,
    senaryoNotu:
      'İlk hafta %80, ikinci hafta %10. Ortalama %31 gösteriyor — ortalama ' +
      'düşüşü gizliyor. Panelde trend, orandan daha görünür olmalı.',
  },
  {
    id: 'd4',
    takmaAd: 'Danışan D',
    tamamlanmaOrani: 0.6,
    trend: 'sabit',
    anhedoniBayragi: false,
    senaryoNotu:
      'Yeni başlamış, sadece 4 günlük veri. Boş grafik durumunu test eder. ' +
      '%60 oranı yanıltıcı: 5 aktivitenin 3’ü. Panel n sayısını göstermeli.',
  },
  {
    id: 'd5',
    takmaAd: 'Danışan E',
    tamamlanmaOrani: 0.54,
    trend: 'sabit',
    anhedoniBayragi: false,
    senaryoNotu:
      'Dalgalı: iyi gün / kötü gün. Gürültü vakası. Klinisyen bunu ' +
      '"acil değil" diye eleyebilmeli, yoksa panel her şeyi alarma çeviriyor.',
  },
];

// ─────────────────────────────────────────────────────────────
// 7. Prototip kontrol paneli (gizli)
// ─────────────────────────────────────────────────────────────

/**
 * Test oturumlarını yönetmek için. Uygulamada gizli bir alandan açılır
 * (örn. logoya 5 kez dokunma). MVP'de yok.
 */
export interface PrototipDurumu {
  /** Zorluk kapısı mantığı YAZILMAYACAK. Bu bayrak elle tetiklenir. */
  zorlukKapisiAcik: boolean;
  /** "Bugün"ü ileri sarmak için — haftalık yansımayı göstermenin tek yolu. */
  sahteBugun: string; // 'YYYY-MM-DD'
  /** Oturumlar arası tek dokunuşla temiz başlangıç. Bunu unutma. */
  sifirla: () => void;
}
