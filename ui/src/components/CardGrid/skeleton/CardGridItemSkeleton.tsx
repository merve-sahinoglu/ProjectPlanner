/* eslint-disable react/require-default-props */
import {Card, Grid, Skeleton} from '@mantine/core';
import styles from '../Card.module.css';

function CardGridItemSkeleton() {
  return (
    <Card className={styles.card} padding="lg" radius="md" withBorder>
      <Grid align="center">
        <Grid.Col xs={1}>
          <Skeleton height={15} mt={10} circle radius="xl" />
        </Grid.Col>
        <Grid.Col xs={11}>
          <Skeleton height={8} mt={10} width="89%" radius="xl" />
          <Skeleton height={8} mt={6} width="89%" radius="xl" />
          <Skeleton height={8} mt={6} width="89%" radius="xl" />
        </Grid.Col>
      </Grid>
    </Card>
  );
}

export default CardGridItemSkeleton;
