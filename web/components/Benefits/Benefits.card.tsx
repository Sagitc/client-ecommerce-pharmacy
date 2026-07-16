import { ElementType } from "react"

type Prop = {
    icon: ElementType,
    title: string,
    description: string
}

export default function BenefitsCard({ icon: Icon, title, description }: Prop) {
    return (
        <div className="last:hidden sm:last:flex bg-background dark:bg-gray-800 flex items-center justify-start gap-4 rounded-lg border p-4 shadow-md hover:shadow-lg transition-shadow duration-300 w-full overflow-hidden">

            <div className="bg-primary text-primary-foreground rounded-full shrink-0 w-12 h-12 flex items-center justify-center p-2">
                <Icon className="w-6 h-6" /> 
            </div>

            <div className="flex flex-col gap-0.5 flex-1 text-left overflow-hidden">
                <span className="font-bold text-sm sm:text-base truncate">
                    {title}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground truncate">
                    {description}
                </span>
            </div>
            
        </div>
    )
}