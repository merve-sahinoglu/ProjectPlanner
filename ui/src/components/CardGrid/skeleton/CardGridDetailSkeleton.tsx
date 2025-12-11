import { Card, Grid, Group, Skeleton } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';

function CardGridDetailSkeleton() {
  const { height } = useViewportSize();

  return (
    <Card style={{ height: height - 130 }} shadow="md" radius="md" withBorder>
      <Card.Section withBorder inheritPadding mb={15}>
        <Grid>
          <Grid.Col span={1}>
            <Skeleton height={23} mt={15} circle mb="xl" />
          </Grid.Col>
          <Grid.Col span={11}>
            <Group ml={-50} mt={10}>
              <Skeleton height={8} width="15%" radius="xl" />
              <Skeleton height={8} radius="xl" />
            </Group>
          </Grid.Col>
        </Grid>
      </Card.Section>
      <Skeleton height={150} mb={15} radius="md" />
      <Skeleton height={150} mb={15} radius="md" />
      <Skeleton height={150} mb={15} radius="md" />
      <Skeleton height={150} mb={15} radius="md" />
    </Card>
  );
}

export default CardGridDetailSkeleton;