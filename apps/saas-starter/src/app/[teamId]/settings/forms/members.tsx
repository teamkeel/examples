import { Card, CardDescription } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import {
  ChevronDownIcon,
  DotsHorizontalIcon,
  DownloadIcon,
} from '@radix-ui/react-icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Label } from '../../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Input } from '../../../../components/ui/input';

export function TeamMembers() {
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);
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
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <div className="flex flex-col gap-4">
        <Card className="rounded shadow-none">
          {members.map((member) => (
            <div
              key={member.email}
              className="p-3 border-b last-of-type:border-none flex items-center gap-4"
            >
              <div>
                {!member.pending && (
                  <p className="font-medium text-sm">{member.name} </p>
                )}
                <p className="font-normal text-sm text-muted-foreground">
                  {member.email}
                </p>
              </div>
              {member.pending && (
                <span className="text-xs p-1 px-2 bg-amber-5 rounded-sm text-amber-12">
                  Invited
                </span>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Owner{' '}
                    <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="end">
                  <Command className="text-sm font-medium">
                    <CommandList>
                      <CommandEmpty>No roles found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem className="flex flex-col items-start px-2 py-2">
                          <p>Viewer</p>
                          <p className="font-normal text-muted-foreground">
                            Can view and comment.
                          </p>
                        </CommandItem>
                        <CommandItem className="flex flex-col items-start px-2 py-2">
                          <p>Developer</p>
                          <p className="font-normal text-muted-foreground">
                            Can view, comment and edit.
                          </p>
                        </CommandItem>
                        <CommandItem className="flex flex-col items-start px-2 py-2">
                          <p>Billing</p>
                          <p className="font-normal text-muted-foreground">
                            Can view, comment and manage billing.
                          </p>
                        </CommandItem>
                        <CommandItem className="flex flex-col items-start px-2 py-2">
                          <p>Owner</p>
                          <p className="font-normal text-muted-foreground">
                            Admin-level access to all resources.
                          </p>
                        </CommandItem>
                        <hr className="my-1" />
                        <CommandItem className="flex flex-col items-start px-2 py-2">
                          <p className="text-destructive">Remove member</p>
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </Card>
        <DialogTrigger asChild>
          <Button className="self-start">Invite member</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add member</DialogTitle>
            <DialogDescription>They will be invited by email</DialogDescription>
          </DialogHeader>
          <div>
            <div className="space-y-4 py-2 pb-4">
              <div className="space-y-2">
                <Label htmlFor="name">Email</Label>
                <Input id="email" placeholder="mick@mouse.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">
                      <span className="font-medium">Viewer</span> -{' '}
                      <span className="text-muted-foreground">
                        Can view content
                      </span>
                    </SelectItem>
                    <SelectItem value="editor">
                      <span className="font-medium">Editor</span> -{' '}
                      <span className="text-muted-foreground">
                        Can edit content
                      </span>
                    </SelectItem>
                    <SelectItem value="pro">
                      <span className="font-medium">Admin</span> -{' '}
                      <span className="text-muted-foreground">
                        Has full access
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewTeamDialog(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
}
