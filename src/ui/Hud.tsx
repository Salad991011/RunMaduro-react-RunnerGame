import { useGame } from "../game/store";

function fmt(n: number) {
  return Math.floor(n).toLocaleString();
}

export function Hud() {
  const phase = useGame((s) => s.phase);
  const score = useGame((s) => s.score);
  const coins = useGame((s) => s.coins);
  const bankCoins = useGame((s) => s.bankCoins);
  const speed = useGame((s) => s.speed);

  const start = useGame((s) => s.start);
  const restart = useGame((s) => s.restart);
  const setPhase = useGame((s) => s.setPhase);

  // Placeholder economy action:
  // When a run ends, we can "bank" the run coins.
  const commitRunCoinsToBank = useGame((s) => s.commitRunCoinsToBank);

  const doRestart = () => {
    // Restart already clears collision worlds + resets run state in the store.
    restart();
    setPhase("running");
  };

  const doStart = () => {
    start();
  };

  const doBankAndRestart = () => {
    // Save run coins to persistent bank (future upgrades/skins etc.)
    commitRunCoinsToBank();

    // Start a fresh run
    doRestart();
  };

  return (
    <div className="hud">
      <div className="hud__top">
        <div className="hud__pill">Score: {fmt(score)}</div>
        <div className="hud__pill">Run Coins: {coins}</div>
        <div className="hud__pill">Bank: {fmt(bankCoins)}</div>
        <div className="hud__pill">Speed: {speed.toFixed(1)}</div>
      </div>

      {phase === "menu" ? (
        <div className="hud__center">
          <div className="hud__title">Subway React Runner (Starter)</div>
          <div className="hud__hint">A/D or ←/→ lanes • Space/↑ jump • ↓ roll</div>
          <button className="btn" onClick={doStart}>
            Start
          </button>
        </div>
      ) : null}

      {phase === "paused" ? (
        <div className="hud__center">
          <div className="hud__title">Paused</div>
          <div className="hud__hint">Press P to resume</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button className="btn" onClick={() => setPhase("running")}>
              Resume
            </button>
            <button className="btn" onClick={doRestart}>
              Restart
            </button>
          </div>
        </div>
      ) : null}

      {phase === "gameover" ? (
        <div className="hud__center">
          <div className="hud__title">Game Over</div>
          <div className="hud__hint">
            Score: {fmt(score)} • Run Coins: {coins} • Bank: {fmt(bankCoins)}
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            {/* For progression testing */}
            <button className="btn" onClick={doBankAndRestart}>
              Bank Coins + Restart
            </button>

            {/* Classic restart without banking */}
            <button className="btn" onClick={doRestart}>
              Restart
            </button>
          </div>
        </div>
      ) : null}

      {phase === "running" ? (
        <div className="hud__bottom" style={{ display: "flex", gap: 10 }}>
          <button className="btn btn--ghost" onClick={() => setPhase("paused")}>
            Pause (P)
          </button>

          {/* Restart button next to Pause for fast testing */}
          <button className="btn btn--ghost" onClick={doRestart}>
            Restart
          </button>
        </div>
      ) : null}
    </div>
  );
}
