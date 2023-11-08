'use client';

import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';
import { UpdateIcon } from '@radix-ui/react-icons';

export function DeleteFormButton({
  verifyName,
  teamName,
}: {
  verifyName: string;
  teamName: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || verifyName !== teamName}
      variant="destructive"
    >
      {pending && <UpdateIcon className="w-4 h-4 mr-2 animate-spin" />}
      Continue
    </Button>
  );
}
