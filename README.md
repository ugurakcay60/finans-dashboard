# Finans Paneli

React + Vite + Tailwind CSS v4 + Recharts + Lucide ile kişisel finans dashboard'u.

## Çalıştırma

```powershell
cd "Finans Yönetim Paneli\finans-dashboard"
npm install
npm run dev
```

Tarayıcıda http://localhost:5173 açılır.

> `node`/`npm` komutu bulunamazsa Node.js PATH'te değildir. Geçici çözüm:
> `$env:Path = "C:\Program Files\nodejs;$env:Path"`

## Dosya yapısı

```
src/
  App.jsx                      Ana sayfa: state, toplamlar, düzen
  components/
    Header.jsx                 Başlık, tema düğmesi, sıfırla
    SummaryCards.jsx           Bakiye / Gelir / Gider kartları
    TransactionForm.jsx        İşlem ekleme formu
    ExpenseChart.jsx           Kategorilere göre gider pasta grafiği
    TransactionList.jsx        Kaydırılabilir son işlemler listesi
  services/transactionService.js  Veri katmanı (localStorage veya API)
  data/                        Örnek veriler ve kategoriler
  utils/format.js              TL ve tarih biçimlendirme
```

## Veri kaynağı (API / MCP)

Varsayılan olarak işlemler tarayıcıda (localStorage) saklanır; "Sıfırla" örnek verilere döner.
Bir backend veya MCP köprüsü bağlamak için `.env.example` dosyasını `.env` olarak kopyalayıp
`VITE_API_URL` değerini girin. Servis şu uç noktaları bekler:

| Metot  | Yol                  | Açıklama          |
| ------ | -------------------- | ----------------- |
| GET    | `/transactions`      | Tüm işlemler      |
| POST   | `/transactions`      | Yeni işlem ekler  |
| DELETE | `/transactions/:id`  | İşlemi siler      |
