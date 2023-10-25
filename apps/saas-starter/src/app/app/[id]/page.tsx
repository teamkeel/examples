interface UserPageProps {
  params: {
    id: string;
  };
}

export default function UserPage({ params: { id } }: UserPageProps) {
  return <div>{id}</div>;
}
