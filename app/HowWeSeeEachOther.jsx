import { useState, useRef, useCallback } from "react";

const ALL_CATEGORIES = [
  { id: "animal", label: "Animal", emoji: "🐾", hint: "What animal are they?", group: "classic" },
  { id: "place", label: "Place", emoji: "📍", hint: "A place that feels like them", group: "classic" },
  { id: "plant", label: "Plant / Flower", emoji: "🌿", hint: "What plant reminds you of them?", group: "classic" },
  { id: "season", label: "Season", emoji: "🍂", hint: "What season are they?", group: "classic" },
  { id: "character", label: "TV / Movie Character", emoji: "🎬", hint: "Who reminds you of them?", group: "classic" },
  { id: "hobby", label: "Hobby", emoji: "🎯", hint: "An activity that's so them", group: "classic" },
  { id: "color", label: "Color", emoji: "🎨", hint: "What color IS them?", group: "classic" },
  { id: "food", label: "Food", emoji: "🍽️", hint: "What dish reminds you of them?", group: "classic" },
  { id: "crystal", label: "Crystal / Gem", emoji: "💎", hint: "What crystal matches their energy?", group: "classic" },
  { id: "scent", label: "Scent", emoji: "🕯️", hint: "What do they smell like to you?", group: "fun" },
  { id: "era", label: "Era / Decade", emoji: "⏳", hint: "What era do they belong to?", group: "fun" },
  { id: "song", label: "Song / Album", emoji: "🎵", hint: "Their anthem", group: "fun" },
  { id: "texture", label: "Texture / Material", emoji: "🧶", hint: "Velvet? Marble? Sunlight?", group: "fun" },
  { id: "mythical", label: "Mythical Being", emoji: "🐉", hint: "What creature are they?", group: "fun" },
  { id: "weather", label: "Weather", emoji: "🌦️", hint: "What weather feels like them?", group: "fun" },
  { id: "drink", label: "Drink", emoji: "🍷", hint: "Wine? Matcha? Espresso?", group: "fun" },
  { id: "architecture", label: "Architecture", emoji: "🏛️", hint: "What building matches their vibe?", group: "fun" },
  { id: "movie_scene", label: "Movie Scene", emoji: "🎞️", hint: "A scene that IS them", group: "fun" },
  { id: "art", label: "Art Style", emoji: "🖼️", hint: "Renaissance? Abstract? Street art?", group: "fun" },
  { id: "element", label: "Element", emoji: "🔥", hint: "Fire, water, earth, or air?", group: "fun" },
  { id: "time_of_day", label: "Time of Day", emoji: "🌅", hint: "Dawn? Golden hour? Midnight?", group: "fun" },
  { id: "fabric", label: "Fashion Era", emoji: "👗", hint: "70s boho? 90s grunge? Y2K?", group: "fun" },
  { id: "city", label: "City Energy", emoji: "🌃", hint: "What city matches their energy?", group: "fun" },
  { id: "dessert", label: "Dessert", emoji: "🍰", hint: "Sweet, rich, delicate, bold?", group: "fun" },
  { id: "superpower", label: "Superpower", emoji: "⚡", hint: "What power would they have?", group: "fun" },
  { id: "instrument", label: "Instrument", emoji: "🎸", hint: "Piano? Drums? Oud?", group: "fun" },
];

const FONT_LINK = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap";

