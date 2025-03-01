import { ArrowLeft, Monitor, Moon, Sun } from "lucide-react";
import { images } from "../assets/avatars/index";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const currentTheme = localStorage.theme ? localStorage.theme : "system";
  const [theme, setTheme] = useState<"light" | "dark" | "system">(currentTheme);
  const a1 = images[0];
  const currentAvatar = localStorage.avatar || a1;
  const [avatar, setAvatar] = useState<string>(currentAvatar);

  const navigate = useNavigate();

  useEffect(() => {
    switch (localStorage.theme) {
      case "light": {
        if (document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.remove("dark");
        }
        break;
      }
      case "dark": {
        if (!document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.add("dark");
        }
        break;
      }
      case "system": {
        if (window.matchMedia("(prefers-color-scheme: dark)")) {
          if (!document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.add("dark");
          }
        } else {
          if (document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.remove("dark");
          }
        }
      }
    }
  }, []);

  const changeTheme = (newTheme: "light" | "dark" | "system") => {
    switch (newTheme) {
      case "light": {
        if (document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.remove("dark");
          localStorage.theme = "light";
          setTheme("light");
        }
        break;
      }
      case "dark": {
        if (!document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.add("dark");
          localStorage.theme = "dark";
          setTheme("dark");
        } else {
          setTheme("dark");
        }
        break;
      }
      case "system": {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        localStorage.theme = "system";
        setTheme("system");
      }
    }
  };
  const avatars = images;

  const changeAvatar = (newAvatar: string) => {
    setAvatar(newAvatar);
    localStorage.avatar = newAvatar;
  };

  return (
    <div className="w-full h-[100svh] flex justify-center items-center dark:text-white ">
      <div className=" w-full h-full md:w-[50%] md:h-[50%] bg-black/10 dark:bg-white/10 rounded-lg p-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-black/10 dark:bg-white/10 font-bold p-2 rounded-sm cursor-pointer"
        >
          <ArrowLeft />
        </button>
        <div className="text-center">
          <h2 className="text-3xl font-bold">Themes</h2>
          <div className="flex items-center justify-center gap-6 mt-4">
            <button
              className={`${
                theme === "light" ? "border" : null
              } bg-black/10 dark:bg-white/10 p-2 rounded-md cursor-pointer`}
              onClick={() => changeTheme("light")}
            >
              <Sun />
            </button>
            <button
              className={`${
                theme === "dark" ? "border" : null
              } bg-black/10 dark:bg-white/10 p-2 rounded-md cursor-pointer`}
              onClick={() => changeTheme("dark")}
            >
              <Moon />
            </button>
            <button
              className={`${
                theme === "system" ? "border" : null
              } bg-black/10 dark:bg-white/10 p-2 rounded-md cursor-pointer`}
              onClick={() => changeTheme("system")}
            >
              <Monitor />
            </button>
          </div>
        </div>
        <div className="mt-6 text-center">
          <h2 className="text-3xl font-bold">Avatars</h2>
          <div className="flex items-center gap-4 justify-center mt-4 max-w-full md:max-w-[50%] flex-wrap mx-auto">
            {avatars.map((a) => (
              <picture>
                <img
                  src={a}
                  key={a}
                  width={40}
                  height={40}
                  loading="lazy"
                  className={`cursor-pointer  ${
                    avatar === a ? "border" : null
                  }`}
                  onClick={() => changeAvatar(a)}
                />
              </picture>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
