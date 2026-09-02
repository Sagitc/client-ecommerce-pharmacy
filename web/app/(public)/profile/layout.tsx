"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Edit, Shield, Package, MapPin, Heart, CreditCard, LogOut } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/user-context";
import { useEffect, useState } from "react";

export default function PerfilLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = useUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const selectedOption = menuOptions.find((item) => item.path === pathname);
        if (selectedOption) {
            setOptionChosen(selectedOption.label);
        }
    }, [pathname]);

    
    const menuOptions = [
        { label: "Resumo da conta", path: "/profile", icon: User },
        { label: "Editar perfil", path: "/profile/edit", icon: Edit },
        { label: "Privacidade", path: "/profile/privacity", icon: Shield },
        { label: "Meus pedidos", path: "/profile/orders", icon: Package },
        { label: "Meus endereços", path: "/profile/addresses", icon: MapPin },
        { label: "Meus favoritos", path: "/profile/favorites", icon: Heart },
        { label: "Métodos de pagamentos", path: "/profile/payment_methods", icon: CreditCard },
        { label: "Sair", path: "/logout", icon: LogOut }
    ];

    const [optionChosen, setOptionChosen] = useState<typeof menuOptions[number]['label']>("Resumo da conta");

    return (
        <div className="container max-w-6xl mx-auto flex flex-col md:flex-row gap-10 px-2 lg:px-0 py-5">

            {/* MOBILE AVATAR */}
            <div className="flex items-center justify-center md:hidden gap-4">
                <div className="rounded-full">
                    <Avatar className="w-32 h-32">
                        <AvatarImage src="https://github.com/maxleiter.png" alt="Avatar" />
                        <AvatarFallback>User</AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <span className="text-3xl">Olá, <br/></span>
                    <span className="font-bold self-center text-3xl">
                        {user?.user?.name} {user?.user?.lastName}
                    </span>
                </div>
            </div>

            {/* SELECT MOBILE */}
            <Select
                value={optionChosen}
                onValueChange={(newPath) => {
                    const selectedItem = menuOptions.find((item) => item.path === newPath);
                    if (selectedItem) {
                        setOptionChosen(selectedItem.label);
                    }
                    router.push(newPath as string);
                }}
            >
                <SelectTrigger className="w-full bg-background py-5 md:hidden">
                    <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                    <SelectGroup>
                        {menuOptions.map((item) => (
                            <SelectItem key={item.path} value={item.path}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            {/* SIDEBAR DESKTOP */}
            <aside className="hidden md:flex flex-col p-5 rounded-lg gap-4 bg-background min-w-70 h-fit border shadow-sm">
                {menuOptions.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors dark:text-white  dark:hover:bg-muted ${
                                isActive 
                                    ? "bg-primary/90 text-white font-semibold"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-foreground"}
                                ${item.path === "/logout" 
                                    ? "text-red-600 hover:bg-red-100" 
                                    : ""}
                            `}
                        >
                            <Icon className="size-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </aside>

            {/* COLUNA DIREITA: */}
            <main className="flex-1">
                {children}
            </main>

        </div>
    );
}