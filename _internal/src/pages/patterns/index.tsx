import { InferGetStaticPropsType } from "next";
import { loadData } from "../../lib/data";
import { PageWrapper } from "@/layouts/Wrapper";
import { Header } from "@/components/Header";
import { EntryListRow } from "@/components/EntryListRow";

export async function getStaticProps() {
  const data = await loadData();

  return {
    props: { entries: data.patterns },
  };
}

export default function Page(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <PageWrapper>
      <Header
        title={"Patterns"}
        description="Schema examples for common usage patterns"
      />

      <hr />

      <div className="flex flex-col gap-4 w-full mt-6">
        {props.entries.map((entry, i) => (
          <EntryListRow urlRoot={"patterns/"} entry={entry} key={i} />
        ))}
      </div>
    </PageWrapper>
  );
}
