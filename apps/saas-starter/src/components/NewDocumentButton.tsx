import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';
import { UpdateIcon } from '@radix-ui/react-icons';

export function NewDocumentButton() {
  const { pending } = useFormStatus();

  return (
    <Button>
      {pending ? (
        <>
          <UpdateIcon className="w-4 h-4 mr-2 animate-spin" /> Saving...
        </>
      ) : (
        'Save'
      )}
    </Button>
  );
}
