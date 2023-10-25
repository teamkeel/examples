import { PropsWithChildren, useMemo, useState, useEffect, useRef } from 'react';
import TeamSwitcher from '../../components/teamSwitcher';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar';
import { cn } from '../../lib/utils';
import Link from 'next/link';
import { FileIcon, GearIcon, PlusIcon } from '@radix-ui/react-icons';
import { Button } from '../../components/ui/button';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div>Loading editor...</div>,
});

import 'react-quill/dist/quill.snow.css';

import { useProtectedRoute } from '@/components/hooks/useProtectedRoute';
import { useUser } from '@/lib/userContext';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useParams } from 'next/navigation';
import { useKeel } from '@/components/Providers';

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useUser();

  useProtectedRoute();
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-row h-full">
      <Sidebar />
      <main className="flex-1 overflow-scroll">{children}</main>
    </div>
  );
}

type Document = {
  id: string;
  title: string;
  content: string;
};

const Sidebar = () => {
  const params = useParams();

  const [document, setDocument] = useState<Document[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');
  const { token, setUserId } = useUser();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const closeDialogRef = useRef<HTMLButtonElement>(null);

  const keel = useKeel();

  keel.client.setHeader('Authorization', 'Bearer ' + token);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await keel.api.queries.listDocuments();
        setDocument(response.data?.results || []);
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    }
    fetchDocuments();
  }, [keel.api.queries]);

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await keel.api.queries.me();
    const userId = user.data?.id || [];

    setUserId(userId as string);
    const newDocument = {
      title: docTitle,
      content: docContent,
      user: {
        id: userId as string,
      },
    };

    const response = await keel.api.mutations.createDocument(newDocument);

    if (response && !response.error) {
      const createdDocument = {
        id: response.data.id,
        ...newDocument,
      };
      setDocument((prevDocuments) => [...prevDocuments, createdDocument]);
      setDocTitle('');
      setDocContent('');
      setIsDialogOpen(false);
      closeDialogRef.current?.click();
    } else {
      setErrorMessage(`${response.error}`);
    }
  };

  const buildURL = (id: string) => {
    const prefixURL = id === 'settings' ? `/settings` : `/document/${id}`;

    if (params.id) {
      return `/app/${params.id}${prefixURL}`;
    }

    return `/app/${prefixURL}`;
  };

  return (
    <aside className="flex flex-col h-full border-r w-60 bg-slate-3">
      <Inner>
        <TeamSwitcher />
      </Inner>
      <div className="flex-1">
        <Inner className="p-4 pt-2">
          <NavItem
            href={buildURL('settings')}
            title="Settings"
            icon={<GearIcon />}
          />
          <div className="flex items-center pt-6">
            <p className="flex-1 py-1 text-xs font-medium text-muted-foreground">
              Documents
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={'ghost'}
                  size={'icon-sm'}
                  className="hover:bg-slate-5 text-muted-foreground hover:text-accent-foreground"
                >
                  <PlusIcon />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Document</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateDocument}>
                  <Input
                    type="text"
                    placeholder="Document Title"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    className="placeholder-gray-300"
                    required
                  />
                  <ReactQuill
                    value={docContent}
                    onChange={setDocContent}
                    placeholder="Please type in your Document"
                    className="mt-5 placeholder-white"
                  />
                  <DialogFooter>
                    <Button className="p-2 mt-5" type="submit">
                      Create Document
                    </Button>
                  </DialogFooter>
                </form>
                <DialogPrimitive.Close
                  ref={closeDialogRef}
                ></DialogPrimitive.Close>
                {errorMessage && <p>{errorMessage}</p>}
              </DialogContent>
            </Dialog>
          </div>
          {/* Render fetched documents */}
          {document.map((document) => (
            <NavItem
              icon={<FileIcon />}
              key={document.id}
              href={buildURL(document.id)}
              title={document.title}
            />
          ))}
        </Inner>
      </div>
      <div className="border-t">
        <Inner className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">User name</p>
            <p className="text-xs font-medium text-muted-foreground">
              email@domain.com
            </p>
          </div>
        </Inner>
      </div>
    </aside>
  );
};

const NavItem = (props: {
  title: string;
  href?: string;
  icon?: React.ReactNode;
}) => {
  const content = (
    <div className="flex items-center gap-2 p-1 px-2 -mx-2 text-sm font-medium rounded hover:bg-slate-5 text-secondary-foreground">
      {props.icon && (
        <span className="w-[15px] flex justify-center">{props.icon}</span>
      )}
      {props.title}
    </div>
  );

  if (props.href) {
    return (
      <Link className="no-underline" href={props.href}>
        {content}
      </Link>
    );
  }

  return content;
};

const Inner = (props: { className?: string } & PropsWithChildren) => {
  return <div className={cn('p-3', props.className)}>{props.children}</div>;
};
