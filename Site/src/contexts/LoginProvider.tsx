import React, { useContext, useEffect, useState } from 'react';
// import { useLoadData } from '../hooks/useLoadData';
import { UserContext } from 'contexts/UserContext';

import firebase from 'firebase/app';
import { User } from '../models/User';
import { LoadingComponent } from 'components/surfaces/LoadingComponent';
import { urls, useRouting } from 'routes';

export const UserStateProvider: React.FC<{
    providerId: string | null,
    user: any
}> = (p) => {
    const db = firebase.firestore();
    const { providerId, children, user } = p;
    const { user: userInContext, setUser } = useContext(UserContext);
    const [counter, setCounter] = useState(0);
    const [dataChecked, setDataChecked] = useState(true);
    const { routeTo } = useRouting();
    useEffect(() => {
        setCounter(counter + 1);
        if (providerId) {
            (async () => {
                if (user) {
                    setDataChecked(false);
                    const userCollection = await db.collection("users").doc(user.uid).get();
                    const data = userCollection.data() as Pick<User, "firstName" | "lastName">;

                    setUser({
                        email: user.email ?? "default@email.com",
                        firstName: data.firstName,
                        lastName: data.lastName
                    });

                    routeTo(urls.dashboard);
                    setDataChecked(true);
                }
            })();
        }
        // eslint-disable-next-line
    }, [providerId])
    const getUserStatus = () => {
        if ((userInContext || counter >= 2) && dataChecked) {
            return children;
        }
        return <LoadingComponent />
    }
    return <>
        {getUserStatus()}
    </>
}