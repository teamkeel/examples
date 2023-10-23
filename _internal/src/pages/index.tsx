import { PageWrapper } from "@/layouts/Wrapper";
import { InferGetStaticPropsType } from "next";
import { loadData } from "@/lib/data";
import Link from "next/link";
import { guideCategories } from "@/lib/staticData";
import { EntryListRow } from "@/components/EntryListRow";

export async function getStaticProps() {
  const data = await loadData();

  return {
    props: {
      guides: guideCategories,
      patterns: data["patterns"],
    },
  };
}

const CategoryBlock = (props: {
  title: string;
  description: string;
  tag: string;
}) => {
  return (
    <Link
      href={"guides/" + props.tag}
      className="flex flex-1 gap-4 items-center group box-border hover:bg-sand-50 p-2 -m-2 rounded-2xl"
    >
      <div className="w-[50px] h-[50px] bg-sand group-hover:bg-sand-dark rounded-lg shrink-0"></div>
      <div>
        <p className="text-md font-medium text-primary leading-5">
          {props.title}
        </p>
        <p className="text-sm text-secondary leading-5">{props.description}</p>
      </div>
    </Link>
  );
};

export default function Home(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <PageWrapper>
      <section className="mt-7 w-full">
        <h1 className="text-5xl font-display font-medium text-primary mb-1">
          Let&apos;s get building
        </h1>
        <p className="text-lg text-secondary">
          Example apps, guides and schema patterns to get you started with Keel
        </p>
      </section>

      <section className="mt-16 w-full">
        <h1 className="text-3xl font-display font-medium mb-0 text-primary">
          Example apps
        </h1>
        <p className="text-md text-secondary">
          Fully fledged apps to give you a sense of Keel in action
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full mt-5">
          {["Twitter clone", "SaaS starter", "Todo app"].map((s) => (
            <Link
              href="#"
              key={s}
              className="min-h-[150px] flex items-end bg-sand hover:bg-sand-dark rounded-lg p-5 flex-1"
            >
              <p className="text-lg font-semibold text-primary leading-none">
                {s}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 w-full">
        <h1 className="text-3xl font-display font-medium mb-0 text-primary">
          Guides
        </h1>
        <p className="text-md text-secondary">
          Practical examples for using Keel
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-5 ">
          {props.guides.general.map((entry, i) => (
            <CategoryBlock
              key={i}
              title={entry.title}
              description={entry.description}
              tag={entry.tag}
            />
          ))}
        </div>

        <h4 className="text-md font-medium text-secondary mt-8">Features</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4">
          {props.guides.features.map((entry, i) => (
            <CategoryBlock
              key={i}
              title={entry.title}
              description={entry.description}
              tag={entry.tag}
            />
          ))}
        </div>
      </section>

      <section className="mt-16 w-full">
        <h1 className="text-3xl font-display font-medium mb-0 text-primary">
          Patterns
        </h1>
        <p className="text-md text-secondary">
          Schema examples for common usage patterns
        </p>

        <div className="flex flex-col gap-4 w-full mt-6">
          {props.patterns.slice(0, 10).map((entry, i) => (
            <EntryListRow urlRoot="patterns" entry={entry} key={i} />
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
