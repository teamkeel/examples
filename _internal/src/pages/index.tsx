import { PageWrapper } from "@/layouts/Wrapper";
import { InferGetStaticPropsType } from "next";
import { loadData } from "@/lib/data";
import Link from "next/link";
import { Category, guideCategories } from "@/lib/staticData";
import { EntryListRow } from "@/components/EntryListRow";
import { MaterialSymbol } from "react-material-symbols";

export async function getStaticProps() {
  const data = await loadData();

  return {
    props: {
      apps: data.apps,
      guides: guideCategories,
      patterns: data["patterns"],
    },
  };
}

const CategoryBlock = (props: Category) => {
  return (
    <Link
      href={"guides/" + props.tag}
      className="box-border flex items-center flex-1 gap-4 p-2 -m-2 group hover:bg-sand-50 rounded-2xl"
    >
      <div className="w-[50px] flex items-center justify-center text-2xl text-secondary h-[50px] bg-sand group-hover:bg-sand-dark rounded-lg shrink-0">
        <MaterialSymbol icon={props.icon} />
      </div>
      <div>
        <p className="font-medium leading-5 text-md text-primary">
          {props.title}
        </p>
        <p className="text-sm leading-5 text-secondary">{props.description}</p>
      </div>
    </Link>
  );
};

export default function Home(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const hasApps = props.apps.length > 0;
  return (
    <PageWrapper>
      <section className="w-full mt-7">
        <h1 className="mb-1 text-5xl font-medium font-display text-primary">
          Let&apos;s get building
        </h1>
        <p className="text-lg text-secondary">
          Example apps, guides and schema patterns to get you started with Keel
        </p>
      </section>

      <section className="w-full mt-16">
        <h1 className="mb-0 text-3xl font-medium font-display text-primary">
          Example apps
        </h1>
        <p className="text-md text-secondary">
          Fully fledged apps to give you a sense of Keel in action
        </p>

        <div className="grid w-full grid-cols-1 gap-6 mt-5 sm:grid-cols-2 md:grid-cols-3">
          {hasApps ? (
            props.apps.map((s) => (
              <Link
                href={`/apps/${s.slug}`}
                key={s.slug}
                className="min-h-[150px] grid gap-4 bg-sand hover:bg-sand-dark rounded-lg p-5 flex-1"
              >
                <img
                  alt={s.title}
                  src={`/api/app-image?s=${s.slug}`}
                  className="w-full rounded shadow"
                />
                <p className="text-lg font-semibold leading-none text-primary">
                  {s.title}
                </p>
              </Link>
            ))
          ) : (
            <div className="min-h-[150px] items-center justify-center text-lg font-semibold text-primary leading-none grid gap-4 bg-sand hover:bg-sand-dark rounded-lg p-5 flex-1">
              No apps yet
            </div>
          )}
        </div>
      </section>

      <section className="w-full mt-16">
        <h1 className="mb-0 text-3xl font-medium font-display text-primary">
          Guides
        </h1>
        <p className="text-md text-secondary">
          Practical examples for using Keel
        </p>

        <div className="grid w-full grid-cols-1 gap-6 mt-5 md:grid-cols-2 lg:grid-cols-3 ">
          {props.guides.general.map((entry, i) => (
            <CategoryBlock
              key={i}
              title={entry.title}
              description={entry.description}
              tag={entry.tag}
              icon={entry.icon}
            />
          ))}
        </div>

        <h4 className="mt-8 font-medium text-md text-secondary">Features</h4>

        <div className="grid w-full grid-cols-1 gap-6 mt-4 md:grid-cols-2 lg:grid-cols-3">
          {props.guides.features.map((entry, i) => (
            <CategoryBlock
              key={i}
              title={entry.title}
              description={entry.description}
              tag={entry.tag}
              icon={entry.icon}
            />
          ))}
        </div>
      </section>

      <section className="w-full mt-16">
        <h1 className="mb-0 text-3xl font-medium font-display text-primary">
          Patterns
        </h1>
        <p className="text-md text-secondary">
          Schema examples for common usage patterns
        </p>

        <div className="flex flex-col w-full gap-4 mt-6">
          {props.patterns.slice(0, 10).map((entry, i) => (
            <EntryListRow urlRoot="patterns" entry={entry} key={i} />
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
