import { keelClient } from '@/util/clients';
import { cookies } from 'next/headers';
import TeamSwitcher from './TeamSwitcher';
import { redirect } from 'next/navigation';

type Props = {
  teamId: string;
};

export const TeamSwitcherServer = async ({ teamId }: Props) => {
  keelClient.client.setToken(cookies().get('keel.auth')?.value ?? '-');

  try {
    const teams =
      (await keelClient.api.queries.listTeams()).data?.results.map((team) => ({
        id: team.id,
        label: team.name,
        value: team.name,
      })) ?? [];
    return <TeamSwitcher teamId={teamId} teams={teams} />;
  } catch {
    redirect('/');
  }
};
