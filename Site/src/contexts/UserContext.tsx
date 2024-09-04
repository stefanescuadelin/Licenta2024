import React, { createContext } from "react";
import { useUser } from "../hooks/UserHook";


export const UserContext = createContext<ReturnType<typeof useUser>>(null!);

export const UserContextProvider: React.FC = ({ children }) => {
    const user = useUser();
    return <UserContext.Provider value={user}>
        {children}
    </UserContext.Provider>


}