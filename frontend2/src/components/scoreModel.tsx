export default function scoreModel() {
    return (
        <div
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center select-none"
            id="gameModal"
        >
            <div
                className="backdrop-blur-md text-black bg-green-500/10 dark:text-white dark:bg-white/10 max-w-md w-full p-12 rounded-lg text-center"
            >
                <h1 className="text-7xl leading-none font-bold" id="endScore">0</h1>
                <p className="mb-4 text-sm text-gray-800 dark:text-gray-300">Points</p>
                <p className="text-red-500 text-xl hidden" id="lostElement">YOU LOST</p>
                <p className="text-green-500 text-xl hidden" id="wonElement">YOU WON</p>
                <div>
                    <button
                        className="w-full rounded-full bg-green-500/50 dark:bg-black/50 p-3"
                        id="singlePlayer"
                    >
                        SinglePlayer
                    </button>
                    <button
                        className="w-full rounded-full bg-green-500/50 dark:bg-black/50 p-3 mt-4"
                        id="multiPlayer"
                    >
                        MultiPlayer
                    </button>
                </div>
            </div>
        </div>
    )
}


