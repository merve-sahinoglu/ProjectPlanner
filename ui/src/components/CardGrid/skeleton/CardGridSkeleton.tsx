import { Card, Group, ScrollArea, Skeleton } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';

import classes from '../CardGrid.module.css';
import CardGridItemSkeleton from './CardGridItemSkeleton';

function CardGridSkeleton() {
  const { height } = useViewportSize();

  return (
    <Card className={classes.card} shadow="sm" radius="md" withBorder>
      <Card.Section className={classes.headerCardSection} withBorder inheritPadding py="xs">
        <Group justify="apart">
          <Skeleton height={8} width="25%" mt={6} radius="xl" />
        </Group>
      </Card.Section>
      <Card.Section withBorder inheritPadding py="xs">
        <Skeleton height={30} mt={6} radius="xl" />
      </Card.Section>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="apart">
          <Skeleton height={8} mt={6} width="25%" radius="xl" />
          <Skeleton height={8} mt={6} width="25%" radius="xl" />
        </Group>
      </Card.Section>

      <Card.Section c="dimmed" style={{ color: 'gray' }} inheritPadding py="xs">
        <ScrollArea h={height - 350} type="scroll" offsetScrollbars px={2} scrollbarSize={8}>
          <CardGridItemSkeleton />
          <CardGridItemSkeleton />
          <CardGridItemSkeleton />
          <CardGridItemSkeleton />
          <CardGridItemSkeleton />
          <CardGridItemSkeleton />
        </ScrollArea>
      </Card.Section>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="apart">
          <Skeleton height={8} mt={6} width="40%" radius="xl" />
          <Skeleton height={30} mt={6} width="15%" circle />
        </Group>
      </Card.Section>
    </Card>
  );
}

export default CardGridSkeleton;