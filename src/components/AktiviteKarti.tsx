import { useRef, useState } from 'react';
import type { Aktivite, PlanlanmisAktivite } from '../seed';

interface Props {
  planlanmis: PlanlanmisAktivite;
  aktivite: Aktivite;
  onTamamla: () => void;
}

const ESIK = 88;

export default function AktiviteKarti({ planlanmis, aktivite, onTamamla }: Props) {
  const [dx, setDx] = useState(0);
  const [suruklemede, setSuruklemede] = useState(false);
  const baslangicX = useRef(0);
  const swipelenebilir = planlanmis.durum === 'bekliyor';

  function pointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!swipelenebilir) return;
    setSuruklemede(true);
    baslangicX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function pointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!suruklemede) return;
    const fark = e.clientX - baslangicX.current;
    setDx(Math.max(0, Math.min(fark, 160)));
  }
  function pointerUp() {
    if (!suruklemede) return;
    setSuruklemede(false);
    if (dx > ESIK) {
      onTamamla();
    }
    setDx(0);
  }

  const durumStil =
    planlanmis.durum === 'tamamlandi'
      ? 'border-neutral-200 bg-neutral-100'
      : planlanmis.durum === 'kacirildi'
        ? 'border-neutral-200 bg-neutral-50'
        : 'border-neutral-200 bg-white';

  return (
    <div className="relative">
      {swipelenebilir && (
        <div className="absolute inset-0 rounded-2xl bg-brand-100 flex items-center pl-5">
          <span className="text-[13px] font-medium text-brand-700">Tamamla →</span>
        </div>
      )}
      <div
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
        style={{
          transform: `translateX(${dx}px)`,
          transition: suruklemede ? 'none' : 'transform 180ms ease-out',
        }}
        className={`relative rounded-2xl border p-4 touch-pan-y ${durumStil}`}
      >
        <div className="flex items-start justify-between gap-3">
          <p
            className={`text-[14px] leading-snug ${
              planlanmis.durum === 'tamamlandi'
                ? 'text-neutral-500'
                : planlanmis.durum === 'kacirildi'
                  ? 'text-neutral-400'
                  : 'text-neutral-900'
            }`}
          >
            {aktivite.metin}
          </p>
          <span className="text-[12px] text-neutral-400 shrink-0 tabular-nums">
            {planlanmis.saat}
          </span>
        </div>
        {planlanmis.ifThen && (
          <p className="text-[12px] text-neutral-400 mt-1.5">{planlanmis.ifThen}</p>
        )}
        <div className="mt-2">
          {planlanmis.durum === 'tamamlandi' && (
            <span className="text-[12px] text-brand-600">Tamamlandı</span>
          )}
          {planlanmis.durum === 'kacirildi' && (
            <span className="text-[12px] text-neutral-400">Bugün olmadı</span>
          )}
          {planlanmis.durum === 'bekliyor' && (
            <span className="text-[12px] text-neutral-400">Sağa kaydırarak tamamla</span>
          )}
        </div>
      </div>
    </div>
  );
}
