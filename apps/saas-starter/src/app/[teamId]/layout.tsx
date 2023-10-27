import 'react-quill/dist/quill.snow.css';

import { Sidebar } from '@/components/Sidebar';
import { LayoutProps } from '../../../.next/types/app/layout';
import { cookies } from 'next/headers';
import { keelClient } from '@/util/clients';
import { redirect } from 'next/navigation';

type Props = {
  children: React.ReactNode;
} & LayoutProps;

export default async function SidebarLayout({ children, params }: Props) {
  try {
    const token = cookies().get('keel.auth')?.value ?? '';
    keelClient.client.setToken(token);
    const me = await keelClient.api.queries.me();
    if (!me.data) {
      throw new Error('Not logged in');
    }
  } catch {
    redirect('/');
  }

  return (
    <div className="flex flex-row h-full">
      <Sidebar teamId={params.teamId} />
      <main className="flex-1 p-16 overflow-scroll">{children}</main>
    </div>
  );
}
