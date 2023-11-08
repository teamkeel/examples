import { Sidebar } from '@/components/Sidebar';
import { LayoutProps } from '../../../.next/types/app/layout';

type Props = {
  children: React.ReactNode;
} & LayoutProps;

export default async function SidebarLayout({ children, params }: Props) {
  return (
    <div className="flex flex-row h-full">
      <Sidebar teamId={params.teamId} />
      <main className="flex-1 p-16 overflow-scroll">{children}</main>
    </div>
  );
}
