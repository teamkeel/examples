'use server';

import { CreateDocumentInput } from "@/lib/keelClient";
import { FormType } from "@/util/FormType";
import { createClient } from "@/util/createClient";
import { revalidatePath } from "next/cache";

export const createDocument = async (_: FormType, formData: FormData): Promise<FormType> => {
    const keelClient = createClient();

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