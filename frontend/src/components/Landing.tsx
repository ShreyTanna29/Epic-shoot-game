import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import Game from "../gameLogic/game";
import {
  Settings,
  Play,
  Users,
  User,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Link } from "react-router-dom";
import { auto, scale } from "@cloudinary/url-gen/actions/resize";
import { cld } from "../utils/cloudinary";

export default function Landing() {
  const [showGameMode, setShowGameMode] = useState(false);
  const [gameMode, setGameMode] = useState<
    "singlePlayer" | "multiPlayer" | null
  >(null);
  const [playingGame, setPlayingGame] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [playerName, setPlayerName] = useState<string>("");
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create particles for background effect
    if (particlesRef.current) {
      const particleCount = window.innerWidth < 768 ? 30 : 50; // Fewer particles on mobile
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particlesRef.current.appendChild(particle);
      }
    }

    // Initial animations
    gsap.to(".logo-container", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
    });

    gsap.to(".game-title", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
      delay: 0.5,
    });

    gsap.to(".game-subtitle", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.7,
    });

    gsap.to(".cta-button", {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
      delay: 0.9,
    });

    gsap.to(".settings-button", {
      opacity: 1,
      x: 0,
      duration: 0.5,
      delay: 0.5,
    });

    // Audio setup
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, []);

  useEffect(() => {
    if (showGameMode) {
      gsap.fromTo(
        ".game-mode-container",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      gsap.to(".game-mode-option", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: "back.out(1.7)",
      });
    }
  }, [showGameMode]);

  // Background image
  const bgimg = cld
    .image("landing-bg")
    .format("auto")
    .quality("auto")
    .resize(auto());

  const gameImg = bgimg.toURL();

  // Logo
  const logoimg = cld
    .image("logo")
    .format("auto")
    .quality("auto")
    .resize(scale().width(80));

  const logo = logoimg.toURL();

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const handleMultiplayerMode = () => {
    setPlayingGame(true);
    setGameMode("multiPlayer");
  };

  return (
    <>
      {!playingGame && (
        <div className="w-full h-[100svh] relative bg-black overflow-hidden">
          {/* Audio element */}
          <audio
            ref={audioRef}
            src="/bg.mp3"
            loop
            autoPlay
            muted={muted}
            preload="auto"
          />

          {/* Animated particles background */}
          <div ref={particlesRef} className="absolute inset-0 z-10"></div>

          {/* Background image with overlay */}
          <div className="w-full h-full absolute z-0">
            <img
              src={gameImg}
              alt="Epic Shoot Background"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-purple-900/30 z-0"></div>
          </div>

          {/* Header with logo and settings */}
          <div className="absolute top-0 left-0 w-full p-3 sm:p-5 flex items-center justify-between z-20">
            <div className="logo-container flex items-center gap-2 sm:gap-3 opacity-0 translate-y-[-20px]">
              <div className="relative">
                <img
                  src={logo}
                  alt="Epic Shoot Logo"
                  width={60}
                  height={60}
                  className="opacity-90 w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[80px] md:h-[80px]"
                />
              </div>
              <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold tracking-wider">
                EPIC<span className="text-purple-500">SHOOT</span>
              </h3>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={toggleMute}
                className="text-white hover:text-purple-400 transition-colors duration-300 settings-button opacity-0 translate-x-5 cursor-pointer"
              >
                {muted ? (
                  <VolumeX size={20} className="sm:size-6" />
                ) : (
                  <Volume2 size={20} className="sm:size-6" />
                )}
              </button>

              <Link
                to="/settings"
                className="settings-button opacity-0 translate-x-5"
              >
                <Settings
                  className="text-white hover:text-purple-400 transition-colors duration-300 sm:size-6"
                  size={20}
                  strokeWidth={2}
                />
              </Link>
            </div>
          </div>

          {/* Main content */}
          <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-white z-20 w-full max-w-3xl px-4">
            {!showGameMode ? (
              <div className="text-center">
                <h1 className="game-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 sm:mb-4 opacity-0 translate-y-10">
                  <span className="text-white">EPIC SHOOT</span>
                </h1>
                <p className="game-subtitle text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-4 sm:mb-6 md:mb-8 opacity-0 translate-y-10">
                  A Neon Battlefield Where Only the Fastest Survive!
                </p>
                <button
                  onClick={() => setShowGameMode(true)}
                  className="cta-button opacity-0 translate-y-10 bg-gradient-to-r py-2 sm:py-3 px-6 sm:px-10 rounded-full text-base sm:text-lg font-bold tracking-wider cursor-pointer bg-black transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center gap-2">
                    PLAY NOW <Play size={16} className="sm:size-6" />
                  </span>
                </button>
              </div>
            ) : (
              <div className="game-mode-container">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 md:mb-8">
                  SELECT GAME MODE
                </h2>

                {!showNameModal ? (
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    <button
                      onClick={() => {
                        setPlayingGame(true);
                        setGameMode("singlePlayer");
                      }}
                      className="game-mode-option opacity-0 translate-y-10 bg-black/40 backdrop-blur-md border border-purple-500/30 p-4 sm:p-6 md:p-8 rounded-xl hover:bg-purple-900/20 transition-all duration-300 group"
                    >
                      <div className="flex flex-col items-center gap-3 sm:gap-4 cursor-pointer">
                        <User
                          size={36}
                          className="text-purple-400 group-hover:scale-110 transition-transform duration-300"
                        />
                        <span className="text-lg sm:text-xl font-bold">
                          SINGLE PLAYER
                        </span>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          Challenge yourself in solo mode
                        </p>
                        <ChevronRight className="mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setShowNameModal(true);
                        setGameMode("multiPlayer");
                      }}
                      className="game-mode-option opacity-0 translate-y-10 bg-black/40 backdrop-blur-md border border-pink-500/30 p-4 sm:p-6 md:p-8 rounded-xl hover:bg-pink-900/20 transition-all duration-300 group"
                    >
                      <div className="flex flex-col items-center gap-3 sm:gap-4 cursor-pointer">
                        <Users
                          size={36}
                          className="text-pink-400 group-hover:scale-110 transition-transform duration-300"
                        />
                        <span className="text-lg sm:text-xl font-bold">
                          MULTI PLAYER
                        </span>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          Battle against other players
                        </p>
                        <ChevronRight className="mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="name-modal bg-black/60 backdrop-blur-md border border-purple-500/30 p-4 sm:p-6 md:p-8 rounded-xl max-w-md mx-auto">
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center">
                      Enter Your Callsign
                    </h3>
                    <input
                      autoFocus
                      className="w-full rounded-lg px-3 sm:px-4 py-2 sm:py-3 mt-2 bg-black/50 border border-purple-500/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                      type="text"
                      placeholder="Your name (max 20 chars)"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      onKeyDown={(key) => {
                        if (
                          key.key === "Enter" &&
                          playerName.trim() !== "" &&
                          playerName.length <= 20
                        ) {
                          handleMultiplayerMode();
                        }
                      }}
                      maxLength={20}
                    />
                    <div className="mt-4 sm:mt-6 flex gap-3 sm:gap-4">
                      <button
                        onClick={() => setShowNameModal(false)}
                        className="flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg border border-gray-500 text-gray-300 hover:bg-gray-800 transition-colors duration-300 text-sm sm:text-base"
                      >
                        Back
                      </button>
                      <button
                        disabled={
                          playerName.trim() === "" || playerName.length > 20
                        }
                        onClick={() => handleMultiplayerMode()}
                        className="flex-1 py-2 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-sm sm:text-base"
                      >
                        ENTER BATTLE
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="absolute bottom-2 sm:bottom-4 left-0 w-full text-center text-gray-500 text-xs sm:text-sm z-20">
            © 2023 Epic Shoot | All Rights Reserved
          </div>
        </div>
      )}

      {playingGame && <Game playerName={playerName} gameMode={gameMode} />}

      <style>{`
        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: float linear infinite;
        }
        
        @media (min-width: 768px) {
          .particle {
            width: 3px;
            height: 3px;
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(100px);
            opacity: 0;
          }
        }
        
                /* Mobile optimizations */
        @media (max-width: 640px) {
          .particle {
            width: 2px;
            height: 2px;
          }
          
          @keyframes float {
            0% {
              transform: translateY(0) translateX(0);
              opacity: 0;
            }
            10% {
              opacity: 0.8;
            }
            90% {
              opacity: 0.8;
            }
            100% {
              transform: translateY(-100vh) translateX(50px);
              opacity: 0;
            }
          }
        }
      `}</style>
    </>
  );
}
