import { GetStaticPaths, InferGetStaticPropsType } from "next";
import { Entry, loadData } from "../../../lib/data";
import { highlight } from "../../../lib/highlight";
import { TabbedContent } from "@/components/TabbedContent";
import Link from "next/link";
import { PageWrapper } from "@/layouts/Wrapper";
import { Tag } from "../../../components/Tag";
import { Markdown } from "@/components/Markdown";
import { ContentLayout } from "@/layouts/ContentLayout";

export const getStaticPaths = (async () => {
  const data = await loadData();

  return {
    paths: data["patterns"].map((d) => ({
      params: {
        slug: d.slug,
      },
    })),
    fallback: false, // false or "blocking"
  };
}) satisfies GetStaticPaths;

export async function getStaticProps(context: {
  params: {
    slug: string;
  };
}) {
  const data = await loadData();
  const entry = data["patterns"].find((p) => p.slug == context.params.slug);
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
        <Link href="/patterns" className="text-neutral-600 text-md">
          &#8249; All patterns
        </Link>
      </div>
      <ContentLayout.Root>
        <ContentLayout.Aside>
          <div className="flex gap-3 mb-4">
            {props?.tags?.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
          <Markdown>{props?.readme}</Markdown>
        </ContentLayout.Aside>
        <ContentLayout.Main>
          <TabbedContent
            files={props.files.map((file) => ({
              content: file.highlightedContent || file.contents,
              title: file.name,
              rawContent: file.contents,
            }))}
          />
        </ContentLayout.Main>
      </ContentLayout.Root>
    </PageWrapper>
  );
}
