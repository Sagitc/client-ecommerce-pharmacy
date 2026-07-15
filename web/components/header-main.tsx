"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import InputSearch from "@/components/input-search";
import MenuMain from "@/components/Menu/Index";
import CartMain from "./Cart/Index";


export function HeaderMain() {

    const [isSearching, setIsSearching] = useState<boolean>(false);

    const searchContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                const clickedToggleBtn = (event.target as HTMLElement).closest('[data-search-toggle="true"]');
                if (!clickedToggleBtn) {
                    searchContainerRef.current.setAttribute("value", "");
                    setIsSearching(false);
                }
            }
        }
        if (isSearching) document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSearching]);

    return (
        <div className="flex flex-col w-full relative">
            <header className="w-full px-4 py-2 bg-primary dark:bg-gray-800 text-white">
                <div className="flex items-center justify-between w-full h-12 max-w-6xl mx-auto">
                    {/* LOGO */}
                    <div>
                        <img src="/logo_white.svg" alt="Logo" className="w-auto h-auto max-w-42" />
                    </div>

                    {/* CAMPO DE PESQUISA */}
                    <div className="flex items-center w-full max-w-sm">
                        <InputSearch 
                            isSearching={isSearching}
                            setIsSearching={setIsSearching}
                            className="hidden md:flex"
                        />
                    </div>

                    {/* BOTÕES DE NAVEGAÇÃO */}
                    <div className="flex items-center md:gap-2">

                        <Button
                            onClick={() => setIsSearching(!isSearching)}
                            className={`md:hidden ${isSearching ? "hidden" : "flex"}`}
                            variant="ghost"
                            size="icon-lg"
                        >
                            <Search className="size-5" />
                        </Button>

                        {/* <CartMain 
                            onClick={() => setIsSearching(!isSearching)}
                            className={`md:hidden ${isSearching ? "hidden" : "flex"}`}
                            icon={<Search className="size-5" />} 
                        /> */}

                        <MenuMain 
                            classList="md:hidden" 
                            icon={<Menu className="size-5" />} 
                        />

                        {/* <CartBtn
                            className="hidden md:flex"
                            variant="ghost"
                            size="icon-lg"
                        /> */}

                        <CartMain 
                            className="hidden md:flex" 
                            icon={<ShoppingCart className="size-5" />} 
                        />

                        <MenuMain 
                            classList="hidden md:flex" 
                            icon={<User className="size-5" />} 
                        />
                    </div>
                </div>
            </header>

            {/* CAMPO DE PESQUISA MOBILE */}
            <div 
                ref={searchContainerRef}
                className="w-full px-6 sticky text-white md:hidden"
            >
                <InputSearch
                    isSearching={isSearching}
                    setIsSearching={setIsSearching}
                    className={`bg-muted md:hidden mt-2 ${isSearching ? "flex" : "hidden"}`} 
                />
            </div>
        </div>
    )
}