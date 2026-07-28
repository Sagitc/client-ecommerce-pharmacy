import { SectionFilterBtn } from "@/components/SectionFilterProducts/SectionFilter.btn";
import { CategoryType, categoriesObj } from "./SectionFilter";

type Props = {
    selectedCategory: string,
    setSelectedCategory: (category: CategoryType) => void
}

export function SectionFilterNav({ selectedCategory, setSelectedCategory }: Props) {

    function handleClick(category: CategoryType) {
        setSelectedCategory(category);
    }

    return (
        <nav className="hidden md:flex gap-4">
            {categoriesObj.map((category) => (
                <SectionFilterBtn
                    key={category.value}
                    data-key={category.value}
                    onClick={() => handleClick(category.value as CategoryType)}
                    className={selectedCategory === category.value ? "bg-primary text-primary-foreground" : ""}
                >
                    {category.label}
                </SectionFilterBtn>
            ))}
        </nav>
    )
}

