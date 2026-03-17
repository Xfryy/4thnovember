export default function PrivacyPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "48px 16px", background: "#05030d", color: "#fff" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ marginTop: 0, color: "rgba(255,255,255,0.7)" }}>Ringkas & jelas untuk build demo.</p>

        <section style={card}>
          <h2 style={h2}>1) Data yang disimpan</h2>
          <ul style={ul}>
            <li style={li}>Nama karakter, pilihan cerita, affection, progres scene.</li>
            <li style={li}>Pengaturan (volume, brightness, bahasa, text speed) via penyimpanan lokal browser.</li>
          </ul>
        </section>

        <section style={card}>
          <h2 style={h2}>2) Tujuan penggunaan</h2>
          <p style={p}>
            Data digunakan untuk menyimpan progres permainan, memulihkan save/load, dan pengalaman bermain yang konsisten.
          </p>
        </section>

        <section style={card}>
          <h2 style={h2}>3) Pihak ketiga</h2>
          <p style={p}>
            Jika game menggunakan layanan login/penyimpanan pihak ketiga (mis. Google/Firebase), maka kebijakan privasi
            layanan tersebut juga berlaku untuk data yang diproses di sana.
          </p>
        </section>

        <section style={card}>
          <h2 style={h2}>4) Kontrol pemain</h2>
          <p style={p}>
            Kamu dapat menghapus data lokal melalui pengaturan browser (localStorage) atau reset/clear data aplikasi.
          </p>
        </section>
      </div>
    </main>
  );
}

const card: React.CSSProperties = {
  marginTop: 14,
  borderRadius: 16,
  padding: "14px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const h2: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 900,
  margin: "0 0 8px",
  color: "rgba(233,213,255,0.95)",
};

const p: React.CSSProperties = {
  margin: 0,
  lineHeight: 1.7,
  color: "rgba(255,255,255,0.78)",
  fontSize: 14,
};

const ul: React.CSSProperties = { margin: 0, paddingLeft: 18, color: "rgba(255,255,255,0.78)", lineHeight: 1.7 };
const li: React.CSSProperties = { marginBottom: 6 };

