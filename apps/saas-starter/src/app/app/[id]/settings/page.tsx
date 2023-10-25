import TeamSettings from '@/app/app/settings/page';

export default function SettingsPage({
  params,
}: {
  params: { settings_id: string };
}) {
  return (
    <TeamSettings
      params={{
        id: params?.settings_id,
      }}
    />
  );
}
