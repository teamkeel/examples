import DocumentPage from '@/app/app/document/[id]/page';

export default function DocPage({ params }: { params: { doc_id: string } }) {
  return (
    <DocumentPage
      params={{
        id: params.doc_id,
      }}
    />
  );
}
