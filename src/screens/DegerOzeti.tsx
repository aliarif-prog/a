import { YASAM_ALANLARI } from '../seed';
import type { UygulamaVerisi } from '../store';

interface Props {
  veri: UygulamaVerisi;
  onDevam: () => void;
  onGeri: () => void;
}

export default function DegerOzeti({ veri, onDevam, onGeri }: Props) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-6 pt-6 pb-3 shrink-0">
        <button
          onClick={onGeri}
          className="text-[13px] text-neutral-500 mb-2 -ml-1 px-1 py-0.5"
        >
          ← Geri
        </button>
        <h1 className="text-xl font-medium text-neutral-900">Haritan hazır</h1>
        <p className="text-[13px] text-neutral-500 mt-1">
          Her alanda önem verdiğin ile ayırabildiğin vakit arasındaki fark.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-4">
        {YASAM_ALANLARI.map((alan) => {
          const d = veri.alanDegerlendirmeleri.find((x) => x.alanId === alan.id);
          const onem = d?.onem ?? 0;
          const vakit = d?.vakit ?? 0;
          return (
            <div key={alan.id} className="flex flex-col gap-1.5">
              <p className="text-[14px] font-medium text-neutral-800">{alan.ad}</p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-500 w-10 shrink-0">Önem</span>
                <div className="flex-1 h-2 rounded-full bg-neutral-200 overflow-hidden">
                  <div
                    className="h-full bg-brand-600 rounded-full"
                    style={{ width: `${onem * 10}%` }}
                  />
                </div>
                <span className="text-[11px] text-neutral-500 w-4 text-right tabular-nums">
                  {onem}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-500 w-10 shrink-0">Vakit</span>
                <div className="flex-1 h-2 rounded-full bg-neutral-200 overflow-hidden">
                  <div
                    className="h-full bg-brand-300 rounded-full"
                    style={{ width: `${vakit * 10}%` }}
                  />
                </div>
                <span className="text-[11px] text-neutral-500 w-4 text-right tabular-nums">
                  {vakit}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-6 py-4 border-t border-neutral-200 shrink-0">
        <button
          onClick={onDevam}
          className="w-full rounded-2xl bg-brand-600 text-white py-4 text-[15px] font-medium active:bg-brand-700 transition-colors"
        >
          İlk adımı seç
        </button>
      </div>
    </div>
  );
}
