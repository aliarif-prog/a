interface Props {
  soru: string;
  deger: number;
  onDegisim: (deger: number) => void;
  renk?: 'brand' | 'haz' | 'ustalik';
}

const IZ_RENKLERI: Record<string, string> = {
  brand: 'accent-brand-600',
  haz: 'accent-haz-500',
  ustalik: 'accent-ustalik-500',
};

export default function Kaydirici({ soru, deger, onDegisim, renk = 'brand' }: Props) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <p className="text-[14px] text-neutral-700 leading-snug">{soru}</p>
        <span className="text-[14px] font-medium text-neutral-900 shrink-0 tabular-nums">
          {deger}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={deger}
        onChange={(e) => onDegisim(Number(e.target.value))}
        className={`w-full h-2 rounded-full bg-neutral-200 ${IZ_RENKLERI[renk]}`}
      />
      <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
        <span>0</span>
        <span>10</span>
      </div>
    </div>
  );
}
