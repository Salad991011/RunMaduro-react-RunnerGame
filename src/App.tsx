import "./App.css";
import GameRoot from "./game/GameRoot";
import { Hud } from "./ui/Hud";

export default function App() {
  return (
    <div className="app">
      <GameRoot />
      <Hud />
    </div>
  );
}
