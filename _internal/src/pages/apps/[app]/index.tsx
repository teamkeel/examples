import { GetStaticPaths, InferGetStaticPropsType } from "next";
import { loadData } from "../../../lib/data";
import { PageWrapper } from "@/layouts/Wrapper";
import { Tag } from "../../../components/Tag";
import { Markdown } from "@/components/Markdown";
import { ContentLayout } from "@/layouts/ContentLayout";
import { Header } from "@/components/Header";

export const getStaticPaths = (async () => {
  const data = await loadData();

  return {
    paths: data["apps"].map((d) => ({
      params: {
        app: d.slug,
      },
    })),
    fallback: false, // false or "blocking"
  };
}) satisfies GetStaticPaths;

export async function getStaticProps(context: {
  params: {
    app: string;
  };
}) {
  const data = await loadData();
  const entry = data["apps"].find((p) => p.slug == context.params.app);
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
      <ContentLayout.Root>
        <ContentLayout.Aside>
          <div className="flex gap-3 mb-4">
            {props?.tags?.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
          <Header title={props.title!} />
          <Markdown>{props?.readme}</Markdown>
        </ContentLayout.Aside>
        <ContentLayout.Main>
          <figure className="grid gap-2 text-sm text-center p-2 border border-sand bg-sand rounded">
            <img
              alt={props.title}
              className="rounded shadow"
              src={`/api/app-image?s=${encodeURIComponent(props.slug)}`}
            />
            <figcaption>
              A screenshot of the {props.title} sample application.
            </figcaption>
          </figure>
        </ContentLayout.Main>
      </ContentLayout.Root>
    </PageWrapper>
  );
}