export default function HowWeSeeEachOther() {
  const [view, setView] = useState("intro");
  const [person1Name, setPerson1Name] = useState("");
  const [person2Name, setPerson2Name] = useState("");
  const [selectedCats, setSelectedCats] = useState([]);
  const [activePerson, setActivePerson] = useState(1);
  const [grid1, setGrid1] = useState({});
  const [grid2, setGrid2] = useState({});
  const [activeCell, setActiveCell] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef(null);

  const currentGrid = activePerson === 1 ? grid1 : grid2;
  const setCurrentGrid = activePerson === 1 ? setGrid1 : setGrid2;
  const currentName = activePerson === 1 ? person1Name : person2Name;
  const partnerName = activePerson === 1 ? person2Name : person1Name;
  const categories = ALL_CATEGORIES.filter(c => selectedCats.includes(c.id));

  const toggleCat = (id) => {
    setSelectedCats(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 9) return prev;
      return [...prev, id];
    });
  };

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (activeCell) {
        setCurrentGrid(prev => ({ ...prev, [activeCell]: ev.target.result }));
        setActiveCell(null);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, [activeCell, setCurrentGrid]);

  const handleUrlSubmit = useCallback(() => {
    if (imageUrl.trim() && activeCell) {
      setCurrentGrid(prev => ({ ...prev, [activeCell]: imageUrl.trim() }));
      setImageUrl("");
      setActiveCell(null);
    }
  }, [imageUrl, activeCell, setCurrentGrid]);

  const filledCount = categories.filter(c => currentGrid[c.id]).length;
  const isGridComplete = filledCount === 9;
  const classics = ALL_CATEGORIES.filter(c => c.group === "classic");
  const funs = ALL_CATEGORIES.filter(c => c.group === "fun");

  return (
    <>
      <link href={FONT_LINK} rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes softPulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        input::placeholder { color: #4a4060; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #08080d 0%, #110e1a 40%, #18121f 70%, #0d0810 100%)",
        fontFamily: "'DM Sans', sans-serif",
        color: "#e4e0ed",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "fixed", top: "-20%", right: "-15%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", animation: "softPulse 9s ease-in-out infinite" }} />
        <div style={{ position: "fixed", bottom: "-15%", left: "-10%", width: "550px", height: "550px", background: "radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", animation: "softPulse 11s ease-in-out infinite 3s" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto", padding: "36px 20px 60px" }}>

          {view === "intro" && (
            <div style={{ animation: "fadeUp 0.7s ease-out", textAlign: "center" }}>
              <div style={{ fontSize: "44px", marginBottom: "10px", animation: "float 4s ease-in-out infinite" }}>💜</div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 6vw, 38px)",
                fontWeight: 400, fontStyle: "italic", letterSpacing: "-0.5px", marginBottom: "6px",
                background: "linear-gradient(135deg, #c4b5fd, #f0abfc, #fda4af)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>How We See Each Other</h1>
              <p style={{ fontSize: "13px", color: "#8a7fa4", marginBottom: "40px", lineHeight: 1.6 }}>
                A 9-square moodboard for the person you love.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "320px", margin: "0 auto" }}>
                {[
                  { label: "Person 1", val: person1Name, set: setPerson1Name, ph: "e.g. İlayda" },
                  { label: "Person 2", val: person2Name, set: setPerson2Name, ph: "e.g. Boogie" },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ display: "block", fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", color: "#6b5f87", marginBottom: "5px", textAlign: "left" }}>{f.label}</label>
                    <input type="text" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                      style={{ width: "100%", padding: "13px 15px", background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", color: "#e4e0ed", fontSize: "15px", fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border 0.3s" }}
                      onFocus={e => e.target.style.borderColor = "rgba(196,181,253,0.35)"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.07)"}
                    />
                  </div>
                ))}
                <button onClick={() => { if (person1Name.trim() && person2Name.trim()) setView("pick"); }}
                  disabled={!person1Name.trim() || !person2Name.trim()}
                  style={{
                    marginTop: "12px", padding: "15px",
                    background: person1Name.trim() && person2Name.trim() ? "linear-gradient(135deg, #8b5cf6, #a855f7, #d946ef)" : "rgba(255,255,255,0.04)",
                    border: "none", borderRadius: "14px",
                    color: person1Name.trim() && person2Name.trim() ? "#fff" : "#444",
                    fontSize: "14px", fontWeight: 500, cursor: person1Name.trim() && person2Name.trim() ? "pointer" : "default",
                    fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.3px",
                  }}>
                  Pick your categories →
                </button>
              </div>
            </div>
          )}

          {view === "pick" && (
            <div style={{ animation: "fadeUp 0.6s ease-out" }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 5vw, 30px)",
                fontWeight: 400, fontStyle: "italic", textAlign: "center", marginBottom: "4px",
                background: "linear-gradient(135deg, #c4b5fd, #f0abfc)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>Choose 9 Categories</h2>
              <p style={{ textAlign: "center", fontSize: "13px", color: "#7a6f96", marginBottom: "28px" }}>
                Mix & match classics and fun ones · <span style={{ color: selectedCats.length === 9 ? "#a78bfa" : "#ec4899" }}>{selectedCats.length}/9 selected</span>
              </p>

              {[{ title: "Classics", items: classics }, { title: "Fun & Spicy", items: funs }].map(section => (
                <div key={section.title} style={{ marginBottom: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: "#6b5f87", fontWeight: 600 }}>{section.title}</span>
                    <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
                    {section.title === "Classics" && (
                      <button onClick={() => {
                        const classicIds = classics.map(c => c.id);
                        const allSelected = classicIds.every(id => selectedCats.includes(id));
                        if (allSelected) {
                          setSelectedCats(prev => prev.filter(id => !classicIds.includes(id)));
                        } else {
                          setSelectedCats(prev => {
                            const withoutClassics = prev.filter(id => !classicIds.includes(id));
                            return [...withoutClassics, ...classicIds].slice(0, 9);
                          });
                        }
                      }} style={{
                        fontSize: "10px", color: "#8b7fa8", background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px",
                        padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                      }}>
                        {classics.every(c => selectedCats.includes(c.id)) ? "Deselect all" : "Select all 9"}
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {section.items.map((cat, i) => {
                      const selected = selectedCats.includes(cat.id);
                      const disabled = !selected && selectedCats.length >= 9;
                      return (
                        <button key={cat.id} onClick={() => !disabled && toggleCat(cat.id)}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: "6px",
                            padding: "9px 14px", borderRadius: "100px",
                            background: selected ? "linear-gradient(135deg, rgba(139,92,246,0.25), rgba(217,70,239,0.15))" : "rgba(255,255,255,0.025)",
                            border: selected ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.06)",
                            color: selected ? "#d8b4fe" : disabled ? "#3a3350" : "#8a7fa4",
                            fontSize: "13px", cursor: disabled ? "default" : "pointer",
                            fontFamily: "'DM Sans', sans-serif",
                            transition: "all 0.25s",
                            animation: `fadeUp 0.4s ease-out ${i * 0.03}s both`,
                            opacity: disabled ? 0.4 : 1,
                          }}>
                          <span style={{ fontSize: "15px" }}>{cat.emoji}</span>
                          {cat.label}
                          {selected && <span style={{ fontSize: "11px", opacity: 0.6 }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div style={{ textAlign: "center", marginTop: "12px" }}>
                <button onClick={() => { if (selectedCats.length === 9) setView("editing"); }}
                  disabled={selectedCats.length !== 9}
                  style={{
                    padding: "15px 36px",
                    background: selectedCats.length === 9 ? "linear-gradient(135deg, #8b5cf6, #a855f7, #d946ef)" : "rgba(255,255,255,0.04)",
                    border: "none", borderRadius: "14px",
                    color: selectedCats.length === 9 ? "#fff" : "#444",
                    fontSize: "14px", fontWeight: 500, cursor: selectedCats.length === 9 ? "pointer" : "default",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                  Start filling boards ✨
                </button>
                <br />
                <button onClick={() => setView("intro")}
                  style={{ marginTop: "12px", background: "none", border: "none", color: "#5a4f72", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  ← Back
                </button>
              </div>
            </div>
          )}

          {view === "editing" && (
            <div style={{ animation: "fadeUp 0.5s ease-out" }}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "24px", justifyContent: "center" }}>
                {[1, 2].map(p => (
                  <button key={p} onClick={() => { setActivePerson(p); setActiveCell(null); }}
                    style={{
                      padding: "9px 22px", borderRadius: "100px",
                      background: activePerson === p ? "linear-gradient(135deg, rgba(139,92,246,0.25), rgba(217,70,239,0.15))" : "rgba(255,255,255,0.025)",
                      border: activePerson === p ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(255,255,255,0.05)",
                      color: activePerson === p ? "#d8b4fe" : "#5a5070",
                      fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    }}>
                    {p === 1 ? person1Name : person2Name}'s board
                  </button>
                ))}
              </div>

              <p style={{ textAlign: "center", fontSize: "13px", color: "#8a7fa4", marginBottom: "20px", fontStyle: "italic" }}>
                {currentName}, pick images that remind you of <strong style={{ color: "#c4b5fd" }}>{partnerName}</strong>
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px" }}>
                {categories.map((cat, i) => {
                  const img = currentGrid[cat.id];
                  const isActive = activeCell === cat.id;
                  return (
                    <button key={cat.id} onClick={() => setActiveCell(isActive ? null : cat.id)}
                      style={{
                        aspectRatio: "1", borderRadius: "16px",
                        border: isActive ? "2px solid rgba(196,181,253,0.55)" : "1px solid rgba(255,255,255,0.06)",
                        background: img ? `url(${img}) center/cover no-repeat` : "rgba(255,255,255,0.02)",
                        cursor: "pointer", position: "relative", overflow: "hidden",
                        transition: "all 0.25s", animation: `fadeUp 0.4s ease-out ${i * 0.04}s both`,
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        padding: "10px 6px",
                      }}>
                      {img && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%)" }} />}
                      <span style={{ position: "relative", zIndex: 1, fontSize: img ? "18px" : "26px", marginBottom: img ? "1px" : "5px", filter: img ? "drop-shadow(0 1px 3px rgba(0,0,0,0.5))" : "none" }}>{cat.emoji}</span>
                      <span style={{ position: "relative", zIndex: 1, fontSize: "9px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.8px", color: img ? "#fff" : "#7a6f96", textShadow: img ? "0 1px 3px rgba(0,0,0,0.6)" : "none", textAlign: "center", lineHeight: 1.3 }}>{cat.label}</span>
                      {!img && <span style={{ position: "relative", zIndex: 1, fontSize: "8px", color: "#4e4568", marginTop: "3px", fontStyle: "italic", textAlign: "center" }}>{cat.hint}</span>}
                    </button>
                  );
                })}
              </div>

              {activeCell && (
                <div style={{ animation: "scaleIn 0.25s ease-out", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px", padding: "18px", marginBottom: "20px" }}>
                  <p style={{ fontSize: "12px", color: "#9a8fb8", marginBottom: "12px", textAlign: "center" }}>
                    Add image for <strong style={{ color: "#d8b4fe" }}>{categories.find(c => c.id === activeCell)?.emoji} {categories.find(c => c.id === activeCell)?.label}</strong>
                  </p>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                    <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                      placeholder="Paste image URL from Pinterest..."
                      onKeyDown={e => e.key === "Enter" && handleUrlSubmit()}
                      style={{ flex: 1, padding: "11px 13px", background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", color: "#e4e0ed", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" }}
                    />
                    <button onClick={handleUrlSubmit}
                      style={{ padding: "11px 16px", background: imageUrl.trim() ? "linear-gradient(135deg, #8b5cf6, #a855f7)" : "rgba(255,255,255,0.04)", border: "none", borderRadius: "10px", color: imageUrl.trim() ? "#fff" : "#444", fontSize: "12px", cursor: imageUrl.trim() ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif" }}>
                      Add
                    </button>
                  </div>
                  <div style={{ textAlign: "center", margin: "6px 0" }}><span style={{ fontSize: "10px", color: "#4e4568" }}>or</span></div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                  <button onClick={() => fileInputRef.current?.click()}
                    style={{ width: "100%", padding: "11px", background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "10px", color: "#7a6f96", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    📁 Upload from device
                  </button>
                  {currentGrid[activeCell] && (
                    <button onClick={() => { setCurrentGrid(prev => { const n = {...prev}; delete n[activeCell]; return n; }); }}
                      style={{ width: "100%", marginTop: "8px", padding: "9px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "10px", color: "#f87171", fontSize: "11px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      Remove image
                    </button>
                  )}
                </div>
              )}

              <div style={{ textAlign: "center" }}>
                <div style={{ display: "inline-flex", gap: "4px", marginBottom: "12px" }}>
                  {categories.map(cat => (
                    <div key={cat.id} style={{ width: "22px", height: "3px", borderRadius: "2px", background: currentGrid[cat.id] ? "linear-gradient(90deg, #8b5cf6, #d946ef)" : "rgba(255,255,255,0.07)", transition: "all 0.3s" }} />
                  ))}
                </div>
                <p style={{ fontSize: "11px", color: "#5a5070", marginBottom: "16px" }}>{filledCount}/9</p>

                <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => setView("pick")}
                    style={{ padding: "11px 20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", color: "#6b5f87", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    ← Categories
                  </button>

                  {activePerson === 1 && isGridComplete && (
                    <button onClick={() => { setActivePerson(2); setActiveCell(null); }}
                      style={{ padding: "13px 28px", background: "linear-gradient(135deg, #8b5cf6, #d946ef)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      Done → {person2Name}'s turn ✨
                    </button>
                  )}
                  {activePerson === 2 && isGridComplete && (
                    <button onClick={() => setView("compare")}
                      style={{ padding: "13px 28px", background: "linear-gradient(135deg, #ec4899, #a855f7)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      Reveal & Compare 💜
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {view === "compare" && (
            <div style={{ animation: "fadeUp 0.7s ease-out" }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 5vw, 30px)",
                fontWeight: 400, fontStyle: "italic", textAlign: "center", marginBottom: "28px",
                background: "linear-gradient(135deg, #c4b5fd, #f0abfc)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>How We See Each Other</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {[1, 2].map(person => {
                  const name = person === 1 ? person1Name : person2Name;
                  const partner = person === 1 ? person2Name : person1Name;
                  const grid = person === 1 ? grid1 : grid2;
                  return (
                    <div key={person} style={{ animation: `fadeUp 0.5s ease-out ${person * 0.2}s both` }}>
                      <p style={{ textAlign: "center", fontSize: "12px", color: "#8a7fa4", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "2px" }}>
                        {name}'s view of <span style={{ color: "#d8b4fe" }}>{partner}</span>
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4px", borderRadius: "18px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
                        {categories.map(cat => (
                          <div key={cat.id} style={{ aspectRatio: "1", background: grid[cat.id] ? `url(${grid[cat.id]}) center/cover no-repeat` : "rgba(255,255,255,0.025)", position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.65) 100%)" }} />
                            <div style={{ position: "absolute", bottom: "5px", left: "6px", right: "6px", zIndex: 1 }}>
                              <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: "0.4px", textShadow: "0 1px 3px rgba(0,0,0,0.5)", fontWeight: 500 }}>
                                {cat.emoji} {cat.label}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ textAlign: "center", marginTop: "28px", display: "flex", gap: "8px", justifyContent: "center" }}>
                <button onClick={() => setView("editing")}
                  style={{ padding: "11px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", color: "#7a6f96", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  ← Edit boards
                </button>
                <button onClick={() => { setView("intro"); setGrid1({}); setGrid2({}); setSelectedCats([]); setPerson1Name(""); setPerson2Name(""); setActivePerson(1); }}
                  style={{ padding: "11px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", color: "#7a6f96", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Start over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
