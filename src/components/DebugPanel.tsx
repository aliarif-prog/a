import { bugununTarihi, tarihiFormatla, type UygulamaVerisi } from '../store';

interface Props {
  veri: UygulamaVerisi;
  guncelle: (parca: Partial<UygulamaVerisi>) => void;
  sifirla: () => void;
  onKapat: () => void;
}

export default function DebugPanel({ veri, guncelle, sifirla, onKapat }: Props) {
  const bugun = bugununTarihi(veri.sahteBugunOfset);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-medium text-neutral-900">Debug paneli</h2>
          <button onClick={onKapat} className="text-[13px] text-neutral-400">
            Kapat
          </button>
        </div>

        <button
          onClick={sifirla}
          className="w-full rounded-2xl bg-kriz-500 text-white py-3.5 text-[14px] font-medium"
        >
          Tüm veriyi sıfırla
        </button>

        <div className="rounded-2xl border border-neutral-200 p-4 flex flex-col gap-3">
          <p className="text-[13px] text-neutral-500">
            Sahte bugün: <span className="text-neutral-900 capitalize">{tarihiFormatla(bugun)}</span>{' '}
            (ofset {veri.sahteBugunOfset})
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => guncelle({ sahteBugunOfset: veri.sahteBugunOfset - 1 })}
              className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-[13px] text-neutral-700"
            >
              ← Geri sar
            </button>
            <button
              onClick={() => guncelle({ sahteBugunOfset: veri.sahteBugunOfset + 1 })}
              className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-[13px] text-neutral-700"
            >
              İleri sar →
            </button>
          </div>
          {veri.sahteBugunOfset !== 0 && (
            <button
              onClick={() => guncelle({ sahteBugunOfset: 0 })}
              className="text-[12px] text-neutral-400"
            >
              Gerçek bugüne dön
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-neutral-200 p-4 flex items-center justify-between">
          <div>
            <p className="text-[13px] text-neutral-800">Zorluk kapısı</p>
            <p className="text-[12px] text-neutral-400">Elle aç/kapat, hesap yok.</p>
          </div>
          <button
            onClick={() => guncelle({ zorlukKapisiAcik: !veri.zorlukKapisiAcik })}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium ${
              veri.zorlukKapisiAcik
                ? 'bg-brand-600 text-white'
                : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            {veri.zorlukKapisiAcik ? 'Açık' : 'Kapalı'}
          </button>
        </div>
      </div>
    </div>
  );
}
