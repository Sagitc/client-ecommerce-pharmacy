import { UserType } from "@/types/user-type";

export const User1: UserType = {
    id: 1,
    name: "John",
    lastName: "Doe",
    email: "johndoe@gmail.com",
    phone: "(11) 99999-9999",
    cpf: "123.456.789-00",
    avatar: "https://github.com/evilrabbit.png",
    gender: "male",
    birthDate: new Date("1990-01-01"),
    addresses: [
        {
            id: 1,
            receiver: "Cauã",
            street: "Rua A",
            number: "123",
            complement: "Apto 101",
            neighborhood: "Bairro A",
            city: "Cidade A",
            state: "SP",
            zipCode: "12345-678",
            isDefault: true
        },
        {
            id: 2,
            receiver: "Maria",
            street: "Rua B",
            number: "456",
            complement: "",
            neighborhood: "Bairro B",
            city: "Cidade B",
            state: "RJ",
            zipCode: "23456-789",
            isDefault: false
        }
    ],
    paymentMethods: [
        {
            id: 1,
            cardNumber: "1234 5678 9012 3456",
            cardHolder: "John Doe",
            expirationDate: "12/25",
            cvv: "123",
            isDefault: true
        },
        {
            id: 2,
            cardNumber: "9876 5432 1098 7654",
            cardHolder: "John Doe",
            expirationDate: "06/24",
            cvv: "456",
            isDefault: false
        }
    ],
    orders: [
        {
            id: 1,
            date: new Date("2023-01-01"),
            items: [
                {
                    id: 1,
                    label: "Produto 1",
                    price: 100,
                    fabricator: "Fabricante 1",
                    quantity: 1
                }
            ],
            address: {
                id: 1,
                receiver: "Cauã",
                street: "Rua A",
                number: "123",
                complement: "Apto 101",
                neighborhood: "Bairro A",
                city: "Cidade A",
                state: "SP",
                zipCode: "12345-678",
                isDefault: true
            },
            paymentMethod: "credit_card",
            total: 100
        }
    ],
    cart: {
        id: 1,
        userId: 1,
        items: [
            {
                id: 1,
                label: "Produto 1",
                price: 100,
                fabricator: "Fabricante 1",
                quantity: 1
            },
            {
                id: 2,
                label: "Produto 2",
                price: 120,
                fabricator: "Fabricante 2",
                quantity: 1
            },
            {
                id: 3,
                label: "Produto 3",
                price: 150,
                fabricator: "Fabricante 3",
                quantity: 1
            },
            {
                id: 4,
                label: "Produto 4",
                price: 80,
                fabricator: "Fabricante 4",
                quantity: 1
            },
            {
                id: 5,
                label: "Produto 5",
                price: 200,
                fabricator: "Fabricante 5",
                quantity: 1
            },
            {
                id: 6,
                label: "Produto 6",
                price: 95,
                fabricator: "Fabricante 6",
                quantity: 1
            },
            {
                id: 7,
                label: "Produto 7",
                price: 175,
                fabricator: "Fabricante 7",
                quantity: 1
            },
            {
                id: 8,
                label: "Produto 8",
                price: 60,
                fabricator: "Fabricante 8",
                quantity: 1
            },
            {
                id: 9,
                label: "Produto 9",
                price: 140,
                fabricator: "Fabricante 9",
                quantity: 1
            },
            {
                id: 10,
                label: "Produto 10",
                price: 220,
                fabricator: "Fabricante 10",
                quantity: 1
            }
        ],
        updateAt: new Date(),
    }
}