'use client';

import { createDocument } from '@/app/actions/createDocument';
import { Button } from '@/components/ui/button';
import { redirect, useParams } from 'next/navigation';
import { useFormState } from 'react-dom';

export default function NewDocumentPage() {
  const [state, action] = useFormState(createDocument, { type: 'initial' });
  const params = useParams();

  if (state.type === 'success') {
    redirect(`/${params.teamId}/${state.documentId}`);
  }

  return (
    <form
      action={action}
      className="max-w-[768px] grid items-start h-full grid-rows-[auto,1fr] gap-4"
    >
      <input type="hidden" name="teamId" value={params.teamId} />
      <input
        required
        name="title"
        autoFocus
        className="text-4xl font-bold text-white bg-transparent border-0"
        type="text"
        placeholder="Lorem ipsum"
      ></input>
      <textarea
        required
        name="content"
        className="h-full text-white bg-transparent"
        placeholder={`An essay about why I love Lorem Ipsum: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.

Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue.

Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. `}
      ></textarea>
      <Button>Save</Button>
    </form>
  );
}
