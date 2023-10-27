'use server'

import { FormType } from "@/util/FormType";
import { keelClient } from "@/util/clients";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const createTeam = async (_: FormType, formData: FormData): Promise<FormType> => {
    const token = cookies().get('keel.auth')?.value;
    if (!token) {
        return { type: "error", message: "No token found." }
    }

    const name = formData.get('name')?.toString() ?? "-";
    const description = formData.get('description')?.toString() ?? "-";

    if (!name) {
        return { type: "error", message: "Please enter a valid name." }
    }

    revalidatePath('/')
    keelClient.client.setToken(token);

    const data = {
        name, description
    };

    const userId = await keelClient.api.queries.me();
    const newTeam = await keelClient.api.mutations.createTeamMembership({
        team: {
            name: data.name,
            description: data.description,
        },
        user: {
            id: userId.data?.id as string,
        },
    });

    return { type: "success", newTeamId: newTeam.data?.teamId ?? "" } as const
};