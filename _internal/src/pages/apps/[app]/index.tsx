import { GetStaticPaths, InferGetStaticPropsType } from "next";
import { loadData } from "../../../lib/data";
import { PageWrapper } from "@/layouts/Wrapper";
import { Tag } from "../../../components/Tag";
import { Markdown } from "@/components/Markdown";
import { ContentLayout } from "@/layouts/ContentLayout";
import { Header } from "@/components/Header";
import Head from "next/head";

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
      <Head>
        <title>{props.title} | Keel Examples</title>
      </Head>
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
          <figure className="grid gap-2 p-2 text-sm text-center border rounded border-sand bg-sand">
            <img
              alt={props.title}
              className="rounded shadow"
              src={`/api/app-image?s=${encodeURIComponent(props.slug)}`}
            />
            <figcaption>
              A screenshot of the {props.title} sample application.
            </figcaption>
          </figure>
          <div className="flex items-center w-full gap-2">
            {props.deploymentUrl && (
              <a
                target="_blank"
                href={props.deploymentUrl}
                className="flex items-center justify-center w-full px-4 py-2 font-bold text-white border rounded border-primary bg-primary"
              >
                View Demo
              </a>
            )}
            <a
              target="_blank"
              href={`https://github.com/teamkeel/examples/tree/main/apps/${props.slug}`}
              className="flex items-center justify-center w-full px-4 py-2 border rounded border-sand-dark bg-sand-dark"
            >
              View Code
            </a>
          </div>
        </ContentLayout.Main>
      </ContentLayout.Root>
    </PageWrapper>
  );
}
