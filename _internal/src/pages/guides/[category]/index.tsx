import { GetStaticPaths, InferGetStaticPropsType } from "next";
import { PageWrapper } from "@/layouts/Wrapper";
import { flatGuideCategories, guideCategories } from "@/lib/staticData";
import { loadData } from "@/lib/data";
import { EntryListRow } from "@/components/EntryListRow";
import { Header } from "@/components/Header";
import Head from "next/head";

export const getStaticPaths = (async () => {
  return {
    paths: flatGuideCategories.map((d) => ({
      params: {
        category: d.tag,
      },
    })),
    fallback: false, // false or "blocking"
  };
}) satisfies GetStaticPaths;

export async function getStaticProps(context: {
  params: {
    category: string;
  };
}) {
  const category = flatGuideCategories.find(
    (c) => c.tag == context.params.category
  );

  if (!category) {
    return {
      notFound: true,
    };
  }

  const data = await loadData();

  const guides = data.guides.filter((guide) =>
    guide.tags.includes(category.tag)
  );

  return {
    props: { ...category, entries: guides },
  };
}

export default function Page(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <PageWrapper>
      <Head>
        <title>{props.title} | Keel Examples</title>
      </Head>
      <Header title={props.title} description={props.description} />

      <hr />

      <div className="flex flex-col w-full gap-4 mt-6">
        {props.entries.map((entry, i) => (
          <EntryListRow urlRoot={props.tag} entry={entry} key={i} />
        ))}
      </div>
    </PageWrapper>
  );
}
