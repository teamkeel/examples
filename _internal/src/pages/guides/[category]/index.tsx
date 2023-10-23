import { GetStaticPaths, InferGetStaticPropsType } from "next";
import { PageWrapper } from "@/layouts/Wrapper";
import { flatGuideCategories, guideCategories } from "@/lib/staticData";
import { loadData } from "@/lib/data";
import { EntryListRow } from "@/components/EntryListRow";
import { Header } from "@/components/Header";

export const getStaticPaths = (async () => {
  //   const data = await loadData();

  //   const tags = data["guides"].reduce((uniqueTags: string[], guide) => {
  //     guide.tags.forEach((tag) => {
  //       if (!uniqueTags.includes(tag)) {
  //         uniqueTags.push(tag);
  //       }
  //     });
  //     return uniqueTags;
  //   }, []);

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
      <Header title={props.title} description={props.description} />

      <hr />

      <div className="flex flex-col gap-4 w-full mt-6">
        {props.entries.map((entry, i) => (
          <EntryListRow urlRoot={props.tag} entry={entry} key={i} />
        ))}
      </div>
    </PageWrapper>
  );
}
