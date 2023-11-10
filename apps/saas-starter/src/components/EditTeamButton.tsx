'use client';

import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';
import { UpdateIcon } from '@radix-ui/react-icons';

export const EditTeamButton = (props: { disabled?: boolean }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={props.disabled || pending}
      variant="secondary"
      type="submit"
    >
      {pending ? (
        <>
          <UpdateIcon className="w-4 h-4 mr-2 animate-spin" /> Updating...
        </>
      ) : (
        'Update'
      )}
    </Button>
  );
};
