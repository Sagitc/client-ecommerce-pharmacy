"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import InputSearch from "@/components/Header/Header.input";
import MenuMain from "@/components/Menu/Index";
import CartMain from "@/components/Cart/Index";

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
        // 1. Removido o shadow-xl daqui
        <div className="flex flex-col w-full sticky top-0 z-50">
            
            {/* 2. Adicionado shadow-xl, relative e z-20 no header */}
            <header className="w-full px-4 py-2 bg-primary dark:bg-gray-800 text-white relative z-20 shadow-xl">
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
                            data-search-toggle="true" // Adicionado para o seu click outside não bugar
                        >
                            <Search className="size-5" />
                        </Button>

                        <MenuMain 
                            classList="md:hidden" 
                            icon={<Menu className="size-5" />} 
                        />

                        <CartMain 
                            className="hidden! md:flex!" 
                            icon={<ShoppingCart className="size-5" />} 
                        />
                        

                        <MenuMain 
                            classList="hidden! md:flex!"
                            icon={<User className="size-5" />} 
                        />
                    </div>
                </div>
            </header>

            <div 
                ref={searchContainerRef}
                className={`absolute left-0 top-full w-full px-6 py-4 md:hidden -z-10 transition-all duration-300 bg-primary/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-md rounded-b-xl ${isSearching ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible"}`}
            >
                <InputSearch
                    isSearching={isSearching}
                    setIsSearching={setIsSearching}
                    className="w-full" 
                />
            </div>
        </div>
    )
}