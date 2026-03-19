import { useState, useEffect } from "react";

const habits = [
  { id: "protein", label: "Protein", category: "Diet", icon: "🥩" },
  { id: "calories", label: "Calories", category: "Diet", icon: "🔥" },
  { id: "vitamins", label: "Vitamins", category: "Diet", icon: "💊" },
  { id: "water", label: "Water", category: "Health", icon: "💧" },
  { id: "sunlight", label: "Sunlight", category: "Health", icon: "☀️" },
  { id: "skincare", label: "Skin Care", category: "Health", icon: "✨" },
  { id: "stretching", label: "Stretching", category: "Movement", icon: "🧘" },
  { id: "gym", label: "Gym", category: "Movement", icon: "🏋️" },
  { id: "running", label: "Running", category: "Movement", icon: "🏃" },
  { id: "swimming", label: "Swimming", category: "Movement", icon: "🏊" },
  { id: "steps", label: "10k Steps", category: "Movement", icon: "👟" },
  { id: "recovery", label: "Recovery", category: "Movement", icon: "🛁" },
  { id: "sleep", label: "Sleep 7+ hr", category: "Recovery", icon: "😴" },
  { id: "reading", label: "Reading", category: "Learning", icon: "📚" },
  { id: "trading_learn", label: "Trading Learning", category: "Trading", icon: "📈" },
  { id: "work_skills", label: "Work Skills", category: "Learning", icon: "💼" },
  { id: "trading_news", label: "Trading News", category: "Trading", icon: "📰" },
  { id: "trading_plan", label: "Trading Plan", category: "Trading", icon: "📋" },
  { id: "trading_journal", label: "Trading Journal", category: "Trading", icon: "📓" },
  { id: "gratitude", label: "Gratitude", category: "Mental", icon: "🙏" },
  { id: "digital", label: "Digital Discipline", category: "Mental", icon: "📵" },
  { id: "personal_dev", label: "Personal Development", category: "Life", icon: "🌱" },
  { id: "adhoc", label: "Adhoc Works", category: "Life", icon: "⚡" },
  { id: "productivity", label: "Productivity", category: "Work", icon: "🎯" },
  { id: "work8", label: "Work 8+ hrs", category: "Work", icon: "⏱️" },
  { id: "planning", label: "Daily Planning", category: "Work", icon: "🗓️" },
];

