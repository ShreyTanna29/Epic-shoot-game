import gameImg from "../assets/game.webp";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import gsap from "gsap";
import Game from "../gameLogic/game";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  const [showGameMode, setShowGameMode] = useState(false);
  const [gameMode, setGameMode] = useState<
    "singlePlayer" | "multiPlayer" | null
  >(null);
  const [playingGame, setPlayingGame] = useState(false);
  useEffect(() => {
    gsap.to(".slideRight", {
      opacity: 1,
      x: 0,
      duration: 1,
    });

    gsap.to(".opacityAnimation5", {
      opacity: 1,
      duration: 5,
    });
    gsap.to(".opacityAnimation4", {
      opacity: 0.2,
      duration: 4,
    });
    gsap.to(".slideUp", {
      opacity: 1,
      duration: 1,
      y: 0,
    });
    gsap.to(".gameMode", {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.2,
    });
  }, [showGameMode]);

  return (
    <>
      {!playingGame && (
        <div className="w-full h-[100svh] relative bg-black">
          <div className="w-full h-full absolute ">
            <img
              src={gameImg}
              alt="Loading..."
              className="object-cover w-full h-full opacity-0  opacityAnimation4"
            />
          </div>
          <div className=" flex p-3 items-center relative -translate-x-10 opacity-0 slideRight ">
            <div className="flex items-center gap-2">
              <div className="bg-blacks relative">
                <img
                  src={logo}
                  alt="logo"
                  width={50}
                  height={50}
                  className="opacity-90"
                />
              </div>
              <h3 className="text-white">Epic Shoot</h3>
            </div>
            {showGameMode && (
              <div className="ml-auto bg-black/10 ">
                <Link to={"/settings"}>
                  <Settings className="text-white" />
                </Link>
              </div>
            )}
          </div>

          <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-white ">
            <h1
              className={` ${
                showGameMode ? "hidden lg:block " : "block"
              } text-4xl text-white font-extrabold opacity-0 opacityAnimation5`}
            >
              A Neon Battlefield Where Only the Fastest Survive!
            </h1>
            <div className="flex justify-center">
              {!showGameMode && (
                <button
                  onClick={() => setShowGameMode(true)}
                  className="bg-black/50 mt-5 cursor-pointer hover:bg-black py-2 px-12 rounded-lg opacity-0 translate-y-10 slideUp "
                >
                  Play Now
                </button>
              )}

              {showGameMode && (
                <div className="mt-4 flex flex-wrap gap-10">
                  <button
                    onClick={() => {
                      setPlayingGame(true);
                      setGameMode("singlePlayer");
                    }}
                    className="bg-white/10 p-10 rounded-lg cursor-pointer opacity-0 translate-y-10 gameMode"
                  >
                    SinglePlayer
                  </button>

                  <button
                    onClick={() => {
                      setPlayingGame(true);
                      setGameMode("multiPlayer");
                    }}
                    className="bg-white/10 p-10 rounded-lg cursor-pointer opacity-0 translate-y-10 gameMode"
                  >
                    MultiPlayer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {playingGame && <Game gameMode={gameMode} />}
    </>
  );
}
