import { useState } from "react";
import { BaseUser } from "../typescript/models/User";

export function useUser() {
    const [user, setUser] = useState<BaseUser | null>();

    return {
        user, setUser,
    }

}