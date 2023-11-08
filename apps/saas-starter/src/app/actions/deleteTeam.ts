'use server';

import { FormType } from "@/util/FormType";
import { keelClient } from "@/util/clients";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const deleteTeam = async (_: FormType, formData: FormData): Promise<FormType> => {
    const token = cookies().get('keel.auth')?.value ?? "";
    keelClient.client.setToken(token);
    try {
        await keelClient.api.mutations.deleteTeam({ id: formData.get('teamId')?.toString() ?? "" })
        revalidatePath('/')
        return { type: "success" }
    } catch (e: any) {
        return { type: "error", message: `Failed to delete team with: ${e.message}.` }
    }
}