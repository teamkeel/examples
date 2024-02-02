'use server';

import { FormType } from '@/util/FormType';
import { createClient } from '@/util/createClient';
import { revalidatePath } from 'next/cache';

export const createTeam = async (
  _: FormType,
  formData: FormData
): Promise<FormType> => {
  const keelClient = await createClient();
  if (!keelClient.ctx.isAuthenticated) {
    return { type: 'error', message: 'No token found.' };
  }

  const name = formData.get('name')?.toString() ?? '-';
  const description = formData.get('description')?.toString() ?? '-';

  if (!name) {
    return { type: 'error', message: 'Please enter a valid name.' };
  }

  revalidatePath('/');

  const data = {
    name,
    description,
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

  return { type: 'success', newTeamId: newTeam.data?.teamId ?? '' } as const;
};
