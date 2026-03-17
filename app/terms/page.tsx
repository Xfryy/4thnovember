export default function TermsPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "48px 16px", background: "#05030d", color: "#fff" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Terms of Use</h1>
        <p style={{ marginTop: 0, color: "rgba(255,255,255,0.7)" }}>
          4th November (Build Pengembangan / Demo)
        </p>

        <section style={card}>
          <h2 style={h2}>1) Status Pengembangan</h2>
          <p style={p}>
            Game ini masih dalam tahap pengembangan. Konten, fitur, performa, dan stabilitas dapat berubah kapan
            saja tanpa pemberitahuan. Kamu memahami bahwa bug/lag dapat terjadi.
          </p>
        </section>

        <section style={card}>
          <h2 style={h2}>2) Penggunaan & Batasan</h2>
          <ul style={ul}>
            <li style={li}>Jangan melakukan reverse engineering, distribusi ulang build, atau menghapus atribusi/hak cipta.</li>
            <li style={li}>Jangan memanfaatkan bug untuk merusak sistem, mengganggu pemain lain, atau mengambil data.</li>
            <li style={li}>Jangan mengunggah ulang aset game (gambar/audio) tanpa izin.</li>
          </ul>
        </section>

        <section style={card}>
          <h2 style={h2}>3) Konten & Hak Kekayaan Intelektual</h2>
          <p style={p}>
            Cerita, UI, dan materi orisinal game dilindungi hak cipta. Aset pihak ketiga (jika ada) tetap milik
            pemiliknya masing-masing dan digunakan sesuai lisensi yang berlaku.
          </p>
        </section>

        <section style={card}>
          <h2 style={h2}>4) Disclaimer</h2>
          <p style={p}>
            Game disediakan “sebagaimana adanya” (as-is) tanpa jaminan apa pun. Developer tidak bertanggung jawab
            atas kerugian yang timbul dari penggunaan game, sejauh diizinkan oleh hukum.
          </p>
        </section>

        <section style={card}>
          <h2 style={h2}>5) Kontak & Takedown</h2>
          <p style={p}>
            Jika ada konten/aset yang perlu diklarifikasi atau diturunkan (takedown), silakan hubungi developer.
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

