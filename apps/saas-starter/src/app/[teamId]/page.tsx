import 'react-quill/dist/quill.snow.css';

import { Sidebar } from '@/components/Sidebar';
import { LayoutProps } from '../../../.next/types/app/layout';
import { cookies } from 'next/headers';
import { keelClient } from '@/util/clients';
import { redirect } from 'next/navigation';
import { H1 } from '@/components/H1';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Props = {
  children: React.ReactNode;
} & LayoutProps;

export default async function SidebarLayout({ children, params }: Props) {
  const { teamId } = params;

  const token = cookies().get('keel.auth')?.value ?? '';
  keelClient.client.setToken(token);

  const firstDocument = (
    await keelClient.api.queries.listDocuments({
      where: { team: { id: { equals: teamId } } },
    })
  ).data?.results?.[0];

  if (firstDocument) {
    redirect(`/${teamId}/${firstDocument.id}`);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-4">
      <H1>No Documents</H1>
      <p>
        To get started,{' '}
        <Link href={`/${teamId}/new`}>create your first document</Link>.
      </p>
    </div>
  );
}
