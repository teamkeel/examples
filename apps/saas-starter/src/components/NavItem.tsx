import Link from 'next/link';

export const NavItem = (props: {
  title: string;
  href?: string;
  icon?: React.ReactNode;
}) => {
  const content = (
    <div className="flex items-center gap-2 p-1 px-2 -mx-2 text-sm font-medium rounded hover:bg-slate-5 text-secondary-foreground">
      {props.icon && (
        <span className="w-[15px] flex justify-center">{props.icon}</span>
      )}
      {props.title}
    </div>
  );

  if (props.href) {
    return (
      <Link className="no-underline" href={props.href}>
        {content}
      </Link>
    );
  }

  return content;
};
