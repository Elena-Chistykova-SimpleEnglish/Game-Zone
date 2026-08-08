"use client";

import { useEffect, useRef, useState } from "react";

type GameId = "ninja" | "monster" | "race";

const games = [
  { id: "ninja" as const, title: "Shadow Dash", genre: "Adventure", image: "/shadow-dash.png", accent: "#ff0a8a", icon: "✦" },
  { id: "monster" as const, title: "Monster Mix", genre: "Puzzle", image: "/monster-mix.png", accent: "#ffc914", icon: "⚗" },
  { id: "race" as const, title: "Turbo League", genre: "Racing", image: "/turbo-league.png", accent: "#086cff", icon: "⚑" },
];

export default function Home() {
  const [active, setActive] = useState<GameId | null>(null);

  useEffect(() => {
    const close = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Play Zone — на главную">
          <span className="brand-top">PLAY</span><span className="brand-bottom">ZONE</span><i>⚡</i>
        </a>
        <nav aria-label="Главное меню">
          <a className="active" href="#top">Главная</a><a href="#games">Игры</a><a href="#games">Моя коллекция</a><a href="#about">Достижения</a>
        </nav>
        <div className="level"><span>★</span><b>LEVEL UP<br /><em>TOGETHER!</em></b></div>
      </header>

      <section className="hero" id="top">
        <div className="burst burst-left" /><div className="burst burst-right" />
        <p className="eyebrow">Три мира. Один клик.</p>
        <h1><span>GAME</span> <strong>ON!</strong></h1>
        <p className="intro">Выбирай игру, жми на карточку — и начинай играть прямо сейчас.</p>
      </section>

      <section className="game-grid" id="games" aria-label="Доступные игры">
        {games.map((game, index) => (
          <article className={`game-card card-${index + 1}`} key={game.id} style={{ "--accent": game.accent } as React.CSSProperties}>
            <button className="cover" onClick={() => setActive(game.id)} aria-label={`Запустить игру ${game.title}`}>
              <img src={game.image} alt={`Обложка игры ${game.title}`} />
              <span className="cover-shine" />
            </button>
            <div className="card-copy">
              <p className="genre"><span>{game.icon}</span>{game.genre}</p>
              <h2>{game.title}</h2>
              <button className="play" onClick={() => setActive(game.id)}><span>▶</span> Играть</button>
            </div>
          </article>
        ))}
      </section>

      <footer id="about"><span>© 2026 PLAY ZONE</span><p>Сделано для тех, кто всегда готов к следующему раунду.</p><a href="#top">Наверх ↑</a></footer>
      {active && <GameModal game={active} onClose={() => setActive(null)} />}
    </main>
  );
}

function GameModal({ game, onClose }: { game: GameId; onClose: () => void }) {
  const config = games.find((item) => item.id === game)!;
  return <div className="modal" role="dialog" aria-modal="true" aria-label={`Игра ${config.title}`}>
    <div className="modal-bar"><b>{config.title}</b><button onClick={onClose} aria-label="Закрыть игру">×</button></div>
    {game === "ninja" && <NinjaGame />}{game === "monster" && <MonsterGame />}{game === "race" && <RaceGame />}
  </div>;
}

function NinjaGame() {
  const [lane, setLane] = useState(1); const [score, setScore] = useState(0); const [playing, setPlaying] = useState(false);
  useEffect(() => { if (!playing) return; const t = setInterval(() => setScore(s => s + 10), 500); return () => clearInterval(t); }, [playing]);
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === "ArrowLeft") setLane(v => Math.max(0, v - 1)); if (e.key === "ArrowRight") setLane(v => Math.min(2, v + 1)); }; addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, []);
  return <div className="mini ninja-game"><div className="hud">ОЧКИ <b>{score}</b></div><div className={`runner lane-${lane}`}>🥷</div>{playing && <><i className="obstacle o1">✦</i><i className="obstacle o2">✦</i></>}<div className="road-lines" /><div className="controls"><button onClick={() => setLane(v => Math.max(0, v - 1))}>←</button><button className="start" onClick={() => setPlaying(!playing)}>{playing ? "ПАУЗА" : "СТАРТ"}</button><button onClick={() => setLane(v => Math.min(2, v + 1))}>→</button></div></div>;
}

const colors = ["#ff0a8a", "#ffc914", "#086cff"];
function MonsterGame() {
  const [goal, setGoal] = useState(0); const [score, setScore] = useState(0); const [message, setMessage] = useState("Смешай нужный цвет!");
  const pick = (i: number) => { if (i === goal) { setScore(s => s + 1); setMessage("БАМ! Идеальная смесь!"); setGoal(Math.floor(Math.random() * 3)); } else setMessage("Упс! Попробуй другой флакон"); };
  return <div className="mini mix-game"><div className="hud">СМЕСИ <b>{score}</b></div><div className="lab-monster">👾</div><p>{message}</p><div className="target">ЦЕЛЬ <span style={{ background: colors[goal] }} /></div><div className="bottles">{colors.map((c, i) => <button key={c} onClick={() => pick(i)} style={{ "--potion": c } as React.CSSProperties}>⚗</button>)}</div></div>;
}

function RaceGame() {
  const [speed, setSpeed] = useState(0); const [distance, setDistance] = useState(0); const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => { if (speed > 0) timer.current = setInterval(() => setDistance(d => Math.min(100, d + speed / 25)), 160); return () => { if (timer.current) clearInterval(timer.current); }; }, [speed]);
  return <div className="mini race-game"><div className="hud">ТРАССА <b>{Math.round(distance)}%</b></div><div className="track"><div className="race-car" style={{ left: `${Math.min(distance, 88)}%` }}>🏎️</div><div className="finish">▥</div></div><div className="speedo"><b>{speed}</b><span>КМ/Ч</span></div><button className="gas" onPointerDown={() => setSpeed(220)} onPointerUp={() => setSpeed(0)} onPointerLeave={() => setSpeed(0)}>ЖМИ ГАЗ!</button>{distance >= 100 && <div className="win">ФИНИШ! 🏁</div>}</div>;
}
