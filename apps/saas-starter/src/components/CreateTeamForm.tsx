'use client';

import { createTeam } from '@/app/actions/createTeam';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useFormState } from 'react-dom';
import { FC } from 'react';
import { useRouter } from 'next/navigation';

export const CreateTeamForm: FC<{ close: () => void }> = ({ close }) => {
  const [state, action] = useFormState(createTeam, { type: 'initial' });
  const { push } = useRouter();

  if (state.type === 'success') {
    close();
    push(`/${state.newTeamId}`);
  }

  return (
    <form action={action} className="grid gap-2">
      <Input
        name="name"
        type="text"
        placeholder="Team Name"
        required
        className="p-2 text-white border rounded"
      />
      <Input
        name="description"
        type="text"
        placeholder="Description"
        className="p-2 text-white border rounded"
      />
      <Button type="submit" className="w-full p-2">
        Submit
      </Button>
      {state.type === 'error' && (
        <span className="text-xs text-red-300">
          <strong>Error: </strong>
          {state.message}
        </span>
      )}
    </form>
  );
};
