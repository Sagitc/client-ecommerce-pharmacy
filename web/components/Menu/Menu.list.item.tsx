import { ElementType, ReactNode } from "react";

type MenuListItemProps = {
    icon: ElementType;
    innerText: string;
    onClick?: () => void;
}

export default function MenuListItem({ icon: Icon, innerText, onClick }: MenuListItemProps) {
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