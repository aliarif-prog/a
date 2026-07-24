import { useState } from 'react';
import { AKTIVITELER } from '../seed';
import { GUNLER, haftaninGununTarihi, id, type UygulamaVerisi } from '../store';

interface Girdi {
  girdiId: string;
  aktiviteId: string;
  gunIndex: number | null;
  saat: string;
  ifThen: string;
}

interface Props {
  veri: UygulamaVerisi;
  guncelle: (parca: Partial<UygulamaVerisi>) => void;
  ilkAktiviteId: string | null;
  onTamam: () => void;
}

const MAKS_AKTIVITE = 5;

export default function HaftalikPlanlama({ veri, guncelle, ilkAktiviteId, onTamam }: Props) {
  const [girdiler, setGirdiler] = useState<Girdi[]>(() =>
    ilkAktiviteId
      ? [{ girdiId: id(), aktiviteId: ilkAktiviteId, gunIndex: null, saat: '', ifThen: '' }]
      : [],
  );
  const [secimAcik, setSecimAcik] = useState(false);

  const eklenenIdler = new Set(girdiler.map((g) => g.aktiviteId));
  const eklenebilecekler = AKTIVITELER.filter((a) => !eklenenIdler.has(a.id));
  const hepsiDolu =
    girdiler.length > 0 && girdiler.every((g) => g.gunIndex !== null && g.saat !== '');

  function girdiGuncelle(girdiId: string, parca: Partial<Girdi>) {
    setGirdiler((onceki) => onceki.map((g) => (g.girdiId === girdiId ? { ...g, ...parca } : g)));
  }

  function girdiSil(girdiId: string) {
    setGirdiler((onceki) => onceki.filter((g) => g.girdiId !== girdiId));
  }

  function aktiviteEkle(aktiviteId: string) {
    setGirdiler((onceki) => [
      ...onceki,
      { girdiId: id(), aktiviteId, gunIndex: null, saat: '', ifThen: '' },
    ]);
    setSecimAcik(false);
  }

  function planiBitir() {
    const yeniPlanlar = girdiler.map((g) => ({
      id: id(),
      aktiviteId: g.aktiviteId,
      tarih: haftaninGununTarihi(g.gunIndex!, veri.sahteBugunOfset),
      saat: g.saat,
      ifThen: g.ifThen.trim() ? g.ifThen.trim() : undefined,
      durum: 'bekliyor' as const,
    }));
    guncelle({
      planlanmisAktiviteler: [...veri.planlanmisAktiviteler, ...yeniPlanlar],
      onboardingTamam: true,
      ilkGirisGoruldu: true,
    });
    onTamam();
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-6 pt-6 pb-3 shrink-0">
        <h1 className="text-xl font-medium text-neutral-900">Haftaya yerleştir</h1>
        <p className="text-[13px] text-neutral-500 mt-1">
          Gün ve saat seçmen gerekiyor; olmadan plan kaydolmuyor. Haftada en
          fazla {MAKS_AKTIVITE} aktivite ekleyebilirsin.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-3">
        {girdiler.map((g) => {
          const aktivite = AKTIVITELER.find((a) => a.id === g.aktiviteId)!;
          return (
            <div
              key={g.girdiId}
              className="rounded-2xl border border-neutral-200 bg-white p-4 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[14px] text-neutral-900 leading-snug">{aktivite.metin}</p>
                <button
                  onClick={() => girdiSil(g.girdiId)}
                  aria-label="Kaldır"
                  className="text-neutral-400 text-[13px] shrink-0 px-1"
                >
                  Kaldır
                </button>
              </div>

              <div>
                <p className="text-[12px] text-neutral-500 mb-1.5">Hangi gün?</p>
                <div className="flex flex-wrap gap-1.5">
                  {GUNLER.map((gun) => (
                    <button
                      key={gun.index}
                      onClick={() => girdiGuncelle(g.girdiId, { gunIndex: gun.index })}
                      className={`text-[12px] px-2.5 py-1.5 rounded-full border transition-colors ${
                        g.gunIndex === gun.index
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-neutral-200 text-neutral-600'
                      }`}
                    >
                      {gun.kisa}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-[12px] text-neutral-500 mb-1.5 block">Saat</span>
                <input
                  type="time"
                  value={g.saat}
                  onChange={(e) => girdiGuncelle(g.girdiId, { saat: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-[14px] text-neutral-900"
                />
              </label>

              <label className="block">
                <span className="text-[12px] text-neutral-500 mb-1.5 block">
                  Ne zaman yapacaksın? (opsiyonel)
                </span>
                <input
                  type="text"
                  placeholder="Akşam yemeğinden sonra..."
                  value={g.ifThen}
                  onChange={(e) => girdiGuncelle(g.girdiId, { ifThen: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-[14px] text-neutral-900 placeholder:text-neutral-400"
                />
              </label>
            </div>
          );
        })}

        {girdiler.length < MAKS_AKTIVITE && (
          <div>
            {!secimAcik ? (
              <button
                onClick={() => setSecimAcik(true)}
                className="w-full rounded-2xl border border-dashed border-neutral-300 text-neutral-500 py-3 text-[14px]"
              >
                Haftaya ekle
              </button>
            ) : (
              <div className="rounded-2xl border border-neutral-200 bg-white p-3 flex flex-col gap-1.5">
                {eklenebilecekler.slice(0, 8).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => aktiviteEkle(a.id)}
                    className="text-left text-[13px] text-neutral-800 px-2 py-2 rounded-lg hover:bg-neutral-50"
                  >
                    {a.metin}
                  </button>
                ))}
                <button
                  onClick={() => setSecimAcik(false)}
                  className="text-left text-[13px] text-neutral-400 px-2 py-2"
                >
                  Vazgeç
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-neutral-200 shrink-0">
        <button
          onClick={planiBitir}
          disabled={!hepsiDolu}
          className="w-full rounded-2xl bg-brand-600 text-white py-4 text-[15px] font-medium active:bg-brand-700 transition-colors disabled:bg-neutral-300 disabled:text-neutral-500"
        >
          Planı kaydet
        </button>
      </div>
    </div>
  );
}
