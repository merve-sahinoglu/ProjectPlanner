import { Card, Grid, Divider, ActionIcon, Text } from '@mantine/core';
import { MdOutlineClear } from 'react-icons/md';
import React from 'react';
import { TEXT_COLOR } from 'src/constants/constants';
import { ReturnBoxProcessItem } from 'src/types/return-box-process-item';
import styles from './ListGridCard.module.css';

interface ListGridCardForReturnBoxItemProps {
  entity: ReturnBoxProcessItem;
  handleCardReturnBoxItemClick?(entity: ReturnBoxProcessItem): void;
  optionalButtonIcon?: React.ReactNode;
  children: React.ReactNode | React.ReactNode[];
  isCounted?: boolean | null;
  isHidden?: boolean;
}

function ListGridCardForReturnBoxItem({
  entity,
  handleCardReturnBoxItemClick,
  children,
  isCounted = false,
  isHidden = false,
  optionalButtonIcon = <MdOutlineClear size="1.5rem" color="gray" />,
}: ListGridCardForReturnBoxItemProps) {
  const handleOnClickItem = (event: React.MouseEvent) => {
    event.preventDefault();
    if (handleCardReturnBoxItemClick) {
      handleCardReturnBoxItemClick(entity);
    }
  };

  return (
    <Card
      className={isCounted ? styles.listGridCardForCount : styles.listGridCard}
      shadow="md"
      radius="md">
      <Grid grow className={styles.detailGrid}>
        <Card.Section className={styles.listGridCardLeftDetail} withBorder inheritPadding>
          {children}
        </Card.Section>
        <Divider my="auto" className={styles.divider} ml={10} orientation="vertical" size="sm" />
        <Grid.Col span={6} p={0} m={0} ml={15}>
          <Text c={TEXT_COLOR}>
            <b>({entity.itemCode})</b> {entity.itemName}
          </Text>
        </Grid.Col>
        <Grid.Col span={2} p={0} m={0} ml={15}>
          <Text c={TEXT_COLOR}>
            Quantity: <b>{entity.currentQuantity}</b>
          </Text>
        </Grid.Col>
        <ActionIcon
          onClick={e => handleOnClickItem(e)}
          pos="absolute"
          right={28}
          top={20}
          color="red"
          radius={20}
          size="lg">
          {optionalButtonIcon}
        </ActionIcon>
      </Grid>
    </Card>
  );
}

export default ListGridCardForReturnBoxItem;
