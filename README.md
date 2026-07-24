# Peacesy — atılacak prototip

Kullanılabilirlik testi için tıklanabilir bir akış. Ürün mantığı yok: backend,
veritabanı, auth, puanlama ve öneri algoritması yazılmadı — bkz. `src/seed.ts`
üstündeki not.

## Geliştirme

```
npm install
npm run dev -- --host
```

Telefondan test etmek için `--host` ile başlatıp aynı ağdan makinenin IP'sine
bağlan.

## Gizli debug paneli

Logoya 5 kez dokun: veri sıfırlama, sahte "bugün"ü ileri/geri sarma, zorluk
kapısını elle açma.
