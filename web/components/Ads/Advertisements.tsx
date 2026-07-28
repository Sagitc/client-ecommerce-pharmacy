const defaultStyles = "w-full max-w-6xl mx-auto "

export function Ads1() {
    return (
        <section className={defaultStyles + "flex flex-col gap-4"}>
            <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-lg text-center font-semibold text-gray-500 dark:text-gray-400">
                    Anúncio 1<br/>
                </span>
            </div>
        </section>
    )
}

export function Ads2() {
    return (
        <section className={defaultStyles + "grid grid-cols-1 md:grid-cols-2 gap-4"}>
            <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-lg text-center font-semibold text-gray-500 dark:text-gray-400">
                    Anúncio 2<br/>
                    
                </span>
            </div>
            <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-lg text-center font-semibold text-gray-500 dark:text-gray-400">
                    Anúncio 3<br/>

                </span>
            </div>
        </section>
    )   
}

export function Ads3() {
    return (
        <section className={defaultStyles + "flex flex-col gap-4"}>
            <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-lg text-center font-semibold text-gray-500 dark:text-gray-400">
                    Anúncio 4<br/>
                </span>
            </div>
        </section>
    )
}