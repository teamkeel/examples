import { Inner } from '@/components/Inner';
import { FileIcon, GearIcon, PlusIcon } from '@radix-ui/react-icons';
import { NavItem } from './NavItem';
import { TeamSwitcherServer } from './TeamSwitcher.server';
import { keelClient } from '@/util/clients';
import Link from 'next/link';
import { Suspense } from 'react';
import { Skeleton } from './Skeleton';

type Props = { teamId?: string };

export async function Sidebar(props: Props) {
  const { teamId } = props;

  const me = (await keelClient.api.queries.me()).data!;
  const documents = teamId
    ? await keelClient.api.queries.listDocuments({
        where: {
          team: { id: { equals: teamId } },
        },
      })
    : { data: { results: [] } };

  return (
    <aside className="flex flex-col h-full border-r w-70 bg-slate-3">
      <Inner>
        <Suspense
          fallback={
            <>
              <Skeleton className="h-[36px]" />
              <button />
            </>
          }
        >
          <TeamSwitcherServer teamId={teamId || ''} />
        </Suspense>
      </Inner>
      <div className="flex-1">
        <Inner className="p-4 pt-2">
          <NavItem
            href={`/${teamId}/settings`}
            title="Settings"
            icon={<GearIcon />}
          />
          <div className="flex items-center pt-6">
            <p className="flex-1 py-1 text-xs font-medium text-muted-foreground">
              Documents
            </p>
          </div>
          {(documents.data?.results ?? []).map((document) => (
            <NavItem
              icon={<FileIcon />}
              key={document.id}
              href={`/${teamId}/${document.id}`}
              title={document.title}
            />
          ))}
          <NavItem
            href={`/${teamId}/new`}
            title="Add Document"
            icon={<PlusIcon />}
          />
        </Inner>
      </div>
      <div className="border-t">
        <Inner className="flex items-center gap-3">
          <img
            alt={me.name}
            width="32"
            className="rounded-full"
            src={`https://avatar.vercel.sh/${me.email}.png`}
          />
          <div>
            <p className="text-sm font-medium">{me.email}</p>
            <Link
              href="/logout"
              className="text-xs font-medium text-muted-foreground"
            >
              Logout
            </Link>
          </div>
        </Inner>
      </div>
    </aside>
  );
}
