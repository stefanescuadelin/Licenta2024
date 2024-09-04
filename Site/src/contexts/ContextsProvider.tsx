import React from "react";
import { UserContextProvider } from "./UserContext";


const indexes = [UserContextProvider];

/**
 * 
 * @warning be warned as the item will be consumed after this
 */
const GeneralProvider: React.FC<{ item: React.FC<{}>[] }> = ({ item, children }) => {
    if (!item || item.length === 0) {
        return <React.Fragment>
            {children}
        </React.Fragment>;
    }
    const Item = item.shift()!;
    return <Item>
        <GeneralProvider item={item} >
            {children}
        </GeneralProvider>
    </Item>
}

const ContextsProvider: React.FC = ({ children }) => (
    <GeneralProvider item={indexes}>
        {children}
    </GeneralProvider>
)
export default ContextsProvider;