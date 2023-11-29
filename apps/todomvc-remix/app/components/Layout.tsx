import { PropsWithChildren } from "react";

export function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <div className="container">
      <header style={{ paddingBlock: "2rem" }}>
        <h1 style={{ margin: 0 }}>
          Keel Logo x <span>TodoMVC</span>
        </h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
