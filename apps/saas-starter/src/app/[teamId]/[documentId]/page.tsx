import { cookies } from 'next/headers';
import { keelClient } from '@/util/clients';
import ReactMarkdown from 'react-markdown';
import { PageProps } from '../../../../.next/types/app/[teamId]/[documentId]/page';

export default async function AppHome({ params }: PageProps) {
  const { documentId } = params;

  const token = cookies().get('keel.auth')?.value ?? '';
  keelClient.client.setToken(token);

  const document = await keelClient.api.queries.getDocument({
    id: documentId,
  });

  return (
    <div className="grid gap-4 max-w-[768px]">
      <h1 className="text-4xl font-bold text-white bg-transparent border-0">
        {document.data?.title}
      </h1>
      <ReactMarkdown>{document.data?.content}</ReactMarkdown>
    </div>
  );
}
