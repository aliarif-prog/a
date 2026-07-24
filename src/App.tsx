import { useRef, useState } from 'react';
import { useUygulamaVerisi, veriYukle } from './store';
import DebugPanel from './components/DebugPanel';
import Giris from './screens/Giris';
import DegerHaritasi from './screens/DegerHaritasi';
import DegerOzeti from './screens/DegerOzeti';
import IlkAktivite from './screens/IlkAktivite';
import HaftalikPlanlama from './screens/HaftalikPlanlama';
import Bugun from './screens/Bugun';

export type Ekran =
  | 'giris'
  | 'deger-haritasi'
  | 'deger-ozeti'
  | 'ilk-aktivite'
  | 'haftalik-planlama'
  | 'bugun';

function ilkEkran(): Ekran {
  return veriYukle().onboardingTamam ? 'bugun' : 'giris';
}

export default function App() {
  const { veri, guncelle, sifirla } = useUygulamaVerisi();
  const [ekran, setEkran] = useState<Ekran>(ilkEkran);
  const [secilenIlkAktiviteId, setSecilenIlkAktiviteId] = useState<string | null>(null);
  const [debugAcik, setDebugAcik] = useState(false);
  const logoTiklamaSayaci = useRef(0);
  const logoTiklamaZamanlayici = useRef<ReturnType<typeof setTimeout> | null>(null);

  function logoyaTikla() {
    logoTiklamaSayaci.current += 1;
    if (logoTiklamaZamanlayici.current) clearTimeout(logoTiklamaZamanlayici.current);
    if (logoTiklamaSayaci.current >= 5) {
      logoTiklamaSayaci.current = 0;
      setDebugAcik(true);
      return;
    }
    logoTiklamaZamanlayici.current = setTimeout(() => {
      logoTiklamaSayaci.current = 0;
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-neutral-200 flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-neutral-50 flex flex-col relative shadow-sm overflow-hidden">
        <header className="flex items-center justify-center py-4 border-b border-neutral-200 select-none shrink-0">
          <button
            onClick={logoyaTikla}
            className="text-[15px] font-medium tracking-wide text-brand-700"
            aria-label="Peacesy"
          >
            peacesy
          </button>
        </header>

        <main className="flex-1 flex flex-col min-h-0">
          {ekran === 'giris' && <Giris onDevam={() => setEkran('deger-haritasi')} />}

          {ekran === 'deger-haritasi' && (
            <DegerHaritasi
              veri={veri}
              guncelle={guncelle}
              onDevam={() => setEkran('deger-ozeti')}
            />
          )}

          {ekran === 'deger-ozeti' && (
            <DegerOzeti veri={veri} onDevam={() => setEkran('ilk-aktivite')} />
          )}

          {ekran === 'ilk-aktivite' && (
            <IlkAktivite
              onDevam={(aktiviteId) => {
                setSecilenIlkAktiviteId(aktiviteId);
                setEkran('haftalik-planlama');
              }}
            />
          )}

          {ekran === 'haftalik-planlama' && (
            <HaftalikPlanlama
              veri={veri}
              guncelle={guncelle}
              ilkAktiviteId={secilenIlkAktiviteId}
              onTamam={() => setEkran('bugun')}
            />
          )}

          {ekran === 'bugun' && <Bugun veri={veri} guncelle={guncelle} />}
        </main>
      </div>

      {debugAcik && (
        <DebugPanel
          veri={veri}
          guncelle={guncelle}
          sifirla={() => {
            sifirla();
            setSecilenIlkAktiviteId(null);
            setEkran('giris');
          }}
          onKapat={() => setDebugAcik(false)}
        />
      )}
    </div>
  );
}
