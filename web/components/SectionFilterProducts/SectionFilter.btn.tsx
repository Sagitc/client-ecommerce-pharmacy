import { Button } from "@/components/ui/button"

type Props = {
    children: React.ReactNode,
    className?: string,
    onClick: () => void
}

export function SectionFilterBtn({ children, className, onClick }: Props) {
    return (
        <Button 
            variant="outline" 
            className={`flex-1 py-4 hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground ${className || ''}`} 
            onClick={onClick}
        >
            {children}
        </Button>
    )
}