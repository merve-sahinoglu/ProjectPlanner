import {Card, Grid, Divider, Skeleton} from '@mantine/core';
import styles from '../ListGridCard.module.css';

function ListGridCardForPatientSkeleton() {
  return (
    <Card shadow="md" radius="md" className={styles.listGridCard}>
      <Grid grow className={styles.detailGrid}>
        <Skeleton radius={20} w="18%" h={45} my="auto" mr={10} ml={-20}/>
        <Skeleton w="18%" radius={20} h={45} my="auto" mr={30}/>
        <Divider color="lightgray" size="sm" orientation="vertical" mb={10} mt={10}/>
        <Skeleton pl={0} h={30} ml={20} radius={10} w="54%" />
      </Grid>
    </Card>
  );
}

function ListGridCardsForPatientSkeleton() {
  return (
    <>
      <ListGridCardForPatientSkeleton />
      <ListGridCardForPatientSkeleton />
      <ListGridCardForPatientSkeleton />
      <ListGridCardForPatientSkeleton />
      <ListGridCardForPatientSkeleton />
      <ListGridCardForPatientSkeleton />
    </>
  );
}

export default ListGridCardsForPatientSkeleton;
