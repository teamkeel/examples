'use server';

import { FormType } from '@/util/FormType';
import { createClient } from '@/util/createClient';
import { revalidatePath } from 'next/cache';

export const deleteTeam = async (
  _: FormType,
  formData: FormData
): Promise<FormType> => {
  const keelClient = await createClient();
  try {
    await keelClient.api.mutations.deleteTeam({
      id: formData.get('teamId')?.toString() ?? '',
    });
    revalidatePath('/');
    return { type: 'success' };
  } catch (e: any) {
    return {
      type: 'error',
      message: `Failed to delete team with: ${e.message}.`,
    };
  }
};
