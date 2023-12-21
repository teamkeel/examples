import { InferGetStaticPropsType } from "next";
import { EntryListRow } from "@/components/EntryListRow";
import { PageWrapper } from "@/layouts/Wrapper";
import { loadData } from "@/lib/data";
import { Header } from "@/components/Header";
import Head from "next/head";

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
      <Head>
        <title>Guides | Keel Examples</title>
      </Head>
      <Header
        title={"All guides"}
        description="Guides to help you get started with Keel"
      />

      <hr />

      <div className="flex flex-col w-full gap-4 mt-6">
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
