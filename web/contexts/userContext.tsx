"use client"

import { User1 } from "@/data/User.data";
import { User } from "@/types/User.type";
import { createContext, ReactNode, useContext, useState } from "react";

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
};

const UserCtx = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    
    const [user, setUser] = useState<User | null>(User1);

    return(
        <UserCtx.Provider value={{ user, setUser }}>{children}</UserCtx.Provider>
    );
}

export const useUser = () => useContext(UserCtx);