import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type Props = {
    className?: string;
}

export default function InputSearch({ className }: Props) {

    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string | null>(null);

    function handleChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
        (event.target.value.length > 0) ? setIsSearching(true) : setIsSearching(false);
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

                {isSearching ? <Spinner /> : <Button variant="ghost" size="icon">
                    <Search className="cursor-pointer" />
                </Button>}

            </InputGroupAddon>
        </InputGroup>
    )
}