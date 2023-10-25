import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useUser } from '@/lib/userContext';
import { Button } from '@/components/ui/button';
import debounce from '@/lib/debounce';
import { Input } from '@/components/ui/input';
import '../../../../styles/_textEditor.css';
import { useKeel } from '@/components/Providers';

export default function DocumentPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const keel = useKeel();

  const [document, setDocument] = useState<
    { id: string; title: string; content: string } | null | undefined
  >(null);
  const [isModified, setIsModified] = useState(false);
  const [loading, setLoading] = useState(true);
  const { token, setUserId, userId } = useUser();

  keel.client.setHeader('Authorization', 'Bearer ' + token);

  const fetchDocument = useCallback(async () => {
    const user = await keel.api.queries.me();
    const userId = user.data?.id || [];

    setUserId(userId as string);
    try {
      const response = await keel.api.queries.getDocument({
        id: id as string,
        userId: userId as string,
      });

      if (response.data !== null) {
        setDocument(response.data);
      } else {
        setDocument(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  }, [keel.api.queries, id, setUserId]);

  useEffect(() => {
    if (id) {
      fetchDocument();
    }
  }, [fetchDocument, id, userId]);

  const handleContentChange = debounce((content: string) => {
    if (document) {
      setDocument({ ...document, content });
      setIsModified(true);
    }
  }, 5000);

  const handleTitleChange = debounce(
    useCallback(
      (title: string) => {
        if (document) {
          setDocument({ ...document, title });
          setIsModified(true);
        }
      },
      [document]
    ),
    5000
  );

  const handleUpdate = async () => {
    if (document) {
      const requestBody = {
        values: {
          content: document.content,
          title: document.title,
          team: {
            id: null,
          },
          user: {
            id: userId as string,
          },
        },
        where: {
          id: document.id as string,
        },
      };
      try {
        await keel.api.mutations.updateDocument(requestBody);
        setIsModified(false);
      } catch (error) {
        console.error('Error updating document:', error);
      }
    }
  };

  const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <div>Loading editor...</div>,
  });

  return loading ? (
    <p>Loading...</p>
  ) : (
    <div>
      <Input
        type="text"
        value={document?.title || ''}
        onChange={handleTitleChange}
        className="mt-1 rounded-none cursor-text text-1xl focus:outline-none hover:outline-white"
        placeholder="Untitled"
      />

      <ReactQuill
        theme="snow"
        value={document?.content || ''}
        className="h-[75vh]"
        onChange={handleContentChange}
      />

      <div>
        {isModified && (
          <Button className="float-right p-2 mt-14" onClick={handleUpdate}>
            Save Document
          </Button>
        )}
      </div>
    </div>
  );
}
