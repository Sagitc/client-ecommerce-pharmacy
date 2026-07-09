import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type Props = {
    classList?: string;
    icon: React.ReactNode;
}

export default function MenuMain({ classList, icon }: Props) {
    return (
        <Sheet>
            <SheetTrigger>
                <Button className={classList} variant="ghost" size="icon">
                    {icon}
                </Button>
            </SheetTrigger>
            <SheetContent>
                {/* COLOCAR CONTEÚDO DO CARRINHO AQUI!...... */}
                <SheetHeader>
                    <SheetTitle>MENU?</SheetTitle>
                    <SheetDescription>This action cannot be undone.</SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}