"use client";

import {
    ChangeEvent,
    ElementType,
    useEffect,
    useRef,
    useState
} from "react";
import { useUser } from "@/contexts/user-context";
import Cart from "@/components/cart";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Cog,
    Heart,
    LogOut,
    Menu,
    Package,
    Palette,
    Search,
    ShoppingCart,
    Ticket,
    User,
    X
} from "lucide-react";
import { useRouter } from "next/navigation";


type HeaderInputProps = {
    isSearching: boolean;
    setIsSearching: (state: boolean) => void;
    className?: string;
}

type MenuProps = {
    classList?: string;
    icon: React.ReactNode;
}

export default function Header() {

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
        <div className="flex flex-col w-full sticky -top-px z-50">

            <header className="w-full px-2 py-2 md:px-8 lg:px-0 bg-primary dark:bg-gray-800 text-white relative z-20 shadow-xl">
                <div className="flex items-center justify-between w-full h-12 max-w-6xl mx-auto">

                    {/* LOGO */}
                    <a href="/" className="flex items-center gap-2">
                        <img src="/logo_white.svg" alt="Logo" className="w-auto h-auto max-w-42" />
                    </a>

                    {/* CAMPO DE PESQUISA */}
                    <div className="flex items-center w-full max-w-sm">
                        <HeaderInput
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
                            data-search-toggle="true"
                        >
                            <Search className="size-5" />
                        </Button>

                        <MenuModal
                            classList="md:hidden"
                            icon={<Menu className="size-5" />}
                        />

                        <Cart
                            className="hidden! md:flex!"
                            icon={<ShoppingCart className="size-5" />}
                        />

                        <MenuModal
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
                <HeaderInput
                    isSearching={isSearching}
                    setIsSearching={setIsSearching}
                    className="w-full"
                />
            </div>
        </div>
    )
}

function HeaderInput({ isSearching, setIsSearching, className }: HeaderInputProps) {

    const [searchQuery, setSearchQuery] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // FUNÇÃO PARA LIMPAR O CAMPO DE PESQUISA QUANDO ELE FICA INVISÍVEL
    //
    // useEffect(() => {
    //     if (!isSearching) {
    //         setSearchQuery(null);
    //         setIsLoading(false);
    //     }
    // }, [isSearching]);

    function handleChangeInput(event: ChangeEvent<HTMLInputElement>) {
        (event.target.value.length > 0) ? setIsLoading(true) : (setIsLoading(false), setSearchQuery(null));
        setSearchQuery(event.target.value);
    }

    return (
        <InputGroup className={`bg-white text-foreground font-normal w-full h-10 ${className || ""}`}>
            <InputGroupInput
                className={""}
                onChange={handleChangeInput}
                value={searchQuery || ""}
                placeholder="O que está procurando?"
            />
            <InputGroupAddon align="inline-end">

                {isLoading ? <Spinner /> : <Button variant="ghost" size="icon">
                    <Search className="cursor-pointer" />
                </Button>}

            </InputGroupAddon>
        </InputGroup>
    )
}

function MenuModal({ classList, icon }: MenuProps) {

    const user = useUser();

    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    function handleMenuClick(path: string) {
        setIsOpen(false);
        router.push(path);
    }

    type MenuItemProps = {
        icon: ElementType;
        innerText: string;
        onClick?: () => void;
    }

    function MenuItem({ icon: Icon, innerText, onClick }: MenuItemProps) {
        return (
            <li
                className="flex items-center gap-3 font-light border-b border-b-muted/50 py-4 px-3 rounded-2xl hover:bg-muted cursor-pointer last:border-b-0"
                onClick={onClick}
            >
                <Icon className="h-5 w-5" />

                <span className="text-md font-light">
                    {innerText}
                </span>
            </li>
        )
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
                className={`${buttonVariants({ variant: "ghost", size: "icon-lg" })} ${classList}`}
            >
                {icon}
            </SheetTrigger>
            <SheetContent showCloseButton={false} className="flex flex-col p-4" >
                <SheetHeader className="flex flex-row items-center justify-between p-0">
                    <div className="flex items-center justify-between gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src="https://github.com/maxleiter.png" alt="Avatar" />
                            <AvatarFallback>User</AvatarFallback>
                        </Avatar>
                        <SheetTitle className="text-sm font-light">
                            Bem-vindo,<br />
                            <span className="font-bold self-center text-base">
                                {user?.user?.name} {user?.user?.lastName}
                            </span>
                        </SheetTitle>
                    </div>
                    <SheetClose className={buttonVariants({ variant: "ghost", size: "icon" })}>
                        <X className="size-4" />
                    </SheetClose>
                </SheetHeader>
                <div className="flex flex-col gap-2">
                    <nav>
                        <ul className="flex flex-col gap-2 text-sm font-light">
                            <MenuItem
                                icon={User}
                                innerText="Meus dados"
                                onClick={ () => handleMenuClick("/profile")  }
                            />
                            <MenuItem
                                icon={Package}
                                innerText="Meus pedidos"
                                onClick={ () => handleMenuClick("/profile/orders")  }
                            />
                            <MenuItem
                                icon={Heart}
                                innerText="Favoritos"
                                onClick={ () => handleMenuClick("/profile/favorites")  }
                            />
                            <MenuItem
                                icon={Ticket}
                                innerText="Cupons"
                            />
                            <MenuItem
                                icon={Palette}
                                innerText="Tema"
                                onClick={() => {
                                    const currentTheme = localStorage.getItem("theme");
                                    if (currentTheme === "dark") {
                                        localStorage.setItem("theme", "light");
                                        document.documentElement.classList.remove("dark");
                                    } else {
                                        localStorage.setItem("theme", "dark");
                                        document.documentElement.classList.add("dark");
                                    }
                                }}
                            />
                            <MenuItem
                                icon={Cog}
                                innerText="Configuração"
                                onClick={ () => handleMenuClick("/profile/edit")  }
                            />
                            <MenuItem
                                icon={LogOut}
                                innerText="Desconectar"
                                onClick={() => {
                                    localStorage.removeItem("user");
                                    window.location.reload();
                                }}
                            />
                        </ul>
                    </nav>
                </div>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-full bg-muted h-full rounded-lg flex items-center justify-center">
                    Selecionados para você
                </a>
            </SheetContent>
        </Sheet>
    )
}