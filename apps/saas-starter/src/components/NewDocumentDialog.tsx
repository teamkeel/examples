'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useUser } from '@/lib/userContext';
import { useKeel } from '@/util/clients';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { PlusIcon } from '@radix-ui/react-icons';
import { FC, useRef, useState } from 'react';
import ReactQuill from 'react-quill';

type Props = {
  onDocumentChange: any;
};

export const NewDocumentDialog: FC<Props> = ({ onDocumentChange }) => {
  const keel = useKeel();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');
  const { setUserId } = useUser();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const closeDialogRef = useRef<HTMLButtonElement>(null);

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await keel.api.queries.me();
    const userId = user.data?.id || [];

    setUserId(userId as string);
    const newDocument = {
      title: docTitle,
      content: docContent,
      user: {
        id: userId as string,
      },
    };

    const response = await keel.api.mutations.createDocument(newDocument);

    if (response && !response.error) {
      const createdDocument = {
        id: response.data.id,
        ...newDocument,
      };
      onDocumentChange((prevDocuments: Document[]) => [
        ...prevDocuments,
        createdDocument,
      ]);
      setDocTitle('');
      setDocContent('');
      setIsDialogOpen(false);
      closeDialogRef.current?.click();
    } else {
      setErrorMessage(`${response.error}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={'ghost'}
          size={'icon-sm'}
          className="hover:bg-slate-5 text-muted-foreground hover:text-accent-foreground"
        >
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateDocument}>
          <Input
            type="text"
            placeholder="Document Title"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            className="placeholder-gray-300"
            required
          />
          <ReactQuill
            value={docContent}
            onChange={setDocContent}
            placeholder="Please type in your Document"
            className="mt-5 placeholder-white"
          />
          <DialogFooter>
            <Button className="p-2 mt-5" type="submit">
              Create Document
            </Button>
          </DialogFooter>
        </form>
        <DialogPrimitive.Close ref={closeDialogRef}></DialogPrimitive.Close>
        {errorMessage && <p>{errorMessage}</p>}
      </DialogContent>
    </Dialog>
  );
};
