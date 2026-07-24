import { useState } from 'react';
import { YASAM_ALANLARI, type AlanDegerlendirmesi } from '../seed';
import type { UygulamaVerisi } from '../store';
import Kaydirici from '../components/Kaydirici';

interface Props {
  veri: UygulamaVerisi;
  guncelle: (parca: Partial<UygulamaVerisi>) => void;
  onDevam: () => void;
}

function ilkDegerler(mevcut: AlanDegerlendirmesi[]): AlanDegerlendirmesi[] {
  return YASAM_ALANLARI.map((alan) => {
    const varolan = mevcut.find((d) => d.alanId === alan.id);
    return varolan ?? { alanId: alan.id, onem: 5, vakit: 5 };
  });
}

export default function DegerHaritasi({ veri, guncelle, onDevam }: Props) {
  const [degerlendirmeler, setDegerlendirmeler] = useState<AlanDegerlendirmesi[]>(() =>
    ilkDegerler(veri.alanDegerlendirmeleri),
  );

  function degeriGuncelle(alanId: string, alan: 'onem' | 'vakit', deger: number) {
    setDegerlendirmeler((onceki) =>
      onceki.map((d) => (d.alanId === alanId ? { ...d, [alan]: deger } : d)),
    );
  }

  function devamEt() {
    guncelle({ alanDegerlendirmeleri: degerlendirmeler });
    onDevam();
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-6 pt-6 pb-3 shrink-0">
        <h1 className="text-xl font-medium text-neutral-900">Senin için neler önemli?</h1>
        <p className="text-[13px] text-neutral-500 mt-1">
          Her alan için iki soru var. İstersen kaydırıcıları hiç oynatmadan da
          devam edebilirsin.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-3">
        {YASAM_ALANLARI.map((alan) => {
          const d = degerlendirmeler.find((x) => x.alanId === alan.id)!;
          return (
            <div
              key={alan.id}
              className="rounded-2xl border border-neutral-200 bg-white p-4 flex flex-col gap-4"
            >
              <div>
                <h2 className="text-[15px] font-medium text-neutral-900">{alan.ad}</h2>
                <p className="text-[13px] text-neutral-500 mt-0.5 leading-snug">
                  {alan.aciklama}
                </p>
              </div>
              <Kaydirici
                soru={alan.onemSorusu}
                deger={d.onem}
                onDegisim={(v) => degeriGuncelle(alan.id, 'onem', v)}
              />
              <Kaydirici
                soru={alan.vakitSorusu}
                deger={d.vakit}
                onDegisim={(v) => degeriGuncelle(alan.id, 'vakit', v)}
              />
            </div>
          );
        })}
      </div>

      <div className="px-6 py-4 border-t border-neutral-200 shrink-0">
        <button
          onClick={devamEt}
          className="w-full rounded-2xl bg-brand-600 text-white py-4 text-[15px] font-medium active:bg-brand-700 transition-colors"
        >
          Devam et
        </button>
      </div>
    </div>
  );
}
