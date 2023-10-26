import { BackButton } from '@/components/BackButton';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 p-4">
      <h1 className="text-4xl font-bold">There is no Privacy Policy.</h1>
      <p>This is a demo app. What did you expect?</p>
      <BackButton />
    </div>
  );
}
