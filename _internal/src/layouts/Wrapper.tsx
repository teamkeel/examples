import { PropsWithChildren } from "react";
import Logo from "../components/Logo";
import Link from "next/link";

export const PageWrapper = (props: PropsWithChildren) => {
  return (
    <div className="flex flex-col items-center justify-center pt-4">
      <div className="flex flex-col items-baseline w-full max-w-6xl mb-7">
        <section className="mb-8">
          <Link title="Keel Logo" href="/">
            <Logo height={32} />
          </Link>
        </section>
        {props.children}
      </div>
    </div>
  );
};
