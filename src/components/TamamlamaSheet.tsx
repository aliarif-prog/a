import { useEffect, useState } from 'react';
import type { Aktivite } from '../seed';

interface Props {
  aktivite: Aktivite;
  ornekGoster: boolean;
  onTamamlandi: (haz: number, ustalik: number) => void;
  onKapat: () => void;
}

const SECENEKLER = [
  { etiket: 'Hiç', deger: 0 },
  { etiket: 'Az', deger: 3 },
  { etiket: 'Orta', deger: 5 },
  { etiket: 'Çok', deger: 7 },
  { etiket: 'Tam', deger: 10 },
];

export default function TamamlamaSheet({ aktivite, ornekGoster, onTamamlandi, onKapat }: Props) {
  const [gorunur, setGorunur] = useState(false);
  const [haz, setHaz] = useState<number | null>(null);
  const [ustalik, setUstalik] = useState<number | null>(null);

  useEffect(() => {
    const kare = requestAnimationFrame(() => setGorunur(true));
    return () => cancelAnimationFrame(kare);
  }, []);

  function ustalikSec(deger: number) {
    if (haz === null) return;
    setUstalik(deger);
    setTimeout(() => onTamamlandi(haz, deger), 400);
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        onClick={onKapat}
        className={`absolute inset-0 bg-black transition-opacity duration-[220ms] ${
          gorunur ? 'opacity-40' : 'opacity-0'
        }`}
      />
      <div className="absolute inset-0 flex justify-center pointer-events-none">
        <div
          className={`w-full max-w-[430px] absolute bottom-0 bg-white rounded-t-3xl px-6 pt-5 pb-8 pointer-events-auto transition-transform duration-[220ms] ease-out ${
            gorunur ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="w-9 h-1 rounded-full bg-neutral-200 mx-auto mb-5" />

          <p className="text-[13px] text-neutral-500 mb-1">{aktivite.metin}</p>
          <h2 className="text-[17px] font-medium text-neutral-900 mb-5">Nasıl geçti?</h2>

          <div className="mb-6">
            <p className="text-[14px] text-neutral-800 mb-2.5">Ne kadar keyif aldın?</p>
            {ornekGoster && (
              <p className="text-[12px] text-neutral-400 mb-2">
                Örnek: Hoşuna giden bir şey yaptıysan yüksek seç.
              </p>
            )}
            <div className="flex gap-1.5">
              {SECENEKLER.map((s) => (
                <button
                  key={s.deger}
                  onClick={() => setHaz(s.deger)}
                  className={`flex-1 rounded-xl py-3 text-[12px] font-medium border transition-colors ${
                    haz === s.deger
                      ? 'bg-haz-500 border-haz-500 text-white'
                      : 'bg-haz-100 border-haz-100 text-neutral-700'
                  }`}
                >
                  {s.etiket}
                </button>
              ))}
            </div>
          </div>

          <div className={haz === null ? 'opacity-40 pointer-events-none' : ''}>
            <p className="text-[14px] text-neutral-800 mb-2.5">Ne kadar başarıyla yaptın?</p>
            {ornekGoster && (
              <p className="text-[12px] text-neutral-400 mb-2">
                Örnek: Uğraş gerektirdiyse ya da sonunu getirdiysen yüksek seç.
              </p>
            )}
            <div className="flex gap-1.5">
              {SECENEKLER.map((s) => (
                <button
                  key={s.deger}
                  onClick={() => ustalikSec(s.deger)}
                  className={`flex-1 rounded-xl py-3 text-[12px] font-medium border transition-colors ${
                    ustalik === s.deger
                      ? 'bg-ustalik-500 border-ustalik-500 text-white'
                      : 'bg-ustalik-100 border-ustalik-100 text-neutral-700'
                  }`}
                >
                  {s.etiket}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
