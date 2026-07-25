import { useEffect, useState } from 'react';
import type { AlanDegerlendirmesi, GunlukDuygudurum, PlanlanmisAktivite, AktiviteKaydi } from './seed';

export interface UygulamaVerisi {
  alanDegerlendirmeleri: AlanDegerlendirmesi[];
  planlanmisAktiviteler: PlanlanmisAktivite[];
  aktiviteKayitlari: AktiviteKaydi[];
  duygudurumlar: GunlukDuygudurum[];
  onboardingTamam: boolean;
  ilkGirisGoruldu: boolean;
  zorlukKapisiAcik: boolean;
  sahteBugunOfset: number;
  /** Tamamlama sheet'indeki örnek satırlar sadece ilk kullanımda görünür. */
  tamamlamaOrnekGoruldu: boolean;
}

export const BOS_VERI: UygulamaVerisi = {
  alanDegerlendirmeleri: [],
  planlanmisAktiviteler: [],
  aktiviteKayitlari: [],
  duygudurumlar: [],
  onboardingTamam: false,
  ilkGirisGoruldu: false,
  zorlukKapisiAcik: false,
  sahteBugunOfset: 0,
  tamamlamaOrnekGoruldu: false,
};

const STORAGE_KEY = 'peacesy-veri';

export function veriYukle(): UygulamaVerisi {
  try {
    const ham = localStorage.getItem(STORAGE_KEY);
    if (!ham) return BOS_VERI;
    return { ...BOS_VERI, ...JSON.parse(ham) };
  } catch {
    return BOS_VERI;
  }
}

export function useUygulamaVerisi() {
  const [veri, setVeri] = useState<UygulamaVerisi>(veriYukle);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(veri));
  }, [veri]);

  function guncelle(
    parca: Partial<UygulamaVerisi> | ((onceki: UygulamaVerisi) => Partial<UygulamaVerisi>),
  ) {
    setVeri((onceki) => ({
      ...onceki,
      ...(typeof parca === 'function' ? parca(onceki) : parca),
    }));
  }

  function sifirla() {
    localStorage.removeItem(STORAGE_KEY);
    setVeri(BOS_VERI);
  }

  return { veri, guncelle, sifirla };
}

/** Sahte bugünün tarihini 'YYYY-MM-DD' olarak döner. */
export function bugununTarihi(ofsetGun: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + ofsetGun);
  return d.toISOString().slice(0, 10);
}

export function tarihiFormatla(tarih: string): string {
  const d = new Date(tarih + 'T00:00:00');
  return d.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function id(): string {
  return crypto.randomUUID();
}

export const GUNLER = [
  { index: 0, kisa: 'Pzt', uzun: 'Pazartesi' },
  { index: 1, kisa: 'Sal', uzun: 'Salı' },
  { index: 2, kisa: 'Çar', uzun: 'Çarşamba' },
  { index: 3, kisa: 'Per', uzun: 'Perşembe' },
  { index: 4, kisa: 'Cum', uzun: 'Cuma' },
  { index: 5, kisa: 'Cmt', uzun: 'Cumartesi' },
  { index: 6, kisa: 'Paz', uzun: 'Pazar' },
];

/** Verilen hafta gününün (0=Pzt..6=Paz) bu haftaki (ofsetGun'e göre) tarihi. */
export function haftaninGununTarihi(gunIndex: number, ofsetGun: number): string {
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  bugun.setDate(bugun.getDate() + ofsetGun);
  const bugunIso = (bugun.getDay() + 6) % 7;
  let fark = gunIndex - bugunIso;
  if (fark < 0) fark += 7;
  const hedef = new Date(bugun);
  hedef.setDate(bugun.getDate() + fark);
  return hedef.toISOString().slice(0, 10);
}
