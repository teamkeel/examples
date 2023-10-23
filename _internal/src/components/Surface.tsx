import { PropsWithChildren } from "react";

export const Surface = (props: PropsWithChildren) => {
  return (
    <div className="bg-white rounded-lg shadow-light overflow-hidden">
      {props.children}
    </div>
  );
};
