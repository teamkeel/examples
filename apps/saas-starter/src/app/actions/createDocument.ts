'use server';

import { CreateDocumentInput } from "@/lib/keelClient";
import { FormType } from "@/util/FormType";
import { keelClient } from "@/util/clients";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const createDocument = async (state: FormType, formData: FormData): Promise<FormType> => {
    const token = cookies().get('keel.auth')?.value ?? '';
    keelClient.client.setToken(token);

    const title = formData.get('title')?.toString() ?? ''
    const content = formData.get('content')?.toString() ?? ''
    const teamId = formData.get('teamId')?.toString() ?? ''
    const user = (await keelClient.api.queries.me()).data!

    const options: CreateDocumentInput = {
        title,
        content,
        user: { id: user.id },
        team: { id: teamId }
    }

    const newDocument = await keelClient.api.mutations.createDocument(options)

    revalidatePath('/')
    return { type: 'success', documentId: newDocument.data?.id ?? '' }
}