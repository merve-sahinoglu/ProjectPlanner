import { Card, Grid, Group, ScrollArea, Skeleton, createStyles } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';

function CardGridDetailSkeleton() {
  const { height, width } = useViewportSize();

  const useStyles = createStyles(theme => ({
    card: {
      // backgroundColor:
      //   theme.colorScheme === 'dark'
      //     ? theme.colors.dark[6]
      //     : theme.colors.gray[0],
      height: height - 130,
    },
  }));

  const { classes, theme } = useStyles();

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <Card className={classes.card} shadow="md" radius="md" withBorder>
      <Card.Section withBorder inheritPadding mb={15}>
        <Grid>
          <Grid.Col xs={1}>
            <Skeleton height={23} mt={15} circle mb="xl" />
          </Grid.Col>
          <Grid.Col xs={11}>
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
