"use client";

import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import CartContent from "./cart-content";
import CartBtn from "./cart-btn";
import InputSearch from "./input-search";


export function HeaderMain() {

    const [ isSearching, setIsSearching] = useState<boolean>(false);

    return (
        <header className="w-full px-4 py-2 bg-primary dark:bg-gray-800 text-white">
            <div className="flex items-center justify-between w-full h-12 max-w-6xl mx-auto">
                <div>
                    <img src="/logo_white.svg" alt="Logo" className="w-auto h-auto max-w-42" />
                </div>

                <div className="flex items-center w-full max-w-sm">

                    <InputSearch className="hidden md:flex" />

                </div>

                <div className="flex items-center gap-2">

                    <Button 
                        onClick={() => setIsSearching(!isSearching)}
                        className="md:hidden" 
                        variant="ghost" 
                        size="icon"
                    >
                        <Search />
                    </Button>

                    <Sheet>
                        <SheetTrigger>
                            <Button className="md:hidden" variant="ghost" size="icon">
                                <Menu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>MENU?</SheetTitle>
                                <SheetDescription>This action cannot be undone.</SheetDescription>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>

                    <CartBtn
                        className="hidden md:flex"
                        variant="ghost"
                        size="icon-lg"
                    />

                    <Sheet>
                        <SheetTrigger>
                            <Button className="hidden md:flex" variant="ghost" size="icon-lg">
                                <User className="size-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>MENU?</SheetTitle>
                                <SheetDescription>This action cannot be undone.</SheetDescription>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <InputSearch className={`md:hidden mt-2 ${isSearching ? "flex" : "hidden"}`} />

        </header>
    )
}