const categoryColors = {
  Diet:     { bg: "#1a2e1a", accent: "#4ade80", light: "#bbf7d0" },
  Health:   { bg: "#1e2a1e", accent: "#34d399", light: "#a7f3d0" },
  Movement: { bg: "#1a1f2e", accent: "#60a5fa", light: "#bfdbfe" },
  Recovery: { bg: "#1e1a2e", accent: "#a78bfa", light: "#ddd6fe" },
  Learning: { bg: "#2e2a1a", accent: "#fbbf24", light: "#fde68a" },
  Trading:  { bg: "#2e1a1a", accent: "#f87171", light: "#fecaca" },
  Mental:   { bg: "#1a2e2e", accent: "#22d3ee", light: "#a5f3fc" },
  Life:     { bg: "#2e1a2e", accent: "#e879f9", light: "#f5d0fe" },
  Work:     { bg: "#2a2e1a", accent: "#a3e635", light: "#d9f99d" },
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekDates(weekOffset = 0) {
  const base = new Date();
  const day = base.getDay();
  const diff = base.getDate() - day + (day === 0 ? -6 : 1) + weekOffset * 7;
  const monday = new Date(new Date().setDate(diff));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

export default function HabitTracker() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [completions, setCompletions] = useState({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [view, setView] = useState("week"); // week | today

  const weekDates = getWeekDates(weekOffset);
  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    try {
      const stored = localStorage.getItem("habitCompletions");
      if (stored) setCompletions(JSON.parse(stored));
    } catch {}
  }, []);

  const toggle = (habitId, date) => {
    const key = `${habitId}_${date}`;
    const updated = { ...completions, [key]: !completions[key] };
    if (!updated[key]) delete updated[key];
    setCompletions(updated);
    try { localStorage.setItem("habitCompletions", JSON.stringify(updated)); } catch {}
  };

  const isDone = (habitId, date) => !!completions[`${habitId}_${date}`];

  const categories = ["All", ...Object.keys(categoryColors)];
  const filteredHabits = activeCategory === "All" ? habits : habits.filter(h => h.category === activeCategory);

  const todayScore = habits.filter(h => isDone(h.id, todayStr)).length;
  const weekScore = weekDates.reduce((sum, d) => sum + habits.filter(h => isDone(h.id, d)).length, 0);
  const weekTotal = habits.length * 7;
  const weekPct = Math.round((weekScore / weekTotal) * 100);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.getDate();
  };

  const monthLabel = () => {
    const d = new Date(weekDates[0]);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#e8e8f0",
      fontFamily: "'DM Mono', 'Fira Code', monospace",
      padding: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 2px; }

        .habit-check {
          width: 32px; height: 32px;
          border-radius: 6px;
          border: 1.5px solid #2a2a3a;
          background: transparent;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }
        .habit-check:hover { border-color: #555; transform: scale(1.05); }
        .habit-check.done { border-color: transparent; }

        .cat-pill {
          padding: 5px 14px;
          border-radius: 20px;
          border: 1px solid #2a2a3a;
          background: transparent;
          color: #888;
          font-size: 11px;
          font-family: 'DM Mono', monospace;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .cat-pill:hover { border-color: #555; color: #ccc; }
        .cat-pill.active { background: #e8e8f0; color: #0a0a0f; border-color: #e8e8f0; }

        .view-btn {
          padding: 6px 18px;
          border-radius: 6px;
          border: 1px solid #2a2a3a;
          background: transparent;
          color: #666;
          font-size: 11px;
          font-family: 'DM Mono', monospace;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .view-btn.active { background: #1a1a2a; color: #e8e8f0; border-color: #3a3a5a; }

        .nav-btn {
          width: 32px; height: 32px;
          border-radius: 6px;
          border: 1px solid #2a2a3a;
          background: transparent;
          color: #888;
          font-size: 16px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .nav-btn:hover { border-color: #555; color: #ccc; }

        .habit-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-radius: 8px;
          transition: background 0.15s;
        }
        .habit-row:hover { background: #111118; }

        .progress-bar {
          height: 3px;
          background: #1a1a2a;
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.4s ease;
        }

        .day-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          min-width: 36px;
        }
        .day-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          margin-top: 2px;
        }

        .streak-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 500;
          background: #1a1a2a;
          color: #888;
        }

        .stat-card {
          background: #0e0e18;
          border: 1px solid #1e1e2e;
          border-radius: 12px;
          padding: 16px 20px;
        }

        .today-card {
          border-radius: 10px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.15s;
          border: 1px solid transparent;
        }
        .today-card:hover { filter: brightness(1.1); }
        .today-card.done { border-color: rgba(255,255,255,0.1); }

        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .pop { animation: popIn 0.2s ease; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#0a0a0f", borderBottom: "1px solid #1a1a2a", padding: "20px 24px 16px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>
                HABIT<span style={{ color: "#4ade80" }}>OS</span>
              </div>
              <div style={{ fontSize: 11, color: "#444", letterSpacing: "0.1em", marginTop: 2 }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }).toUpperCase()}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: todayScore === habits.length ? "#4ade80" : "#fff", fontFamily: "'Syne', sans-serif" }}>
                  {todayScore}<span style={{ fontSize: 13, color: "#444" }}>/{habits.length}</span>
                </div>
                <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.08em" }}>TODAY</div>
              </div>
              <div style={{ width: 1, height: 32, background: "#1a1a2a" }} />
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#60a5fa", fontFamily: "'Syne', sans-serif" }}>
                  {weekPct}<span style={{ fontSize: 13, color: "#444" }}>%</span>
                </div>
                <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.08em" }}>THIS WEEK</div>
              </div>
            </div>
          </div>

          {/* View toggle */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            <button className={`view-btn ${view === "week" ? "active" : ""}`} onClick={() => setView("week")}>Week</button>
            <button className={`view-btn ${view === "today" ? "active" : ""}`} onClick={() => setView("today")}>Today</button>
          </div>

          {/* Category filter */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
            {categories.map(cat => (
              <button key={cat} className={`cat-pill ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px 40px" }}>

        {/* Week view */}
        {view === "week" && (
          <>
            {/* Week navigation */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <button className="nav-btn" onClick={() => setWeekOffset(w => w - 1)}>←</button>
              <div style={{ fontSize: 12, color: "#666", letterSpacing: "0.06em", flex: 1, textAlign: "center", textTransform: "uppercase" }}>
                {monthLabel()}  {weekOffset === 0 ? "· Current Week" : weekOffset === -1 ? "· Last Week" : ""}
              </div>
              <button className="nav-btn" onClick={() => setWeekOffset(w => Math.min(0, w + 1))} style={{ opacity: weekOffset >= 0 ? 0.3 : 1 }}>→</button>
            </div>

            {/* Week progress bar */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: "#555", letterSpacing: "0.06em" }}>WEEKLY COMPLETION</span>
                <span style={{ fontSize: 11, color: "#60a5fa" }}>{weekScore} / {weekTotal}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${weekPct}%`, background: "linear-gradient(90deg, #60a5fa, #a78bfa)" }} />
              </div>
            </div>

            {/* Per-category groups */}
            {Object.keys(categoryColors).filter(cat => activeCategory === "All" || cat === activeCategory).map(cat => {
              const catHabits = filteredHabits.filter(h => h.category === cat);
              if (!catHabits.length) return null;
              const col = categoryColors[cat];

              return (
                <div key={cat} style={{ marginBottom: 24, background: "#0d0d14", borderRadius: 12, overflow: "hidden", border: "1px solid #1a1a2a" }}>
                  {/* Category header */}
                  <div style={{ padding: "10px 16px", background: col.bg, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: col.accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>{cat}</span>
                    {/* Day headers */}
                    <div style={{ display: "flex", gap: 4 }}>
                      {weekDates.map((d, i) => (
                        <div key={d} className="day-col" style={{ minWidth: 32 }}>
                          <span style={{ fontSize: 9, color: d === todayStr ? col.accent : "#444", letterSpacing: "0.05em", fontWeight: d === todayStr ? 600 : 400 }}>{DAYS[i]}</span>
                          <span style={{ fontSize: 10, color: d === todayStr ? col.light : "#333" }}>{formatDate(d)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Habits */}
                  {catHabits.map((habit, idx) => {
                    const rowScore = weekDates.filter(d => isDone(habit.id, d)).length;
                    return (
                      <div key={habit.id} className="habit-row" style={{ borderTop: idx > 0 ? "1px solid #111118" : "none" }}>
                        <span style={{ fontSize: 16, width: 24, textAlign: "center", flexShrink: 0 }}>{habit.icon}</span>
                        <span style={{ fontSize: 13, color: "#bbb", flex: 1, minWidth: 100 }}>{habit.label}</span>
                        <span style={{ fontSize: 10, color: "#444", minWidth: 30, textAlign: "right" }}>{rowScore}/7</span>
                        <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
                          {weekDates.map(d => {
                            const done = isDone(habit.id, d);
                            const isToday = d === todayStr;
                            return (
                              <button key={d} className={`habit-check ${done ? "pop done" : ""}`}
                                style={{
                                  background: done ? col.bg : "transparent",
                                  borderColor: done ? col.accent : isToday ? "#3a3a5a" : "#1e1e2e",
                                  boxShadow: done ? `0 0 8px ${col.accent}40` : "none",
                                  minWidth: 32,
                                }}
                                onClick={() => toggle(habit.id, d)}>
                                {done && <span style={{ color: col.accent, fontSize: 14 }}>✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </>
        )}

        {/* Today view */}
        {view === "today" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#fff" }}>Today's Habits</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{todayScore} of {habits.filter(h => activeCategory === "All" || h.category === activeCategory).length} complete</div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: todayScore === habits.length ? "#4ade80" : "#fff" }}>
                {Math.round((todayScore / habits.length) * 100)}%
              </div>
            </div>

            {/* Overall today progress */}
            <div className="progress-bar" style={{ marginBottom: 24, height: 6 }}>
              <div className="progress-fill" style={{ width: `${(todayScore / habits.length) * 100}%`, background: "linear-gradient(90deg, #4ade80, #60a5fa)" }} />
            </div>

            {Object.keys(categoryColors).filter(cat => activeCategory === "All" || cat === activeCategory).map(cat => {
              const catHabits = filteredHabits.filter(h => h.category === cat);
              if (!catHabits.length) return null;
              const col = categoryColors[cat];
              const catDone = catHabits.filter(h => isDone(h.id, todayStr)).length;

              return (
                <div key={cat} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 10, color: col.accent, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>{cat}</span>
                    <div style={{ flex: 1, height: 1, background: "#1a1a2a" }} />
                    <span style={{ fontSize: 10, color: "#444" }}>{catDone}/{catHabits.length}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
                    {catHabits.map(habit => {
                      const done = isDone(habit.id, todayStr);
                      return (
                        <div key={habit.id} className={`today-card ${done ? "done" : ""}`}
                          style={{
                            background: done ? col.bg : "#0d0d14",
                            borderColor: done ? col.accent + "60" : "#1a1a2a",
                          }}
                          onClick={() => toggle(habit.id, todayStr)}>
                          <span style={{ fontSize: 20 }}>{habit.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, color: done ? col.light : "#aaa", fontWeight: done ? 500 : 400 }}>{habit.label}</div>
                          </div>
                          <div style={{
                            width: 20, height: 20, borderRadius: 4,
                            background: done ? col.accent : "transparent",
                            border: `1.5px solid ${done ? col.accent : "#2a2a3a"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, color: "#0a0a0f", flexShrink: 0,
                          }}>
                            {done && "✓"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
