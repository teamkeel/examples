"use client"

import { useAuth } from "@clerk/nextjs";
import { keel } from "@teamkeel/client-react";
import { PropsWithChildren, useEffect, useState } from "react";
import { APIClient } from "../../../keel/keelClient";
export const { KeelProvider, useKeel } = keel(APIClient)

const KeelAuthProvider = (props: PropsWithChildren) => {
    const { auth } = useKeel()
    const { getToken, sessionId } = useAuth();
    const [authenticated, setAuthenticated] = useState(false);
    useEffect(() => {
        const token = async () => {
            const t = await getToken({ template: "keel" });
            await auth.authenticateWithIdToken(t!)
            const isAuthenticated = await auth.isAuthenticated()
            setAuthenticated(isAuthenticated)
        };
        token();
    }, [getToken, sessionId, auth]);
    return <>
        {props.children}
    </>
}
export default KeelAuthProvider; 
