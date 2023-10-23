import { PropsWithChildren } from "react";

export const Tag = (props: PropsWithChildren) => {
  return (
    <div className="bg-sand text-secondary px-2 py-1 rounded text-sm">
      {props.children}
    </div>
  );
};
