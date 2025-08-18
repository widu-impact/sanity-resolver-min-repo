import { Card, Stack, Text } from '@sanity/ui';
import { usePresentationNavigate, usePresentationParams } from 'sanity/presentation';

type CustomNavigatorProps = {
  sites: {
    code: string;
    storefrontUrl: string;
  }[];
};

export function PresentationToolNavigator({ sites }: CustomNavigatorProps) {
  const navigate = usePresentationNavigate();
  const { preview } = usePresentationParams();

  const activeSite = sites
    .filter((site) => preview?.startsWith(site.storefrontUrl))
    .sort((a, b) => b.storefrontUrl.length - a.storefrontUrl.length)[0];

  return (
    <Card flex={1} height="fill">
      <Stack padding={2} space={1}>
        {sites.map((site) => (
          <Card
            key={site.code}
            as="button"
            onClick={() => navigate(`${site.storefrontUrl}`)}
            padding={3}
            pressed={site.code === activeSite?.code}
            radius={2}
          >
            <Stack space={2}>
              <Text>{site.code.toUpperCase()}</Text>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Card>
  );
}
