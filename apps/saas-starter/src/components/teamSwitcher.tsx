'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CaretSortIcon, CheckIcon, PlusIcon } from '@radix-ui/react-icons';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useUser } from '@/lib/userContext';
import { useKeel } from '@/app/layout';

const groups = [
  {
    teams: [
      {
        label: 'Select User/Team',
        value: 'personal',
      },
    ],
  },
];

type Team = (typeof groups)[number]['teams'][number];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {}

export default function TeamSwitcher({}: TeamSwitcherProps) {
  const router = useRouter();
  const keel = useKeel();
  const { token } = useUser();
  keel.client.setHeader('Authorization', 'Bearer ' + token);
  keel.client.setToken(token as string);

  const [open, setOpen] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Team>(
    groups[0].teams[0]
  );
  const [fetchedTeams, setFetchedTeams] = React.useState<Team[]>([]);
  const [fetchedUsers, setFetchedUsers] = React.useState<Team[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const closeDialogRef = React.useRef<HTMLButtonElement>(null);

  const params = useParams();
  const fetchTeams = React.useCallback(async () => {
    try {
      const response = await keel.api.queries.listTeams();
      const teams =
        response.data?.results.map((team: { name: string }) => ({
          label: team.name,
          value: team.name,
        })) || [];
      if (teams) {
        setFetchedTeams(teams);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  }, [keel.api.queries]);

  const fetchUsers = React.useCallback(async () => {
    try {
      const response = await keel.api.queries.listUsers();
      const users = response.data?.results.map(
        (user: { name: string }) =>
          ({
            label: user.name,
            value: user.name,
          }) || []
      );
      if (users) {
        setFetchedUsers(users);
      }
      // lets make sure we persist the current user
      if (params.id) {
        setSelectedTeam((prev) => {
          const currentUser = users?.find((usr) => usr.value === params.id);
          if (currentUser) return currentUser;
          return prev;
        });
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  }, [keel.api.queries, params.id]);

  React.useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, [fetchTeams, fetchUsers]);

  const allTeams = [
    {
      label: 'Personal Accounts',
      teams: fetchedUsers,
    },
    {
      label: 'Teams',
      teams: fetchedTeams,
    },
  ];

  const handleCreateTeam = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    };

    try {
      const userId = await keel.api.queries.me();

      const response = await keel.api.mutations.createTeam({
        team: {
          name: data.name,
          description: data.description,
        },
        user: {
          id: userId.data?.id as string,
        },
      });
      if (response.error) {
        setErrorMessage((response.error as any).message);
      } else {
        await fetchTeams();
        setIsDialogOpen(false);
        closeDialogRef.current?.click();
        router.push(`/app/${response.data?.teamId}`);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const ClearError = () => {
    setErrorMessage('');
    keel.ctx;
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isDialogOpen}
            aria-label="Select a team"
            className={cn('w-full justify-between p-3')}
          >
            <Avatar className="w-5 h-5 mr-2">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedTeam.value}.png`}
                alt={selectedTeam.label}
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {selectedTeam.label}
            <CaretSortIcon className="w-4 h-4 ml-auto opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0" align={'start'} alignOffset={0}>
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No team found.</CommandEmpty>
              {allTeams.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.teams.map((team) => (
                    <CommandItem
                      key={team.value}
                      onSelect={() => {
                        setSelectedTeam(team);
                        router.push(`/app/${team.value}`);
                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      <Avatar className="w-5 h-5 mr-2">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${team.value}.png`}
                          alt={team.label}
                          className="grayscale"
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      {team.label}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedTeam.value === team.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                  {group.label === 'Teams' && (
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
                          <DialogTitle>Create New Team</DialogTitle>
                        </DialogHeader>
                        <form onFocus={ClearError} onSubmit={handleCreateTeam}>
                          <Input
                            name="name"
                            type="text"
                            placeholder="Team Name"
                            required
                            className="p-2 text-white border rounded"
                          />
                          <Input
                            name="description"
                            type="text"
                            placeholder="Description"
                            className="p-2 mt-3 text-white border rounded"
                          />
                          <DialogFooter>
                            <Button type="submit" className="p-2 mt-6">
                              Submit
                            </Button>
                          </DialogFooter>
                        </form>
                        <DialogPrimitive.Close
                          ref={closeDialogRef}
                        ></DialogPrimitive.Close>
                        {errorMessage && <p>{errorMessage}</p>}
                      </DialogContent>
                    </Dialog>
                  )}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
