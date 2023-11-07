'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CaretSortIcon, CheckIcon, PlusIcon } from '@radix-ui/react-icons';
import {
  Command,
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
import { CreateTeamDialog } from './CreateTeamDialog';
import { useRouter } from 'next/navigation';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {
  teamId: string;
  teams: { id: string; label: string; value: string }[];
}

export default function TeamSwitcher({ teams, teamId }: TeamSwitcherProps) {
  const selectedTeam = teams.find((t) => t.id === teamId)!;
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
  const { push } = useRouter();

  return (
    <>
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-label="Select a team"
              className={cn('w-full justify-between p-3')}
            >
              {selectedTeam && teams.length > 0 ? (
                <>
                  <Avatar className="w-5 h-5 mr-2">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${selectedTeam.value}.png`}
                      alt={selectedTeam.label}
                    />
                    <AvatarFallback>
                      {selectedTeam.label[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {selectedTeam.label}
                </>
              ) : (
                'No Teams'
              )}
              <CaretSortIcon className="w-4 h-4 ml-auto opacity-50 shrink-0" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="p-0" align={'start'} alignOffset={0}>
            <Command>
              <CommandList>
                <CommandInput placeholder="Search teams..." />
                <CommandGroup heading="Teams">
                  {teams.map((team) => (
                    <CommandItem
                      key={team.id}
                      onSelect={() => {
                        push(`/${team.id}`);
                      }}
                      className="text-sm cursor-pointer"
                    >
                      <Avatar className="w-5 h-5 mr-2">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${team.value}.png`}
                          alt={team.label}
                          className="grayscale"
                        />
                        <AvatarFallback>
                          {team.label[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {team.label}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedTeam?.value === team.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                  <CommandItem
                    className="flex items-center gap-2 text-gray-400 cursor-pointer"
                    onSelect={() => setIsCreateTeamDialogOpen(true)}
                  >
                    <PlusIcon /> Create New Team
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <CreateTeamDialog
        isOpen={isCreateTeamDialogOpen}
        close={() => setIsCreateTeamDialogOpen(false)}
      />
    </>
  );
}
