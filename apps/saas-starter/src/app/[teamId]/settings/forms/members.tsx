import { AddTeamMemberDialog } from '@/components/AddTeamMemberDialog';
import { Card } from '../../../../components/ui/card';
import { MemberRolePopover } from '@/components/MemberRolePopover';

export function TeamMembers() {
  const members = [
    {
      name: 'Kevin Marks',
      email: 'k.marks@bigco.com',
      role: 'Admin',
      pending: false,
    },
    {
      name: 'Rebecca Houser',
      email: 'r.houser@bigco.com',
      role: 'Editor',
      pending: false,
    },
    {
      name: 'Sarah Martins',
      email: 's.martins@bigco.com',
      role: 'Editor',
      pending: true,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <AddTeamMemberDialog>
        <Card className="rounded shadow-none">
          {members.map((member) => (
            <div
              key={member.email}
              className="flex items-center gap-4 p-3 border-b last-of-type:border-none"
            >
              <div>
                {!member.pending && (
                  <p className="text-sm font-medium">{member.name} </p>
                )}
                <p className="text-sm font-normal text-muted-foreground">
                  {member.email}
                </p>
              </div>
              {member.pending && (
                <span className="p-1 px-2 text-xs rounded-sm bg-amber-5 text-amber-12">
                  Invited
                </span>
              )}
              <MemberRolePopover />
            </div>
          ))}
        </Card>
      </AddTeamMemberDialog>
    </div>
  );
}
