import { MouseEventHandler, useEffect, useState } from "react";
import { Surface } from "./Surface";
import Link from "next/link";
import classnames from "classnames";
import { useRouter } from "next/router";

export const TabbedContent = (props: {
  files: {
    title: string;
    content: string;
    rawContent?: string;
  }[];
}) => {
  const router = useRouter();

  if (!props.files) {
    return;
  }

  const activeFilename = router.query.f || props.files[0].title;
  const activeFile =
    (activeFilename
      ? props.files.find((f) => f.title == activeFilename)
      : props.files[0]) || props.files[0];

  // Feels like we shouldn't have to do this just to get the path without query string
  const url = new URL(router.asPath, "http://dummy.com");
  const pathname = url.pathname;

  return (
    <Surface>
      <div className="px-2 pt-2 flex gap-2 overflow-x-scroll">
        {props.files.map((f, i) => (
          <Link
            // TODO make this not actually navigate as we have all the data, we just want to update the query params
            href={{
              pathname: pathname,
              query: {
                f: f.title,
              },
            }}
            replace
            key={i}
            className={classnames({
              "py-2 px-3 pb-[6px] text-sm text-[11.5px] font-medium  self-start ":
                true,
              "border-[#286FDE] border-b-4 rounded-t-[4px] bg-[#0000000A]":
                activeFilename == f.title,
              "rounded-[4px] hover:bg-[#0000000A]": activeFilename != f.title,
            })}
          >
            {f.title}
          </Link>
        ))}
      </div>
      <hr />
      <div className="px-4 py-3 relative">
        <CopyButton string={activeFile.rawContent || activeFile.content} />
        <div
          className="text-[13px] font-mono font-[350] leading-[1.35rem] lineNumbers"
          dangerouslySetInnerHTML={{ __html: activeFile.content }}
        />
      </div>
    </Surface>
  );
};

const CopyButton = (props: { string: string }) => {
  const [success, setSuccess] = useState(false);

  const handleClick: MouseEventHandler<HTMLAnchorElement> = async (e) => {
    e.preventDefault();
    setSuccess(true);
    await navigator.clipboard.writeText(props.string);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (success) {
        setSuccess(false);
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [success]);

  return (
    <a
      href="#"
      className={classnames({
        "absolute top-3 right-3 text-xs text-secondary bg-white hover:bg-sand hover:text-primary px-2 py-1 rounded ":
          true,
      })}
      onClick={handleClick}
    >
      {success ? "Copied!" : "Copy"}
    </a>
  );
};
