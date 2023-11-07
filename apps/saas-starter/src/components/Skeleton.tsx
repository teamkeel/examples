import clsx from 'clsx';

type Props = {
  className?: string;
};

export function Skeleton(props: Props) {
  return (
    <div
      className={clsx(
        'rounded relative w-full h-8 overflow-hidden bg-[#fff2] skeleton',
        props.className
      )}
    >
      <div className="absolute w-full h-full swoosh bg-gradient-to-r from-transparent via-[#fff6] to-transparent"></div>
    </div>
  );
}
