"use client";

import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PrivacityPage() {
    
    const [offers, setOffers] = useState<boolean>(true);

    return (
        <div className="bg-background shadow-md rounded-lg px-4 pt-6 pb-8">
            <h1 className="text-2xl font-bold mb-4">Privacidade</h1>

            {/* <div className="border rounded-lg p-4 mb-4">
                <div className="flex justify-between">
                    <h3>Ofertas e Promoções</h3>
                    <Link href="#" className="text-primary hover:underline">
                        <FileText size={24} />
                    </Link>
                </div>

                <div>

                </div>
            </div> */}

            <FieldGroup className="w-full">
                <FieldLabel htmlFor="switch-offers">
                    <Field orientation="horizontal">
                        <FieldContent>
                            <FieldTitle>Ofertas e Promoções</FieldTitle>
                            <FieldDescription>
                                Receber avisos de ofertas e promoções nos seguintes meios: e-mail e SMS.
                            </FieldDescription>
                        </FieldContent>
                        <Switch id="switch-offers" defaultChecked />
                    </Field>
                </FieldLabel>
                <FieldLabel htmlFor="switch-discounts">
                    <Field orientation="horizontal">
                        <FieldContent>
                            <FieldTitle>Desconto de laboratório</FieldTitle>
                            <FieldDescription>
                                Permitir aplicação de descontos de programas de saúde que faça parte.
                            </FieldDescription>
                        </FieldContent>
                        <Switch id="switch-discounts" defaultChecked />
                    </Field>
                </FieldLabel>
            </FieldGroup>

        </div>
    )
}