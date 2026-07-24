interface Props {
  onDevam: () => void;
}

export default function Giris({ onDevam }: Props) {
  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-10">
      <div className="flex-1 flex flex-col justify-center gap-4">
        <h1 className="text-2xl font-medium text-neutral-900 leading-snug">
          Küçük adımlarla başla
        </h1>
        <p className="text-neutral-600 text-[15px] leading-relaxed">
          Peacesy, senin için önemli olan yaşam alanlarını bulmana ve oralarda
          küçük, yapılabilir adımlar atmana yardımcı olur. Önce sana birkaç
          soru soracağız — bu birkaç dakikanı alır.
        </p>
      </div>

      <button
        onClick={onDevam}
        className="w-full rounded-2xl bg-brand-600 text-white py-4 text-[15px] font-medium active:bg-brand-700 transition-colors"
      >
        Başlayalım
      </button>
    </div>
  );
}
