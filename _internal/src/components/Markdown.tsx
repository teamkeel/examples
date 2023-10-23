import MarkdownComponent from "react-markdown";

export const Markdown = (props: { children?: string }) => {
  return (
    <div className="prose text-body leading-6 prose-h1:font-display prose-h1:font-semibold prose-h1:text-primary prose-code:font-[350] prose-code:before:content-none prose-code:after:content-none prose-code:bg-sand prose-pre:bg-sand-50 prose-code:prose-pre:bg-transparent prose-pre:border prose-pre:border-sand prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-orange-950 prose-code:text-opacity-90">
      <MarkdownComponent>{props.children}</MarkdownComponent>
    </div>
  );
};
