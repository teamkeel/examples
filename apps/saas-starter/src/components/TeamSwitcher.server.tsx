import { keelClient } from '@/util/clients';
import TeamSwitcher from './TeamSwitcher';

type Props = {
  teamId: string;
};

export const TeamSwitcherServer = async ({ teamId }: Props) => {
  const teams =
    (await keelClient.api.queries.listTeams()).data?.results.map((team) => ({
      id: team.id,
      label: team.name,
      value: team.name,
    })) ?? [];
  return <TeamSwitcher teamId={teamId} teams={teams} />;
};
