import { useEffect, useState } from 'react';
import { AKTIVITELER } from '../seed';
import { bugununTarihi, id, tarihiFormatla, type UygulamaVerisi } from '../store';
import AktiviteKarti from '../components/AktiviteKarti';
import TamamlamaSheet from '../components/TamamlamaSheet';

interface Props {
  veri: UygulamaVerisi;
  guncelle: (
    parca: Partial<UygulamaVerisi> | ((onceki: UygulamaVerisi) => Partial<UygulamaVerisi>),
  ) => void;
}

export default function Bugun({ veri, guncelle }: Props) {
  const bugun = bugununTarihi(veri.sahteBugunOfset);
  const [acikPlanlanmisId, setAcikPlanlanmisId] = useState<string | null>(null);
  const [kapatilanBildirimler, setKapatilanBildirimler] = useState<Set<string>>(new Set());

  useEffect(() => {
    const gecikenler = veri.planlanmisAktiviteler.filter(
      (p) => p.durum === 'bekliyor' && p.tarih < bugun,
    );
    if (gecikenler.length === 0) return;
    const gecikenIdler = new Set(gecikenler.map((p) => p.id));
    guncelle((onceki) => ({
      planlanmisAktiviteler: onceki.planlanmisAktiviteler.map((p) =>
        gecikenIdler.has(p.id) ? { ...p, durum: 'kacirildi' as const } : p,
      ),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bugun, veri.planlanmisAktiviteler]);

  const bugununListesi = veri.planlanmisAktiviteler
    .filter((p) => p.tarih === bugun)
    .sort((a, b) => a.saat.localeCompare(b.saat));

  const dun = bugununTarihi(veri.sahteBugunOfset - 1);
  const dunKacirilanlar = veri.planlanmisAktiviteler.filter(
    (p) => p.tarih === dun && p.durum === 'kacirildi' && !kapatilanBildirimler.has(p.id),
  );

  function gunKacirildiMi(tarih: string): boolean {
    const gununleri = veri.planlanmisAktiviteler.filter((p) => p.tarih === tarih);
    if (gununleri.length === 0) return false;
    const tamamlananVar = gununleri.some((p) => p.durum === 'tamamlandi');
    const kacirilanVar = gununleri.some((p) => p.durum === 'kacirildi');
    return kacirilanVar && !tamamlananVar;
  }

  const uc_gun_ustuste_kacirildi = [1, 2, 3].every((n) =>
    gunKacirildiMi(bugununTarihi(veri.sahteBugunOfset - n)),
  );

  const acikPlanlanmis = acikPlanlanmisId
    ? veri.planlanmisAktiviteler.find((p) => p.id === acikPlanlanmisId)
    : null;
  const acikAktivite = acikPlanlanmis
    ? AKTIVITELER.find((a) => a.id === acikPlanlanmis.aktiviteId)
    : null;

  function tamamlandi(haz: number, ustalik: number) {
    if (!acikPlanlanmisId) return;
    const kayit = {
      id: id(),
      planlanmisId: acikPlanlanmisId,
      tamamlanmaZamani: new Date().toISOString(),
      haz,
      ustalik,
    };
    guncelle((onceki) => ({
      planlanmisAktiviteler: onceki.planlanmisAktiviteler.map((p) =>
        p.id === acikPlanlanmisId ? { ...p, durum: 'tamamlandi' as const } : p,
      ),
      aktiviteKayitlari: [...onceki.aktiviteKayitlari, kayit],
      tamamlamaOrnekGoruldu: true,
    }));
    setAcikPlanlanmisId(null);
  }

  function dunkuAktiviteyiBugüneEkle(planlanmisId: string) {
    const kaynak = veri.planlanmisAktiviteler.find((p) => p.id === planlanmisId);
    if (!kaynak) return;
    const yeni = {
      id: id(),
      aktiviteId: kaynak.aktiviteId,
      tarih: bugun,
      saat: kaynak.saat,
      durum: 'bekliyor' as const,
    };
    guncelle((onceki) => ({
      planlanmisAktiviteler: [...onceki.planlanmisAktiviteler, yeni],
    }));
    setKapatilanBildirimler((onceki) => new Set(onceki).add(planlanmisId));
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-6 pt-6 pb-3 shrink-0">
        <p className="text-[13px] text-neutral-500 capitalize">{tarihiFormatla(bugun)}</p>
        <h1 className="text-xl font-medium text-neutral-900 mt-0.5">Bugün</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-3">
        {dunKacirilanlar.map((p) => {
          const aktivite = AKTIVITELER.find((a) => a.id === p.aktiviteId)!;
          return (
            <div
              key={p.id}
              className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 flex flex-col gap-2.5"
            >
              <p className="text-[13px] text-neutral-600 leading-snug">
                <span className="text-neutral-800">{aktivite.metin}</span> — Bugün olmadı.
                Yarına mı alalım?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => dunkuAktiviteyiBugüneEkle(p.id)}
                  className="text-[12px] px-3 py-1.5 rounded-full bg-brand-600 text-white"
                >
                  Bugüne ekle
                </button>
                <button
                  onClick={() =>
                    setKapatilanBildirimler((onceki) => new Set(onceki).add(p.id))
                  }
                  className="text-[12px] px-3 py-1.5 rounded-full text-neutral-500"
                >
                  Boşver
                </button>
              </div>
            </div>
          );
        })}

        {uc_gun_ustuste_kacirildi && (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-[13px] text-neutral-600 leading-relaxed">
              Son birkaç gündür planlar tutmadı. Olur böyle şeyler — bugün küçük
              bir şeyle başlamak ister misin?
            </p>
          </div>
        )}

        {bugununListesi.length === 0 && !uc_gun_ustuste_kacirildi && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16 gap-1.5">
            <p className="text-[14px] text-neutral-500">Bugün için planlanmış bir şey yok.</p>
            <p className="text-[13px] text-neutral-400">Bu bir boşluk değil, bir mola.</p>
          </div>
        )}

        {bugununListesi.map((p) => {
          const aktivite = AKTIVITELER.find((a) => a.id === p.aktiviteId)!;
          return (
            <AktiviteKarti
              key={p.id}
              planlanmis={p}
              aktivite={aktivite}
              onTamamla={() => setAcikPlanlanmisId(p.id)}
            />
          );
        })}
      </div>

      {acikPlanlanmis && acikAktivite && (
        <TamamlamaSheet
          aktivite={acikAktivite}
          ornekGoster={!veri.tamamlamaOrnekGoruldu}
          onTamamlandi={tamamlandi}
          onKapat={() => setAcikPlanlanmisId(null)}
        />
      )}
    </div>
  );
}
