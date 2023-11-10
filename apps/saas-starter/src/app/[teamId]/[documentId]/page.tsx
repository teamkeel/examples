import ReactMarkdown from 'react-markdown';
import { createClient } from '@/util/createClient';
import { PageProps } from '../../../../.next/types/app/layout';

export default async function AppHome({ params }: PageProps) {
  const { documentId } = params;

  const document = await createClient().api.queries.getDocument({
    id: documentId,
  });

  return (
    <div className="document grid gap-4 max-w-[768px]">
      <h1 className="text-4xl font-bold text-white bg-transparent border-0">
        {document.data?.title}
      </h1>
      <ReactMarkdown>{document.data?.content}</ReactMarkdown>
    </div>
  );
}
