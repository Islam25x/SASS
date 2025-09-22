import { useEffect } from "react"
import LoaderCanvas from "./LoaderCanvas"
import Typewriter from "typewriter-effect"


type LoaderProps = {
    onFinish: () => void;
};

const Loader: React.FC<LoaderProps> = ({ onFinish }) => {


    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-b from-gray-400 via-gray-500 to-gray-600 text-white">
            {/* 3D Model */}
            <div className="flex items-center justify-center w-full">
                <div className="w-[365px] h-[365px]">
                    <LoaderCanvas />
                </div>
            </div>

            {/* Logo / Brand */}
            <h1 className="text-3xl font-bold mt-[-4rem] tracking-wide">Finexa</h1>

            {/* Typewriter slogan */}
            <div className="text-md text-gray-400 mt-2">
                <Typewriter
                    options={{
                        strings: [
                            "Finance, Next Generation.",
                            "Smart Wealth. High Resolution.",
                        ],
                        autoStart: true,
                        loop: true,
                        delay: 20,
                        deleteSpeed: 60
                    }}
                />
            </div>

            {/* Loading dots */}
            <div className="mt-6 flex space-x-2">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-bounce" />
                <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-bounce delay-150" />
                <span className="w-2.5 h-2.5 bg-red-400 rounded-full animate-bounce delay-300" />
            </div>
        </div>
    )
}

export default Loader