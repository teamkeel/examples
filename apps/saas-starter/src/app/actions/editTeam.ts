'use server'

import { createClient } from "@/util/createClient";
import { revalidatePath } from "next/cache";

export async function editTeam(formData: FormData) {

    try {
        const keelClient = createClient();
        let imagePath = undefined;
        const file = formData.get('logo') as File;

        if (file.size > 0) {
            const base64Image = 'data:image/png;base64,' + Buffer.from(await file.arrayBuffer()).toString('base64')
            const response = await keelClient.api.mutations.uploadTeamLogo({
                base64Image,
                teamId: formData.get('teamId')?.toString() ?? ""
            });
            imagePath = response.data?.path;

            if (!response.data || !response.data.path) {
                throw new Error('Failed to get the image path from the Keel function.');
            }
        }

        await keelClient.api.mutations.updateTeam({
            where: { id: formData.get('teamId')?.toString() ?? "" },
            values: {
                name: formData.get('teamName')?.toString() ?? "",
                logoUrl: imagePath
            }
        })

        revalidatePath('/')
    } catch (error) {
        console.error(error);
    }
}