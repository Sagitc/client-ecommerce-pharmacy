import { ChangeEvent, useEffect, useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type Props = {
    isSearching: boolean;
    setIsSearching: (state: boolean) => void;
    className?: string;
}

export default function InputSearch({ isSearching, setIsSearching, className }: Props) {

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