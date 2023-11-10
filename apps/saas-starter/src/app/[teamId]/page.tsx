import 'react-quill/dist/quill.snow.css';

import { redirect } from 'next/navigation';
import { H1 } from '@/components/H1';
import Link from 'next/link';
import { createClient } from '@/util/createClient';

type Props = { params: { teamId: string } };

export default async function Page({ params }: Props) {
  const { teamId } = params;
  const keelClient = createClient();
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
