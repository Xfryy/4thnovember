export default function CopyrightPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "48px 16px", background: "#05030d", color: "#fff" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Copyright / Assets</h1>
        <p style={{ marginTop: 0, color: "rgba(255,255,255,0.7)" }}>
          Pernyataan hak cipta & penggunaan aset (untuk mengurangi risiko hukum).
        </p>

        <section style={card}>
          <h2 style={h2}>1) Hak cipta game</h2>
          <p style={p}>
            “4th November” dan konten orisinal (cerita, UI, desain gameplay) adalah milik developer/pemilik proyek,
            kecuali dinyatakan lain.
          </p>
        </section>

        <section style={card}>
          <h2 style={h2}>2) Aset pihak ketiga</h2>
          <p style={p}>
            Game dapat menggunakan aset pihak ketiga (gambar/audio/font/sfx) sesuai lisensi masing-masing. Hak cipta
            aset tetap milik pemiliknya. Jika kamu menemukan aset yang perlu atribusi atau klarifikasi, silakan hubungi
            developer untuk penyesuaian.
          </p>
        </section>

        <section style={card}>
          <h2 style={h2}>3) Tidak ada afiliasi</h2>
          <p style={p}>
            Jika ada merek dagang/nama pihak lain yang muncul, itu hanya untuk tujuan naratif/identifikasi. Game ini tidak
            berafiliasi dengan pemilik merek dagang tersebut.
          </p>
        </section>

        <section style={card}>
          <h2 style={h2}>4) Prosedur klaim / takedown</h2>
          <p style={p}>
            Jika kamu pemilik hak cipta dan merasa ada materi yang melanggar, kirim detail klaim (link/asset, bukti
            kepemilikan, dan permintaan) ke developer. Developer akan meninjau dan melakukan takedown/perubahan dengan
            itikad baik.
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

