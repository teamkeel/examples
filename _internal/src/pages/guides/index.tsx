import { InferGetStaticPropsType } from "next";
import { EntryListRow } from "@/components/EntryListRow";
import { PageWrapper } from "@/layouts/Wrapper";
import { loadData } from "@/lib/data";
import { Header } from "@/components/Header";

export async function getStaticProps() {
  const data = await loadData();

  return {
    props: { entries: data.guides },
  };
}

export default function Page(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <PageWrapper>
      <Header
        title={"All guides"}
        description="Guides to help you get started with Keel"
      />

      <hr />

      <div className="flex flex-col gap-4 w-full mt-6">
        {props.entries.map((entry, i) => (
          <EntryListRow
            urlRoot={"guides/" + entry.tags[0]}
            entry={entry}
            key={i}
          />
        ))}
      </div>
    </PageWrapper>
  );
}
