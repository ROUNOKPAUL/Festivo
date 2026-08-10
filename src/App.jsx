import React, { useState, useMemo } from "react";

// ---------------------------------------------------------------------------
// Mock data — stands in for a live events API
// ---------------------------------------------------------------------------
const EVENTS = [
  { id: 1, type: "Festival", name: "Sunburn Festival", headliner: "Martin Garrix + 60 more", venue: "Vagator Beach", city: "Goa", date: "2026-12-27", endDate: "2026-12-29", genre: "EDM", price: 4999, days: 3, blurb: "Asia's largest EDM festival takes over the beach for three nights of headline sets and sunrise sets." },
  { id: 2, type: "Festival", name: "NH7 Weekender", headliner: "Prateek Kuhad + 35 more", venue: "Laxmi Lawns", city: "Pune", date: "2026-11-21", endDate: "2026-11-22", genre: "Indie", price: 2799, days: 2, blurb: "The 'Happiest Music Festival' — indie, rock, and hip-hop across five stages in one weekend." },
  { id: 3, type: "Festival", name: "Magnetic Fields", headliner: "Peggy Gou + 40 more", venue: "Alsisar Mahal", city: "Alwar, Rajasthan", date: "2026-12-11", endDate: "2026-12-13", genre: "Electronic", price: 8500, days: 3, blurb: "A boutique house and techno festival inside a 17th-century desert palace." },
  { id: 4, type: "Festival", name: "Hornbill Festival", headliner: "Tetseo Sisters + tribal ensembles", venue: "Naga Heritage Village", city: "Kohima, Nagaland", date: "2026-12-01", endDate: "2026-12-10", genre: "Folk", price: 1200, days: 10, blurb: "Ten days celebrating all 17 Naga tribes — traditional music, dance, and craft on Kisama's hillside grounds." },
  { id: 5, type: "Festival", name: "Ziro Festival of Music", headliner: "Peter Cat Recording Co. + 20 more", venue: "Ziro Valley", city: "Ziro, Arunachal Pradesh", date: "2026-09-24", endDate: "2026-09-27", genre: "Indie", price: 3200, days: 4, blurb: "An independent-music gathering in a UNESCO-listed rice valley, run by the local Apatani community." },
  { id: 6, type: "Concert", name: "Arijit Singh Live", headliner: "Arijit Singh", venue: "Jawaharlal Nehru Stadium", city: "Delhi", date: "2026-09-06", genre: "Bollywood", price: 3500, blurb: "A full-band arena show running through two decades of playback hits." },
  { id: 7, type: "Concert", name: "Carnatic Evenings", headliner: "T.M. Krishna", venue: "Music Academy", city: "Chennai", date: "2026-08-28", genre: "Classical", price: 600, blurb: "A traditional vocal Carnatic concert in the hall that hosts Chennai's December Season." },
  { id: 8, type: "Concert", name: "Jazz Utsav", headliner: "Louiz Banks Trio", venue: "Someplace Else", city: "Kolkata", date: "2026-09-13", genre: "Jazz", price: 800, blurb: "A late-night jazz residency in one of the city's oldest live-music rooms." },
  { id: 9, type: "Festival", name: "Rajasthan International Folk Festival", headliner: "Mame Khan + 25 more", venue: "Mehrangarh Fort", city: "Jodhpur", date: "2026-10-16", endDate: "2026-10-19", genre: "Folk", price: 2500, days: 4, blurb: "World and folk music performed against the ramparts of a 15th-century fort." },
  { id: 10, type: "Concert", name: "Ruhaniyat", headliner: "Kailasa + Sufi ensembles", venue: "Chowdiah Memorial Hall", city: "Bangalore", date: "2026-09-20", genre: "Sufi", price: 900, blurb: "An evening of Sufi, mystic, and folk music from across the subcontinent." },
  { id: 11, type: "Concert", name: "Independence Rock", headliner: "Parikrama", venue: "Rang Bhavan", city: "Mumbai", date: "2026-08-23", genre: "Rock", price: 1500, blurb: "India's longest-running rock festival, back for a single-night edition." },
  { id: 12, type: "Concert", name: "Bass Camp", headliner: "Nucleya", venue: "Hard Rock Cafe", city: "Hyderabad", date: "2026-09-11", genre: "Electronic", price: 1100, blurb: "Bass-heavy Indian electronica in an intimate club setting." },
];

const GENRES = ["All Genres", ...Array.from(new Set(EVENTS.map(e => e.genre))).sort()];
const CITIES = ["All Cities", ...Array.from(new Set(EVENTS.map(e => e.city))).sort()];

