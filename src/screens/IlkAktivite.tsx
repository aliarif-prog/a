import { useState } from 'react';
import { AKTIVITELER } from '../seed';

interface Props {
  ilkSecili: string | null;
  onDevam: (aktiviteId: string) => void;
  onGeri: () => void;
}

const ONERILEN = AKTIVITELER.slice(0, 3);

const ZORLUK_ETIKETI: Record<string, string> = {
  kolay: 'Kolay',
  orta: 'Orta',
  zor: 'Zor',
};

export default function IlkAktivite({ ilkSecili, onDevam, onGeri }: Props) {
  const [secili, setSecili] = useState<string | null>(ilkSecili);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-6 pt-6 pb-3 shrink-0">
        <button
          onClick={onGeri}
          className="text-[13px] text-neutral-500 mb-2 -ml-1 px-1 py-0.5"
        >
          ← Geri
        </button>
        <h1 className="text-xl font-medium text-neutral-900">İlk adımını seç</h1>
        <p className="text-[13px] text-neutral-500 mt-1">
          Bunlardan biriyle başlayalım. İstediğin zaman başka bir tane
          ekleyebilirsin.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-3">
        {ONERILEN.map((aktivite) => {
          const secildiMi = secili === aktivite.id;
          return (
            <button
              key={aktivite.id}
              onClick={() => setSecili(aktivite.id)}
              className={`text-left rounded-2xl border p-4 transition-colors ${
                secildiMi
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-neutral-200 bg-white'
              }`}
            >
              <p className="text-[15px] text-neutral-900 leading-snug">{aktivite.metin}</p>
              <div className="flex items-center gap-2 mt-2.5">
                <span className="text-[11px] px-2 py-1 rounded-full bg-neutral-100 text-neutral-600">
                  {ZORLUK_ETIKETI[aktivite.zorluk]}
                </span>
                <span className="text-[11px] px-2 py-1 rounded-full bg-neutral-100 text-neutral-600">
                  ~{aktivite.dakika} dk
                </span>
                {aktivite.disariCikmaGerekir && (
                  <span className="text-[11px] px-2 py-1 rounded-full bg-neutral-100 text-neutral-600">
                    Dışarıda
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-6 py-4 border-t border-neutral-200 shrink-0">
        <button
          onClick={() => secili && onDevam(secili)}
          disabled={!secili}
          className="w-full rounded-2xl bg-brand-600 text-white py-4 text-[15px] font-medium active:bg-brand-700 transition-colors disabled:bg-neutral-300 disabled:text-neutral-500"
        >
          Bunu seç
        </button>
      </div>
    </div>
  );
}
