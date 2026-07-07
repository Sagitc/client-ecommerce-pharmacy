"use client";

import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Spinner } from "./ui/spinner";
import { Search } from "lucide-react";

export function HeaderMain() {

    const [isSearching, setIsSearching] = useState(false);

    return (
        <header className="w-full px-4 py-2 bg-red-700 dark:bg-gray-800 text-white">
            <div className="flex items-center justify-between w-full h-12 max-w-6xl mx-auto">
                <span>Logo</span>

                <div className="flex items-center w-full max-w-sm">

                    <form className="w-full">
                        <input 
                            type="text" 
                            placeholder="O que está procurando?" 
                            className="w-full px-4 py-2 text-black bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </form>

                    {/* <InputGroup className="w-full h-10">
                        <InputGroupInput placeholder="O que está procurando?" />
                        <InputGroupAddon align="inline-end">

                            {isSearching ? <Spinner /> : <Search className="cursor-pointer" />}

                        </InputGroupAddon>
                    </InputGroup> */}
                </div>

                <div className="flex items-center">
                    <button className="text-white hover:text-gray-300">
                        Submenus
                    </button>
                </div>
            </div>
        </header>
    )
}