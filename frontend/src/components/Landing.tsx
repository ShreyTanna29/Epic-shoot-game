import { Link } from "react-router-dom"
import gameImg from "../assets/game.webp"
import logo from "../assets/logo.png"

export default function Landing() {
    return (
        <div className="w-full h-[100svh] relative">
            <div className='w-full h-full absolute'>
                <img src={gameImg} alt="Loading..." className="object-cover w-full h-full opacity-20 " />
            </div>
            <div className=" flex p-3 items-center gap-2 relative ">
                <div className="bg-blacks relative">
                    <img src={logo} alt="logo" width={50} height={50} className="opacity-90" />
                </div>
                <h3 className="text-white">Epic Shoot</h3>
            </div>

            <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-white  " >
                <h1 className="text-4xl font-extrabold ">A Neon Battlefield Where Only the Fastest Survive!</h1>
                <div className="flex justify-center">
                    <Link to={'/game'} >
                        <button className="bg-white/10 mt-5 cursor-pointer hover:bg-white/40 py-2 px-12 rounded-lg  ">Play Now</button>
                    </Link>

                </div>
            </div>

        </div>

    )
}
