export const Header = (props: { title: string; description?: string }) => {
  return (
    <section className="mt-7 w-full">
      <h1 className="text-5xl font-display font-medium text-primary mb-1">
        {props.title}
      </h1>
      {props.description && (
        <p className="text-lg text-secondary">{props.description}</p>
      )}
    </section>
  );
};
