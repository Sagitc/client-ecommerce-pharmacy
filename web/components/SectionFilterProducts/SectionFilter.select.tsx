"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const items = [
  { label: "Vitaminas e Suplementos", value: "suplement" },
  { label: "Anticoncepcionais", value: "contraceptive" },
  { label: "Higiene pessoal", value: "hygiene" },
  { label: "Mundo infantil", value: "infantile" },
  { label: "Lançamentos", value: "release" },
]

export function SectionFilterNavMobile() {
  return (
    <>
      <Select items={items} defaultValue={items[0].value}>
        <SelectTrigger className="w-full bg-background md:hidden">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-background">
          <SelectGroup>
            <SelectLabel>Categorias</SelectLabel>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

    </>
  )
}
