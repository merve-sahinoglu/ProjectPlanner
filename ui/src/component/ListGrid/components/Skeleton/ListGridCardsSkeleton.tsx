import { Card, Grid, Skeleton, Divider, Group } from '@mantine/core';
import styles from '../ListGridCard.module.css';

interface ListGridCardSkeletonProps {
  animate?: boolean;
}

function ListGridCardSkeleton({ animate = true }: ListGridCardSkeletonProps) {
  return (
    <Card className={styles.listGridCard}>
      <Grid mx="auto" my="auto" grow className={styles.detailGrid}>
        <Skeleton radius={20} w="20%" h={45} animate={animate} />
        <Divider color="lightgray" size="sm" orientation="vertical" mb={10} ml={25} mt={10} />
        <Skeleton pl={0} h={30} ml={20} mr={20} radius={10} w="70%" animate={animate} />
      </Grid>
    </Card>
  );
}
function ListGridCardsSkeleton({ animate = true }: ListGridCardSkeletonProps) {
  return (
    <>
      <ListGridCardSkeleton animate={animate} />
      <ListGridCardSkeleton animate={animate} />
      <ListGridCardSkeleton animate={animate} />
      <ListGridCardSkeleton animate={animate} />
      <ListGridCardSkeleton animate={animate} />
      <ListGridCardSkeleton animate={animate} />
      <ListGridCardSkeleton animate={animate} />
    </>
  );
}

export default ListGridCardsSkeleton;
