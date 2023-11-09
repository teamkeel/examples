import { PropsWithChildren } from 'react';

export const Label = (props: PropsWithChildren) => (
  <label className="grid gap-1 text-xs text-neutral-400">
    {props.children}
  </label>
);
