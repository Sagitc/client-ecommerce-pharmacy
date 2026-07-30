"use client"

import { 
    createContext, 
    ReactNode, 
    useContext, 
    useState 
} from "react";
import { UserType } from "@/types/user-type";
import { User1 } from "@/data/user-data";

type UserContextType = {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
};

const UserCtx = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    
    const [user, setUser] = useState<UserType | null>(User1);

    return(
        <UserCtx.Provider value={{ user, setUser }}>{children}</UserCtx.Provider>
    );
}

export const useUser = () => useContext(UserCtx);