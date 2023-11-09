'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './ui/button';
import { DialogFooter, DialogHeader } from './ui/dialog';
import { Label } from './Label';
import { Input } from './ui/input';
import { PropsWithChildren, useState } from 'react';

export function AddTeamMemberDialog({ children }: PropsWithChildren) {
  const [shouldShowDialog, setShouldShowDialog] = useState(false);
  return (
    <Dialog.Root
      open={shouldShowDialog}
      onOpenChange={() => setShouldShowDialog(true)}
    >
      {children}
      <Dialog.Trigger asChild>
        <Button className="self-start">Invite member</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Add Member</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            They person will be added with the default role of Viewer which can
            be changed later.
          </Dialog.Description>
          <div>
            <div className="py-2 pb-4 space-y-4">
              <div className="space-y-2">
                <Label>
                  Email
                  <Input id="email" placeholder="mick@mouse.com" />
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShouldShowDialog(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
