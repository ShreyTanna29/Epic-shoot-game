import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Game from "./gameLogic/game";
import Settings from "./components/settings";
import Landing from "./components/Landing";
import { useEffect } from "react";
import { avatars } from "./assets/avatars/index";

function App() {
  useEffect(() => {
    avatars.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* <Route path="/game" element={<Game gameMode={n} />} /> */}
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
