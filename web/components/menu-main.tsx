import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/userContext";

type Props = {
    classList?: string;
    icon: React.ReactNode;
}

export default function MenuMain({ classList, icon }: Props) {

    const user = useUser();

    return (
        <Sheet>
            <SheetTrigger>
                <Button className={classList} variant="ghost" size="icon">
                    {icon}
                </Button>
            </SheetTrigger>
            <SheetContent>
                {/* COLOCAR CONTEÚDO DO MENU AQUI!...... */}
                <SheetHeader className="flex items-center">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src="https://github.com/evilrabbit.png" alt="Avatar" />
                        <AvatarFallback>User</AvatarFallback>
                    </Avatar>
                    <SheetTitle>É bom ter você aqui,<br/><span className="font-bold self-center">{user?.user?.name}</span></SheetTitle>
                    <SheetDescription>This action cannot be undone.</SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}