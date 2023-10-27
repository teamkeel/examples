'use server'

import { keelClient } from "@/util/clients";

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

    // Navigate to the app page after successful login
    keelClient.client.setToken((response as any).data.token);
};