import { BrowserRouter, Route, Routes } from "react-router-dom";
import Settings from "./components/settings";
import Landing from "./components/Landing";

function App() {
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
