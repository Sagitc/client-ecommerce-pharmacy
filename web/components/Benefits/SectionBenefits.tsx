import BenefitsCard from "@/components/Benefits/Benefits.card";
import { Truck } from "lucide-react";

export default function SectionBenefits() {
    return (
        <div className="grid grid-cols-1 cursor-default sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl xl:px-0 mx-auto w-full">
            <BenefitsCard icon={Truck} title="Benefit 1" description="Description for benefit 1" />
            <BenefitsCard icon={Truck} title="Benefit 2" description="Description for benefit 2" />
            <BenefitsCard icon={Truck} title="Benefit 3" description="Description for benefit 3" />
            <BenefitsCard icon={Truck} title="Benefit 4" description="Description for benefit 4" />
        </div>
    )
}