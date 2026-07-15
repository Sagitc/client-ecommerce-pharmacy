import { ProductCart } from "@/types/Product.type"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"

type Props = {
    items: ProductCart[]
}

export default function CartItem({ items }: Props) {
    return (
        <div className="flex flex-col gap-2 no-scrollbar overflow-y-auto">
            {items.map((item) => (
                <div key={item.id} className="flex flex-row gap-2 px-4 py-1 items-center ">
                    <img 
                        src={item.image ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf6OM_2iXA5DFquiB_0p0Vr5_0Kv2XoFloY0pvgU-KBA&s=10"} 
                        alt={item.label} 
                        className="w-16 h-16 rounded-md" 
                    />

                    <div className="flex-1 flex flex-col justify-between">
                        <div>

                        </div>
                        <span className="text-sm font-bold">{item.label} <span className="font-extralight text-xs">- {item.quantity}x</span></span>
                        <span className="text-sm font-light">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>

                    <div>
                        <Button variant="ghost">
                            <Trash />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}