'use server'

import { keelClient } from "@/util/clients";
import { cookies } from "next/headers";

// @ts-ignore
export const handleLogin = async (formData) => {
    const response = await keelClient.api.mutations.authenticate({
        emailPassword: {
            email: formData.email,
            password: formData.password,
        },
        createIfNotExists: false,
    });

    const token = response.data?.token;

    if (!token) {
        return { type: 'error', message: "Login failed. Please check your email and password." }
    }

    const firstTeamId = (await keelClient.api.queries.listTeams()).data?.results[0].id

    cookies().set('keel.auth', token, { httpOnly: true, secure: true, sameSite: 'strict' })
    return { type: 'success', firstTeamId }
};