function formatDate(iso, endIso) {
  const d = new Date(iso + "T00:00:00");
  const opts = { month: "short", day: "numeric" };
  if (endIso) {
    const e = new Date(endIso + "T00:00:00");
    return `${d.toLocaleDateString("en-US", opts)}–${e.toLocaleDateString("en-US", opts)}`;
  }
  return d.toLocaleDateString("en-US", { ...opts, year: "numeric" });
}

function daysOut(iso) {
  const diff = Math.ceil((new Date(iso + "T00:00:00") - new Date("2026-08-10")) / 86400000);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `${diff} days out`;
}

// Deterministic little tilt per card so the board doesn't look grid-perfect
function tiltFor(id) {
  const seq = [-1.6, 1.2, -0.8, 2, -2.2, 0.6, 1.8, -1.1, 0.9, -1.9, 1.4, -0.5];
  return seq[id % seq.length];
}

export default function ConcertFinder() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All Genres");
  const [city, setCity] = useState("All Cities");
  const [type, setType] = useState("All");
  const [active, setActive] = useState(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EVENTS.filter(e => {
      if (type !== "All" && e.type !== type) return false;
      if (genre !== "All Genres" && e.genre !== genre) return false;
      if (city !== "All Cities" && e.city !== city) return false;
      if (q && !(`${e.name} ${e.headliner} ${e.venue} ${e.city} ${e.genre}`.toLowerCase().includes(q))) return false;
      return true;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [query, genre, city, type]);

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; }
        .cf-card { transition: transform .18s ease, box-shadow .18s ease; }
        .cf-card:hover { transform: translateY(-6px) rotate(0deg) !important; box-shadow: 0 18px 30px -12px rgba(0,0,0,0.5); }
        .cf-select, .cf-input { font-family: 'Space Grotesk', sans-serif; }
        .cf-chip { transition: background .15s ease, color .15s ease, border-color .15s ease; cursor: pointer; }
        ::selection { background: #E8FF5B; color: #14120F; }
        .cf-scroll::-webkit-scrollbar { width: 8px; }
        .cf-scroll::-webkit-scrollbar-thumb { background: #3a352c; border-radius: 4px; }
        button:focus-visible, input:focus-visible, select:focus-visible, .cf-chip:focus-visible, .cf-card:focus-visible {
          outline: 2px solid #E8FF5B; outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .cf-card, .cf-chip { transition: none !important; }
        }
      `}</style>

      {/* ---------------- HERO ---------------- */}
      <header style={styles.hero}>
        <div style={styles.heroTexture} />
        <div style={styles.heroInner}>
          <div style={styles.eyebrow}>LIVE MUSIC ACROSS INDIA</div>
          <h1 style={styles.h1}>
            FIND YOUR<br />NEXT NIGHT OUT
          </h1>
          <p style={styles.heroSub}>
            {EVENTS.length} shows and festivals on sale right now, from 90-seat jazz rooms to desert-fort weekenders.
          </p>

          <div style={styles.searchBar}>
            <span style={styles.searchIcon}>⚲</span>
            <input
              className="cf-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search artist, venue, or city…"
              style={styles.searchInput}
              aria-label="Search events"
            />
          </div>
        </div>
      </header>

      {/* ---------------- FILTER BAR ---------------- */}
      <div style={styles.filterBar}>
        <div style={styles.filterGroup} role="group" aria-label="Event type">
          {["All", "Concert", "Festival"].map(t => (
            <button
              key={t}
              className="cf-chip"
              onClick={() => setType(t)}
              style={{ ...styles.chip, ...(type === t ? styles.chipActive : {}) }}
            >
              {t === "All" ? "All Events" : `${t}s`}
            </button>
          ))}
        </div>

        <select className="cf-select" value={genre} onChange={(e) => setGenre(e.target.value)} style={styles.select}>
          {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <select className="cf-select" value={city} onChange={(e) => setCity(e.target.value)} style={styles.select}>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div style={styles.resultCount}>{results.length} result{results.length !== 1 ? "s" : ""}</div>
      </div>

      {/* ---------------- RESULTS / BOARD ---------------- */}
      <main style={styles.board}>
        {results.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyMark}>♪</div>
            <p style={styles.emptyTitle}>Nothing on the board matches that.</p>
            <p style={styles.emptyBody}>Try clearing a filter or searching a different city.</p>
            <button
              style={styles.emptyReset}
              onClick={() => { setQuery(""); setGenre("All Genres"); setCity("All Cities"); setType("All"); }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {results.map(e => (
              <button
                key={e.id}
                className="cf-card"
                onClick={() => setActive(e)}
                style={{ ...styles.card, transform: `rotate(${tiltFor(e.id)}deg)` }}
                aria-label={`View details for ${e.headliner} at ${e.venue}`}
              >
                <div style={styles.cardTop}>
                  <span style={{ ...styles.typeTag, background: e.type === "Festival" ? "#E8FF5B" : "#FF5A3C", color: "#14120F" }}>
                    {e.type}
                  </span>
                  <span style={styles.daysOut}>{daysOut(e.date)}</span>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.genreLabel}>{e.genre}</div>
                  <h3 style={styles.cardHeadliner}>{e.headliner}</h3>
                  <div style={styles.cardVenue}>{e.venue}</div>
                  <div style={styles.cardCity}>{e.city}</div>
                </div>

                <div style={styles.perforation} aria-hidden="true">
                  {Array.from({ length: 22 }).map((_, i) => <span key={i} style={styles.dot} />)}
                </div>

                <div style={styles.cardStub}>
                  <div style={styles.stubDate}>{formatDate(e.date, e.endDate)}</div>
                  <div style={styles.stubPrice}>FROM ₹{e.price.toLocaleString("en-IN")}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* ---------------- DETAIL MODAL ---------------- */}
      {active && (
        <div style={styles.overlay} onClick={() => setActive(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => setActive(null)} aria-label="Close details">✕</button>
            <span style={{ ...styles.typeTag, background: active.type === "Festival" ? "#E8FF5B" : "#FF5A3C", color: "#14120F" }}>
              {active.type}
            </span>
            <h2 style={styles.modalTitle}>{active.headliner}</h2>
            <div style={styles.modalMeta}>
              {active.venue} · {active.city}
            </div>
            <div style={styles.modalMetaRow}>
              <div>
                <div style={styles.modalLabel}>Date</div>
                <div style={styles.modalValue}>{formatDate(active.date, active.endDate)}</div>
              </div>
              <div>
                <div style={styles.modalLabel}>Genre</div>
                <div style={styles.modalValue}>{active.genre}</div>
              </div>
              <div>
                <div style={styles.modalLabel}>Price</div>
                <div style={styles.modalValue}>From ₹{active.price.toLocaleString("en-IN")}</div>
              </div>
              {active.days && (
                <div>
                  <div style={styles.modalLabel}>Length</div>
                  <div style={styles.modalValue}>{active.days} days</div>
                </div>
              )}
            </div>
            <p style={styles.modalBlurb}>{active.blurb}</p>
            <button style={styles.modalCta} onClick={() => setActive({ ...active, saved: true })}>
              {active.saved ? "✓ Saved to your list" : "Save this event"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Styles — token system: ink #14120F, paper #F0EAD9, violet #5B2A86,
// acid #E8FF5B, coral #FF5A3C
// ---------------------------------------------------------------------------
const styles = {
  page: {
    minHeight: "100%",
    background: "#14120F",
    color: "#F0EAD9",
    fontFamily: "'Space Grotesk', sans-serif",
    paddingBottom: 48,
  },
  hero: {
    position: "relative",
    background: "radial-gradient(120% 140% at 15% 0%, #5B2A86 0%, #2c1546 45%, #14120F 85%)",
    padding: "56px 24px 40px",
    overflow: "hidden",
    borderBottom: "3px solid #E8FF5B",
  },
  heroTexture: {
    position: "absolute", inset: 0,
    backgroundImage: "repeating-linear-gradient(115deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 14px)",
    pointerEvents: "none",
  },
  heroInner: { position: "relative", maxWidth: 780, margin: "0 auto", textAlign: "center" },
  eyebrow: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12, letterSpacing: "0.14em", color: "#E8FF5B", fontWeight: 600, marginBottom: 14,
  },
  h1: {
    fontFamily: "'Anton', sans-serif",
    fontWeight: 400,
    fontSize: "clamp(2.6rem, 7vw, 4.6rem)",
    lineHeight: 0.98,
    letterSpacing: "0.01em",
    margin: "0 0 16px",
    textShadow: "3px 3px 0 rgba(0,0,0,0.35)",
  },
  heroSub: { fontSize: 16, color: "#cfc6b0", margin: "0 0 28px", lineHeight: 1.5 },
  searchBar: {
    display: "flex", alignItems: "center", gap: 10,
    background: "#F0EAD9", borderRadius: 999, padding: "14px 22px",
    maxWidth: 480, margin: "0 auto",
    boxShadow: "0 10px 24px -8px rgba(0,0,0,0.45)",
  },
  searchIcon: { color: "#14120F", fontSize: 16, opacity: 0.6 },
  searchInput: {
    border: "none", outline: "none", background: "transparent",
    fontSize: 15, color: "#14120F", width: "100%", fontWeight: 500,
  },
  filterBar: {
    maxWidth: 1080, margin: "28px auto 0", padding: "0 24px",
    display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center",
  },
  filterGroup: { display: "flex", gap: 8, flexWrap: "wrap" },
  chip: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12.5, fontWeight: 600, letterSpacing: "0.03em",
    padding: "9px 16px", borderRadius: 999,
    border: "1.5px solid #3a352c", background: "transparent", color: "#cfc6b0",
  },
  chipActive: { background: "#E8FF5B", borderColor: "#E8FF5B", color: "#14120F" },
  select: {
    fontSize: 13.5, fontWeight: 500, color: "#F0EAD9",
    background: "#1f1c16", border: "1.5px solid #3a352c", borderRadius: 8,
    padding: "9px 12px", cursor: "pointer",
  },
  resultCount: {
    marginLeft: "auto", fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12.5, color: "#8f8672",
  },
  board: {
    maxWidth: 1080, margin: "0 auto", padding: "36px 24px 0",
    backgroundImage: "radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)",
    backgroundSize: "18px 18px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: 28,
  },
  card: {
    textAlign: "left", cursor: "pointer",
    background: "#F0EAD9", color: "#14120F",
    border: "none", borderRadius: 4,
    padding: 0, display: "flex", flexDirection: "column",
    boxShadow: "0 8px 0 -4px rgba(0,0,0,0.15), 0 10px 18px -8px rgba(0,0,0,0.5)",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px 0" },
  typeTag: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 700,
    letterSpacing: "0.06em", padding: "3px 9px", borderRadius: 999, textTransform: "uppercase",
  },
  daysOut: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#7a725f", fontWeight: 600 },
  cardBody: { padding: "12px 16px 18px" },
  genreLabel: { fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#5B2A86", textTransform: "uppercase", marginBottom: 6 },
  cardHeadliner: { fontFamily: "'Anton', sans-serif", fontWeight: 400, fontSize: 22, lineHeight: 1.05, margin: "0 0 8px" },
  cardVenue: { fontSize: 14, fontWeight: 600, color: "#14120F" },
  cardCity: { fontSize: 12.5, color: "#7a725f", marginTop: 2 },
  perforation: {
    display: "flex", justifyContent: "space-between", padding: "0 10px",
    borderTop: "2px dashed #d8cdb3",
  },
  dot: { width: 3, height: 3, marginTop: -2 },
  cardStub: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 16px 16px",
    fontFamily: "'JetBrains Mono', monospace",
  },
  stubDate: { fontSize: 12.5, fontWeight: 700, color: "#14120F" },
  stubPrice: { fontSize: 12.5, fontWeight: 700, color: "#FF5A3C" },
  empty: { textAlign: "center", padding: "60px 20px 40px", color: "#cfc6b0" },
  emptyMark: { fontSize: 30, color: "#E8FF5B", marginBottom: 10 },
  emptyTitle: { fontSize: 18, fontWeight: 600, margin: "0 0 6px", color: "#F0EAD9" },
  emptyBody: { fontSize: 14, color: "#8f8672", margin: "0 0 20px" },
  emptyReset: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, fontWeight: 600,
    background: "#E8FF5B", color: "#14120F", border: "none", borderRadius: 999,
    padding: "10px 20px", cursor: "pointer",
  },
  overlay: {
    position: "fixed", inset: 0, background: "rgba(10,9,7,0.72)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 20, zIndex: 50,
  },
  modal: {
    position: "relative", background: "#F0EAD9", color: "#14120F",
    borderRadius: 10, padding: "32px 28px", maxWidth: 440, width: "100%",
    boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6)",
    maxHeight: "86vh", overflowY: "auto",
  },
  modalClose: {
    position: "absolute", top: 16, right: 16, width: 30, height: 30, borderRadius: "50%",
    border: "1.5px solid #d8cdb3", background: "transparent", color: "#14120F", cursor: "pointer", fontSize: 13,
  },
  modalTitle: { fontFamily: "'Anton', sans-serif", fontWeight: 400, fontSize: 30, margin: "12px 0 4px", lineHeight: 1.02 },
  modalMeta: { fontSize: 14, color: "#5b5341", marginBottom: 20, fontWeight: 500 },
  modalMetaRow: {
    display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px 12px",
    borderTop: "2px dashed #d8cdb3", borderBottom: "2px dashed #d8cdb3",
    padding: "18px 0", marginBottom: 20,
  },
  modalLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: "0.06em", color: "#8a8067", textTransform: "uppercase", marginBottom: 3 },
  modalValue: { fontSize: 14.5, fontWeight: 700 },
  modalBlurb: { fontSize: 14.5, lineHeight: 1.6, color: "#3a3527", marginBottom: 24 },
  modalCta: {
    width: "100%", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700,
    letterSpacing: "0.04em", background: "#14120F", color: "#E8FF5B",
    border: "none", borderRadius: 8, padding: "14px 0", cursor: "pointer",
  },
};
