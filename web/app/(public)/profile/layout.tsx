"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Edit, Shield, Package, MapPin, Heart, LogOut, LockKeyhole, Ticket } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EditableProfileAvatar } from "@/components/editable-profile-avatar";
import { useUser } from "@/contexts/user-context";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PerfilLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const userCtx = useUser();
    const currentUser = userCtx?.user;
    const isLoading = userCtx?.isLoading;
    const isAuthenticated = userCtx?.isAuthenticated;
    const router = useRouter();
    const pathname = usePathname();

    const menuOptions = [
        { label: "Resumo da conta", path: "/profile", icon: User },
        { label: "Editar perfil", path: "/profile/edit", icon: Edit },
        { label: "Alterar senha", path: "/profile/change-password", icon: LockKeyhole },
        { label: "Meus pedidos", path: "/profile/orders", icon: Package },
        { label: "Meus cupons", path: "/profile/coupons", icon: Ticket },
        { label: "Meus endereços", path: "/profile/addresses", icon: MapPin },
        { label: "Meus favoritos", path: "/profile/favorites", icon: Heart },
        { label: "Privacidade", path: "/profile/privacity", icon: Shield },
        { label: "Sair", path: "/logout", icon: LogOut },
    ];

    const [optionChosen, setOptionChosen] = useState<string>(pathname);

    useEffect(() => {
        setOptionChosen(pathname);
    }, [pathname]);

    const handleLogout = async () => {
        if (userCtx?.logout) {
            await userCtx.logout();
        }
        toast.info("Você saiu da sua conta.");
        router.push("/login");
    };

    const isPublicFavorites = pathname === "/profile/favorites";

    if (!isLoading && !isAuthenticated && !isPublicFavorites) {
        return (
            <div className="container max-w-2xl mx-auto py-16 px-4 text-center">
                <div className="bg-background border rounded-xl p-8 shadow-sm flex flex-col items-center gap-4">
                    <User className="size-12 text-primary" />
                    <h1 className="text-2xl font-bold">Acesse sua conta</h1>
                    <p className="text-muted-foreground text-sm max-w-md">
                        Faça login ou crie uma conta para visualizar seus dados, pedidos, endereços e alterar sua senha.
                    </p>
                    <div className="flex gap-3 mt-2">
                        <Button onClick={() => router.push("/login")}>
                            Entrar
                        </Button>
                        <Button variant="outline" onClick={() => router.push("/signup")}>
                            Criar conta
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const initials = currentUser
        ? `${currentUser.name?.[0] || ""}${currentUser.lastName?.[0] || ""}`.toUpperCase() || "U"
        : "FC";

    return (
        <div className="container max-w-6xl mx-auto flex flex-col md:flex-row gap-10 px-2 lg:px-0 py-5">
            {/* MOBILE AVATAR */}
            <div className="flex items-center justify-center md:hidden gap-4">
                <EditableProfileAvatar />
                <div>
                    <span className="text-2xl">
                        Olá, <br />
                    </span>
                    <span className="font-bold self-center text-2xl">
                        {currentUser ? `${currentUser.name} ${currentUser.lastName}` : "Visitante"}
                    </span>
                </div>
            </div>

            {/* SELECT MOBILE */}
            <Select
                value={optionChosen}
                onValueChange={(newPath) => {
                    if (!newPath) return;
                    if (newPath === "/logout") {
                        handleLogout();
                        return;
                    }
                    setOptionChosen(newPath);
                    router.push(newPath);
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
            <aside className="hidden md:flex flex-col p-5 rounded-lg gap-2 bg-background min-w-70 h-fit border shadow-sm">
                {menuOptions.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    if (item.path === "/logout") {
                        return (
                            <button
                                key={item.path}
                                type="button"
                                onClick={handleLogout}
                                className="flex items-center gap-3 p-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-left cursor-pointer"
                            >
                                <Icon className="size-5" />
                                <span>{item.label}</span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors dark:text-white dark:hover:bg-muted ${
                                isActive
                                    ? "bg-primary/90 text-white font-semibold"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-foreground"
                            }`}
                        >
                            <Icon className="size-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </aside>

            {/* COLUNA DIREITA */}
            <main className="flex-1">{children}</main>
        </div>
    );
}
