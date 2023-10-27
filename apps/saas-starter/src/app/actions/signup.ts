'use server';

import { FormType } from "@/util/FormType";
import { keelClient } from "@/util/clients";
import { cookies } from 'next/headers'

export const signup = async (_: FormType, formData: FormData): Promise<FormType> => {
    try {
        const email = formData.get('email')?.toString() ?? "";
        const password = formData.get('password')?.toString() ?? "";
        const response = await keelClient.api.mutations.authenticate({
            emailPassword: {
                email,
                password,
            },
            createIfNotExists: true,
        });

        if (!response.data) {
            return { type: 'error', message: "No response from server" }
        }

        keelClient.client.setToken(response.data.token);
        const [username] = email.split('@');

        await keelClient.api.mutations.createUser({
            name: username,
            email,
        });

        const teamName = `${username.charAt(0).toUpperCase() + username.slice(1)
            }'s Team`;

        const userId = await keelClient.api.queries.me();
        const newTeam = await keelClient.api.mutations.createTeamMembership({
            team: {
                name: teamName,
                description: `Default team for ${username}`,
            },
            user: {
                id: userId.data?.id!
            }
        });

        const firstTeamId = newTeam.data?.id!
        cookies().set('keel.auth', response.data.token, { httpOnly: true, secure: true, sameSite: 'strict' })
        return { type: 'success', firstTeamId }
    } catch (e: any) {
        return { type: 'error', message: e.message }
    }
};