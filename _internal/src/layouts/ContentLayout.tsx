import { PropsWithChildren } from "react";

const Root = (props: PropsWithChildren) => {
  return (
    <div className="flex flex-col w-full max-w-6xl gap-12 md:flex-row">
      {props.children}
    </div>
  );
};

const Aside = (props: PropsWithChildren) => {
  return <aside className="w-full md:w-2/5">{props.children}</aside>;
};

const Main = (props: PropsWithChildren) => {
  return <main className="w-full md:w-3/5">{props.children}</main>;
};

export const ContentLayout = {
  Root,
  Aside,
  Main,
};
