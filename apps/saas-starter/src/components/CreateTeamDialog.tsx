import { Dialog } from '@radix-ui/react-dialog';
import { FC, PropsWithChildren, useRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { CreateTeamForm } from './CreateTeamForm';
import { DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

type Props = {
  isOpen: boolean;
  close: () => void;
};

export const CreateTeamDialog: FC<PropsWithChildren<Props>> = ({
  close,
  isOpen,
}) => {
  const closeDialogRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog open={isOpen}>
      <DialogPrimitive.Close ref={closeDialogRef}></DialogPrimitive.Close>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        <CreateTeamForm close={() => close()} />
      </DialogContent>
    </Dialog>
  );
};
