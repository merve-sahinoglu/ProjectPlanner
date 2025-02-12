/* eslint-disable react/require-default-props */
import {
  Card,
  Group,
  Text,
  createStyles,
  ScrollArea,
  Skeleton,
} from '@mantine/core';
import {useViewportSize} from '@mantine/hooks';
import CardGridItemSkeleton from './CardGridItemSkeleton';

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[1],
  },

  headerCardSection: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },
}));

function CardGridSkeleton() {
  const {classes} = useStyles();
  const {height} = useViewportSize();

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return (
    <Card className={classes.card} shadow="sm" radius="md" withBorder>
      <Card.Section
        className={classes.headerCardSection}
        withBorder
        inheritPadding
        py="xs"
      >
        <Group position="apart">
          <Skeleton height={8} width="25%" mt={6} radius="xl" />
        </Group>
      </Card.Section>
      <Card.Section withBorder inheritPadding py="xs">
        <Skeleton height={30} mt={6} radius="xl" />
      </Card.Section>
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart">
          <Skeleton height={8} mt={6} width="25%" radius="xl" />
          <Skeleton height={8} mt={6} width="25%" radius="xl" />
        </Group>
      </Card.Section>

      <Card.Section color="dimmed" sx={{color: 'gray'}} inheritPadding py="xs">
        <ScrollArea
          h={height - 350}
          type="scroll"
          offsetScrollbars
          px={2}
          scrollbarSize={8}
        >
          <CardGridItemSkeleton />
          <CardGridItemSkeleton />
          <CardGridItemSkeleton />
          <CardGridItemSkeleton />
          <CardGridItemSkeleton />
          <CardGridItemSkeleton />
        </ScrollArea>
      </Card.Section>
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart">
          <Skeleton height={8} mt={6} width="40%" radius="xl" />
          <Skeleton height={30} mt={6} width="15%" circle />
        </Group>
      </Card.Section>
    </Card>
  );
}

export default CardGridSkeleton;
