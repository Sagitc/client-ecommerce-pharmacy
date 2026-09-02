"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/contexts/user-context";
import { OrderType } from "@/types/order-type";
import { UserType } from "@/types/user-type";
import { Edit, HeartCrack } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// const USER = useUser();

function Container({ children, sectionStyle, containerStyle }: { children: React.ReactNode; sectionStyle?: string; containerStyle?: string }) {
    return (
        <section className={`bg-background h-70 rounded-lg shadow-sm p-4 ${sectionStyle || ''}`}>
            <div className={`container mx-auto h-full flex flex-col gap-4 ${containerStyle || ''}`}>
                {children}
            </div>
        </section>
    )
}

function LastOrders({parentStyle}: {parentStyle?: string}) {

    // SIMULANDO UMA REQUISIÇÃO PARA PEGAR OS ÚLTIMOS PEDIDOS DO USUÁRIO NO DB

    const lastOrders: OrderType[] = [
        {
            id: "1",
            date: "2023-01-01",
            receiver: {
                name: "João",
                lastName: "Silva",
                email: "joao.silva@example.com",
                phone: "123456789"
            },
            address: {
                id: 1,
                receiver: "João Silva",
                street: "Rua Exemplo",
                number: "123",
                complement: "Apto 456",
                neighborhood: "Bairro Exemplo",
                city: "Cidade Exemplo",
                state: "Estado Exemplo",
                zipCode: "12345-678",
                isDefault: true
            },
            paymentMethod: "credit_card",
            total: "R$ 100,00",
            status: "delivered",
            items: [
                {
                    id: 1,
                    label: "Produto 1",
                    fabricator: "Fabricante 1",
                    image: "/images/produto-1.jpg",
                    quantity: 2,
                    price: 100
                }
            ]
        }, {
            id: "2",
            date: "2023-02-01",
            receiver: {
                name: "Maria",
                lastName: "Souza",
                email: "maria.souza@example.com",
                phone: "987654321"
            },
            address: {
                id: 2,
                receiver: "Maria Souza",
                street: "Rua Exemplo 2",
                number: "456",
                complement: "Apto 789",
                neighborhood: "Bairro Exemplo 2",
                city: "Cidade Exemplo 2",
                state: "Estado Exemplo 2",
                zipCode: "54321-876",
                isDefault: false
            },
            paymentMethod: "pix",
            total: "R$ 200,00",
            status: "delivered",
            items: [
                {
                    id: 2,
                    label: "Produto 2",
                    fabricator: "Fabricante 2",
                    image: "/images/produto-2.jpg",
                    quantity: 1,
                    price: 200
                }
            ]
        },
        {
            id: "3",
            date: "2023-03-01",
            receiver: {
                name: "Carlos",
                lastName: "Oliveira",
                email: "carlos.oliveira@example.com",
                phone: "111222333"
            },
            address: {
                id: 3,
                receiver: "Carlos Oliveira",
                street: "Rua Exemplo 3",
                number: "789",
                complement: "Apto 123",
                neighborhood: "Bairro Exemplo 3",
                city: "Cidade Exemplo 3",
                state: "Estado Exemplo 3",
                zipCode: "98765-432",
                isDefault: false
            },
            paymentMethod: "boleto",
            total: "R$ 300,00",
            status: "delivered",
            items: [
                {
                    id: 3,
                    label: "Produto 3",
                    fabricator: "Fabricante 3",
                    image: "/images/produto-3.jpg",
                    price: 300,
                    quantity: 1
                }
            ]
        }
    ];

    return (
        <Container sectionStyle={parentStyle}>
            <div className="flex justify-between">
                <h2 className=" font-bold text-lg">Últimas compras</h2>
                <select className="bg-background border rounded-md px-3 py-1 text-sm">
                    <option value="2026">2026</option>
                </select>
            </div>
            <Separator />
            {lastOrders.length === 0
                ? (<div className="flex-1 flex flex-col gap-2 items-center justify-center rounded-md bg-accent">

                    <HeartCrack className="size-10 text-gray-600" />

                    <p className="text-gray-600 text-center">Você ainda não realizou <br />
                        nenhuma compra.</p>
                </div>)
                : (<div className="flex-1 overflow-y-scroll scrollbar-none">
                    <ul className="">
                        {lastOrders.map((order) => (
                            <li key={order.id} className="py-1">
                                <Link
                                    href={`/profile/orders/${order.id}`}
                                    className="block transition-transform hover:scale-[1.01]"
                                >
                                    <div className="flex justify-between items-center bg-accent rounded-lg p-4">
                                        <div>
                                            <p className="font-medium text-gray-900">Pedido #{order.id}</p>
                                            <p className="text-sm text-gray-500">{order.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-900">{order.total}</p>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>)
            }
        </Container>
    )
}

function MainAddress() {

    // SIMULANDO UMA REQUISIÇÃO PARA PEGAR O ENDEREÇO PRINCIPAL DO USUÁRIO NO DB

    const mainAddress: NonNullable<UserType["addresses"]>[number] = {
        id: 1,
        street: "Rua Exemplo",
        number: "123",
        complement: "Apto 456",
        neighborhood: "Bairro Exemplo",
        city: "Cidade Exemplo",
        state: "Estado Exemplo",
        zipCode: "12345-678",
        receiver: "Sagitc",
        isDefault: true
    };

    return (
        <Container sectionStyle="h-60!" containerStyle="gap-2!">
            <h2 className="font-bold text-lg">Endereço principal</h2>
            <div className="flex-1 flex flex-col justify-evenly gap-2 bg-accent p-4 rounded-md">
                <span className="text-lg font-semibold text-gray-900">{mainAddress.receiver}</span>
                <span className="text-gray-900 font-light text-base">
                    {mainAddress.street}, {mainAddress.number}<br/>
                    {mainAddress.city} - {mainAddress.state}
                </span>
            </div>
            <span className="flex flex-row items-center underline gap-2">
                Alterar <Edit className="size-4 text-primary" />
            </span>
        </Container>
    )
}

function MainPaymentMethod() {

    // SIMULANDO UMA REQUISIÇÃO PARA PEGAR O MÉTODO DE PAGAMENTO PRINCIPAL DO USUÁRIO NO DB

    const mainPaymentMethod: NonNullable<UserType["paymentMethods"]>[number] = {
        id: 1,
        cardNumber: "**** **** **** 1234",
        cardHolder: "João Silva",
        expirationDate: "12/25",
        cvv: "123",
        isDefault: true
    };

    return (
        <Container sectionStyle="h-60!">
            <h2 className="font-bold text-lg">Cartão principal</h2>
            <div className="flex-1 flex flex-col justify-evenly gap-2 bg-accent p-4 rounded-md">
                <span className="text-lg font-semibold text-gray-900">{mainPaymentMethod.cardHolder}</span>
                <span className="text-lg font-semibold text-gray-900">{mainPaymentMethod.cardNumber}</span>
                <div className="text-lg font-semibold text-gray-900 w-full flex justify-between">
                    <span>{mainPaymentMethod.expirationDate}</span>
                    <span>{mainPaymentMethod.cvv}</span>
                </div>
            </div>
        </Container>
    )
}

export default function ResumePage() {

    const user = useUser();
    const router = useRouter();

    return (
        <div className="container mx-auto flex flex-col gap-6">

            <div className="hidden md:flex justify-between bg-background/80 backdrop-blur-md p-4 rounded-lg shadow-sm">
                <div className="items-center justify-center md:flex gap-6">
                    <div className="rounded-full">
                        <Avatar className="w-28 h-28">
                            <AvatarImage src="https://github.com/maxleiter.png" alt="Avatar" />
                            <AvatarFallback>User</AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <span className="text-3xl">Olá, <br/></span>
                        <span className="font-bold self-center text-3xl">
                            {user?.user?.name} {user?.user?.lastName}
                        </span>
                    </div>
                </div>
                <Button 
                    variant="outline" 
                    className="self-center px-4 py-5 "
                    onClick={() => router.push("/profile/edit")}
                >
                    Editar perfil
                </Button>
            </div>

            <div className="md:hidden flex flex-col gap-6">
                <LastOrders />

                <MainAddress />

                <MainPaymentMethod />
            </div>

            <div className="hidden md:flex gap-6 w-full">
                <div className="flex-1">
                    <LastOrders parentStyle="h-full" />
                </div>
                <div className="flex-1 flex flex-col gap-4">
                    <MainAddress />

                    <MainPaymentMethod />
                </div>
            </div>

        </div>
    );
}