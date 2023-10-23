import Link from "next/link";
import { Tag } from "./Tag";
import { Entry } from "@/lib/data";

export const EntryListRow = (props: { entry: Entry; urlRoot: string }) => {
  let { urlRoot = "" } = props;
  if (urlRoot.endsWith("/")) {
    urlRoot = urlRoot.slice(0, -1);
  }

  return (
    <Link
      href={`${urlRoot}/${props.entry.slug}`}
      className="flex flex-1 flex-col box-border items-start hover:bg-sand-50 p-2 -m-2 rounded-md md:flex-row md:items-center gap-1"
    >
      <p className="text-md font-medium text-primary leading-5 flex-1">
        {props.entry.title}
      </p>
      <div className="flex gap-2">
        {props.entry.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
    </Link>
  );
};
