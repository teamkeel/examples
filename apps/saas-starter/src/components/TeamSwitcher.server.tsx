import { createClient } from '@/util/createClient';
import TeamSwitcher from './teamSwitcher';

type Props = {
  teamId: string;
};

export const TeamSwitcherServer = async ({ teamId }: Props) => {
  const keelClient = createClient();
  const teams =
    (await keelClient.api.queries.listTeams()).data?.results.map((team) => ({
      id: team.id,
      label: team.name,
      value: team.name,
      logoUrl: team.logoUrl,
    })) ?? [];
  return <TeamSwitcher teamId={teamId} teams={teams} />;
};
