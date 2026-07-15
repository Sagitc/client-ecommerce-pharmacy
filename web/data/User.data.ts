import { User } from "@/types/User.type";

export const User1: User = {
    id: 1,
    name: "John",
    lastName: "Doe",
    avatar: "https://github.com/evilrabbit.png",
    cart: {
        id: 1,
        userId: 1,
        items: [
            {
                id: 1,
                label: "Product 1",
                price: 10.99,
                quantity: 2
            },
            {
                id: 2,
                label: "Product 2",
                price: 5.99,
                quantity: 1
            }
        ]
    }
}