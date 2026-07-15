import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/userContext";
import { Cog, Heart, LogOut, Package, Palette, Ticket, User } from "lucide-react";
import MenuListItem from "@/components/Menu/Menu.list.item";

type Props = {
    classList?: string;
    icon: React.ReactNode;
}

export default function MenuMain({ classList, icon }: Props) {

    const user = useUser();

    return (
        <Sheet>
            <SheetTrigger>
                <Button className={classList} variant="ghost" size="icon-lg">
                    {icon}
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src="https://github.com/evilrabbit.png" alt="Avatar" />
                        <AvatarFallback>User</AvatarFallback>
                    </Avatar>
                    <div className="">
                        <SheetTitle className="text-sm font-extralight">É bom ter você aqui,<br /><span className="font-bold self-center text-xl">{user?.user?.name} Doe</span></SheetTitle>
                    </div>
                </SheetHeader>
                <div className="flex-1 flex flex-col gap-2 p-4">
                    <nav>
                        <ul className="flex flex-col gap-2 text-sm font-light">
                            <MenuListItem 
                                icon={User}
                                innerText="Meus dados"
                            />
                            <MenuListItem
                                icon={Package}
                                innerText="Meus pedidos"
                            />
                            <MenuListItem
                                icon={Heart}
                                innerText="Favoritos"
                            />
                            <MenuListItem
                                icon={Ticket}
                                innerText="Cupons"
                            />
                            <MenuListItem
                                icon={Palette}
                                innerText="Tema"
                            />
                            <MenuListItem
                                icon={Cog}
                                innerText="Configuração"
                            />
                            <MenuListItem
                                icon={LogOut}
                                innerText="Desconectar"
                            />
                        </ul>
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    )
}