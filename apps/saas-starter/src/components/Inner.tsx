import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

export const Inner = (props: { className?: string } & PropsWithChildren) => {
  return <div className={cn('p-3', props.className)}>{props.children}</div>;
};
