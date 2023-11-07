import { editTeam } from '@/app/actions/editTeam';
import { Label } from '@/components/Label';
import { Input } from '@/components/ui/input';
import { PropsWithChildren } from 'react';
import { EditTeamButton } from '@/components/EditTeamButton';

export const TeamDetailsForm = ({
  teamId,
  teamName,
}: PropsWithChildren<{ teamName: string; teamId: string }>) => {
  return (
    <form
      encType="multipart/form-data"
      className="grid gap-4"
      action={editTeam}
    >
      <Label>
        Team Name
        <Input
          required
          type="text"
          placeholder="Infinite Sharks"
          name="teamName"
          defaultValue={teamName}
        />
      </Label>
      <input type="hidden" name="teamId" value={teamId} />
      <Label>
        Avatar
        <Input
          type="file"
          accept="image/png,image/jpeg"
          className="text-white"
          name="logo"
        />
      </Label>
      <EditTeamButton />
    </form>
  );
};
