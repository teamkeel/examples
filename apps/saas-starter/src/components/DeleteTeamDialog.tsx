'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './ui/button';
import { DialogFooter } from './ui/dialog';
import { Label } from './Label';
import { Input } from './ui/input';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { deleteTeam } from '@/app/actions/deleteTeam';
import { DeleteFormButton } from './DeleteFormButton';
import { useRouter } from 'next/navigation';

export function DeleteTeamDialog({
  children,
  teamName,
  teamId,
}: PropsWithChildren<{ teamName: string; teamId: string }>) {
  const [shouldShowDialog, setShouldShowDialog] = useState(false);
  const [verifyName, setVerifyName] = useState('');
  const [state, action] = useFormState(deleteTeam, { type: 'initial' });
  const { push } = useRouter();

  useEffect(() => {
    if (state.type === 'success') {
      push('/');
    }
  }, [state]);

  return (
    <Dialog.Root
      open={shouldShowDialog}
      onOpenChange={() => setShouldShowDialog(true)}
    >
      {children}
      <Dialog.Trigger asChild>
        <Button variant="destructive">Delete Team</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Delete Team</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            To confirm you want to delete this team, please type its name and
            confirm.
          </Dialog.Description>
          <form action={action}>
            <div>
              <div className="py-2 pb-4 space-y-4">
                <div className="space-y-2">
                  <Label>
                    Team Name
                    <Input
                      value={verifyName}
                      onChange={(e) => setVerifyName(e.target.value)}
                      name="teamName"
                      placeholder={teamName}
                    />
                  </Label>
                  {state.type === 'error' && (
                    <div className="text-xs text-red-400">
                      <strong>Error: </strong>
                      {state.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <input type="hidden" name="teamId" value={teamId} />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShouldShowDialog(false)}
              >
                Cancel
              </Button>
              <DeleteFormButton verifyName={verifyName} teamName={teamName} />
            </DialogFooter>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
