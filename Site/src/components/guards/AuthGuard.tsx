import React, { useContext } from "react"
import { UserContext } from "../../contexts/UserContext"
import { Redirect } from "react-router-dom";
export const AuthGuard: React.FC = ({ children }) => {
    const { user } = useContext(UserContext);
    if (!user) {
        console.log("Redirect");
        return <Redirect to="/login" />
    }
    return <React.Fragment>
        {children}
    </React.Fragment>;
}