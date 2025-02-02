import { Link } from "react-router-dom"
import gameImg from "../assets/game.webp"
import logo from "../assets/logo.png"
import { useEffect } from "react"
import gsap from "gsap"

export default function Landing() {
    useEffect(() => {
        gsap.to('.slideRight', {
            opacity: 1,
            x: 0,
            duration: 1
        })

        gsap.to('.opacityAnimation5', {
            opacity: 1,
            duration: 5,
        })
        gsap.to('.opacityAnimation4', {
            opacity: 0.2,
            duration: 4,
        })
        gsap.to('.slideUp', {
            opacity: 1,
            duration: 1,
            y: 0
        })
    }, [])

    return (
        <div className="w-full h-[100svh] relative bg-black">
            <div className='w-full h-full absolute '>
                <img src={gameImg} alt="Loading..." className="object-cover w-full h-full opacity-0  opacityAnimation4" />
            </div>
            <div className=" flex p-3 items-center gap-2 relative -translate-x-10 opacity-0 slideRight ">
                <div className="bg-blacks relative">
                    <img src={logo} alt="logo" width={50} height={50} className="opacity-90" />
                </div>
                <h3 className="text-white">Epic Shoot</h3>
            </div>

            <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-white " >
                <h1 className="text-4xl text-white font-extrabold opacity-0 opacityAnimation5">A Neon Battlefield Where Only the Fastest Survive!</h1>
                <div className="flex justify-center">
                    <Link to={'/game'} >
                        <button className="bg-black/50 mt-5 cursor-pointer hover:bg-black py-2 px-12 rounded-lg opacity-0 translate-y-10 slideUp ">Play Now</button>
                    </Link>

                </div>
            </div>

        </div>

    )
}
