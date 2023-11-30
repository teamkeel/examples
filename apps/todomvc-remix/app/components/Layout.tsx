import { PropsWithChildren } from "react";
import { KeelLogo } from "./KeelLogo";

export function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <div className="container">
      <header style={{ paddingBlock: "2rem" }}>
        <h1
          style={{ margin: 0, display: "flex", alignItems: "center", gap: 16 }}
        >
          <KeelLogo /> x <span>TodoMVC</span>
        </h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
