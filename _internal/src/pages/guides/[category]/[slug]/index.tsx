import { GetStaticPaths, InferGetStaticPropsType } from "next";
import { Entry, loadData } from "../../../../lib/data";
import { TabbedContent } from "@/components/TabbedContent";
import Link from "next/link";
import { PageWrapper } from "@/layouts/Wrapper";
import { Tag } from "../../../../components/Tag";
import { Markdown } from "@/components/Markdown";

export const getStaticPaths = (async () => {
  const data = await loadData();

  // Create a path for each tag this entry has
  const paths: { params: { slug: string; category: string } }[] = data[
    "guides"
  ].flatMap((d) =>
    d.tags.map((t) => ({
      params: {
        slug: d.slug,
        category: t,
      },
    }))
  );

  return {
    paths,
    fallback: false,
  };
}) satisfies GetStaticPaths;

export async function getStaticProps(context: {
  params: {
    slug: string;
  };
}) {
  const data = await loadData();
  const entry = data["guides"].find((p) => p.slug == context.params.slug);
  if (!entry) {
    return;
  }

  return {
    props: entry,
  };
}

export default function Page(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <PageWrapper>
      <div className="flex w-full max-w-6xl mb-7">
        <Link href="/guides" className="text-neutral-600 text-md">
          &#8249; All guides
        </Link>
      </div>
      <div className="flex w-full max-w-6xl gap-12">
        <aside className="w-2/5">
          <div className="flex gap-3 mb-4">
            {props?.tags?.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>

          <Markdown>{props?.readme}</Markdown>
        </aside>
        <main className="w-3/5">
          <TabbedContent
            files={props.files
              // .filter((f) => f.name != "readme.md")
              .map((file) => ({
                content: file.highlightedContent || file.contents,
                title: file.name,
                rawContent: file.contents,
              }))}
          />
        </main>
      </div>
    </PageWrapper>
  );
}
