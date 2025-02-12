import { Center, Grid, Group, Text } from '@mantine/core';
import { TbDatabaseX } from 'react-icons/tb';
import styles from './NoData.module.css';

interface NoDataProps {
  label: string;
  isOrder?: boolean;
  isMaintenance?: boolean;
  isCount?: boolean;
  isStockCard?: boolean;
}

function NoData({
  label,
  isOrder = false,
  isMaintenance = false,
  isCount = false,
  isStockCard = false,
}: NoDataProps) {
  return (
    <Center
      className={
        // eslint-disable-next-line no-nested-ternary
        isOrder
          ? styles.centerBaseOrder
          : // eslint-disable-next-line no-nested-ternary
            isMaintenance
            ? styles.centerBaseMaintenance
            : // eslint-disable-next-line no-nested-ternary
              isCount
              ? styles.centerBaseCount
              : isStockCard
                ? styles.centerBaseStockCard
                : styles.centerBase
      }>
      <Grid>
        <Grid.Col mx="auto">
          <Group grow>
            <TbDatabaseX className={styles.icon} opacity="15%" size={70} />
          </Group>
          <Group grow>
            <Text className={styles.text} mt={10} size={20} opacity="20%">
              {label}
            </Text>
          </Group>
        </Grid.Col>
      </Grid>
    </Center>
  );
}

export default NoData;
