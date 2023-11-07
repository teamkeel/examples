import { PropsWithChildren } from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import { TeamDetailsForm } from './forms/teamDetailsForm';
import { keelClient } from '@/util/clients';
// import { Billing } from './forms/billing';
// import { TeamMembers } from './forms/members';

export default async function TeamSettings({
  params,
}: {
  params: { teamId: string };
}) {
  const teamName = (await keelClient.api.queries.getTeam({ id: params.teamId }))
    .data?.name;

  return (
    <PageWrap>
      <h2 className="text-xl font-bold">Team settings</h2>
      <p className="text-muted-foreground">
        Manage your team details, members and billing information
      </p>
      <hr className="my-6" />
      {/* <div>
        <Button variant={"link"}>Members</Button>
        <Button variant={"link"}>Billing</Button>
        <Button variant={"link"}>Delete</Button>
      </div> */}
      {/* <h2 className="text-xl font-bold">Settings</h2> */}
      <div className="flex">
        <aside className="w-1/3">
          <p className="font-semibold">Team details</p>
        </aside>
        <div className="w-2/3">
          <TeamDetailsForm teamId={params.teamId} teamName={teamName} />
        </div>
      </div>
      <hr className="my-6" />
      <div className="flex">
        <aside className="w-1/3">
          <p className="font-semibold">Members</p>
        </aside>
        <div className="w-2/3">{/* <TeamMembers /> */}</div>
      </div>
      <hr className="my-6" />
      <div className="flex">
        <aside className="w-1/3">
          <p className="font-semibold">Billing</p>
        </aside>
        <div className="w-2/3">{/* <Billing /> */}</div>
      </div>
      <hr className="my-6" />
      <div className="flex">
        <aside className="w-1/3">
          <p className="font-semibold">Delete team</p>
        </aside>
        <div className="w-2/3">
          <Button variant={'destructive'}>Delete team</Button>
        </div>
      </div>
    </PageWrap>
  );
}

const PageWrap = (props: { className?: string } & PropsWithChildren) => {
  return (
    <div className={cn('p-5 w-full', props.className)}>{props.children}</div>
  );
};
