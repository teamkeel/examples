'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { Button } from './ui/button';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from 'cmdk';

export function MemberRolePopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="ml-auto">
          Owner
          <ChevronDownIcon className="w-4 h-4 ml-2 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 border rounded shadow border-zinc-800 bg-zinc-900 "
        align="end"
      >
        <Command className="text-sm font-medium">
          <CommandList>
            <CommandEmpty>No roles found.</CommandEmpty>
            <CommandGroup>
              <CommandItem className="flex hover:bg-[#fff1] cursor-pointer flex-col items-start px-2 py-2">
                <p>Viewer</p>
                <p className="font-normal text-muted-foreground">
                  Can view and comment.
                </p>
              </CommandItem>
              <CommandItem className="flex hover:bg-[#fff1] cursor-pointer flex-col items-start px-2 py-2">
                <p>Developer</p>
                <p className="font-normal text-muted-foreground">
                  Can view, comment and edit.
                </p>
              </CommandItem>
              <CommandItem className="flex hover:bg-[#fff1] cursor-pointer flex-col items-start px-2 py-2">
                <p>Billing</p>
                <p className="font-normal text-muted-foreground">
                  Can view, comment and manage billing.
                </p>
              </CommandItem>
              <CommandItem className="flex hover:bg-[#fff1] cursor-pointer flex-col items-start px-2 py-2">
                <p>Owner</p>
                <p className="font-normal text-muted-foreground">
                  Admin-level access to all resources.
                </p>
              </CommandItem>
              <hr />
              <CommandItem className="flex hover:bg-[#f001] cursor-pointer  flex-col items-start px-2 py-2">
                <p className="text-destructive">Remove member</p>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
