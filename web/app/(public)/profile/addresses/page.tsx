"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/user-context";

export default function AddressesPage() {

    const user = useUser();
    const hasAddresses = Array.isArray(user?.user?.addresses) && user.user.addresses.length > 0;
    const defaultAddress = user?.user?.addresses?.find((address) => address.isDefault);

    return (
        <div className="bg-background shadow-md rounded-lg">
            <div className="flex flex-col px-4 pt-6 pb-8">
                <h1 className="text-2xl font-bold">Meus endereços</h1>

                <div className="flex flex-col mt-6">

                    {!hasAddresses && (
                        <div className="flex flex-col items-center justify-center gap-4">
                            <span className="text-xl text-muted-foreground text-center">
                                Não há endereços cadastrados
                            </span>
                        </div>
                    )}

                    {hasAddresses && (
                        <div className="flex flex-col gap-4">
                            {user?.user?.addresses?.map((address) => (
                                <div key={address.id} className="bg-card shadow-md rounded-lg p-4 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <div className="flex justify-between items-center mb-2">
                                            <h2 className="text-lg font-semibold">{address.street}, {address.number}</h2>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">{address.city}, {address.state}</p>
                                        <p className="text-sm text-muted-foreground mb-2">CEP: {address.zipCode}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button variant={address.isDefault ? "default" : "outline"} size="sm" className={"w-38"}>
                                            {address.isDefault ? "Padrão" : "Definir como padrão"}
                                        </Button>
                                        <Button variant="destructive" size="sm">
                                            Remover
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Button className="mt-6 mx-auto block" variant="default">
                    Adicionar novo endereço
                </Button>
            </div>
        </div>
    );
}