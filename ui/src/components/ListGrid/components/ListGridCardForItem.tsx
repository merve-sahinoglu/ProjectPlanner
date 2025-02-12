/* eslint-disable no-nested-ternary */
import { Card, Grid, Divider, ActionIcon, Text } from '@mantine/core';
import { MdOutlineClear } from 'react-icons/md';
import React from 'react';
import { TEXT_COLOR } from 'src/constants/constants';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Dictionary from 'src/constants/dictionary';
import styles from './ListGridCard.module.css';
import { ProcessItem } from '../../../types/process-item';

interface ListGridCardForItemProps<T extends ProcessItem & Record<string, any>> {
  entity: T;
  handleCardItemClick?(entity: T): void;
  optionalButtonIcon?: React.ReactNode;
  children: React.ReactNode | React.ReactNode[];
  isCounted?: boolean | null;
  isHidden?: boolean;
  rightSidePropertyInfo?: keyof T;
  rightSidePropertyInfoLabel?: string;
}

function ListGridCardForItem<T extends ProcessItem>({
  entity,
  handleCardItemClick,
  children,
  isCounted = false,
  isHidden = true,
  optionalButtonIcon = <MdOutlineClear size="1.5rem" color="gray" />,
  rightSidePropertyInfo,
  rightSidePropertyInfoLabel,
}: ListGridCardForItemProps<T>) {
  const { t } = useTranslation();

  const handleOnClickItem = (event: React.MouseEvent) => {
    event.preventDefault();
    if (handleCardItemClick) {
      // if (entity.isError) {
      //   toast.error(t(Dictionary.Notify.FAULTED_COMPONENT));
      //   return;
      // }
      handleCardItemClick(entity);
    }
  };

  const getPropertyValue = (e: T, attribute: keyof T) => e[attribute] as string;

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
        <Grid.Col xs={6.5} p={0} m={0} ml={15}>
          <Text c={TEXT_COLOR}>
            <b>({entity.itemCode})</b> {entity.itemName}
          </Text>
        </Grid.Col>
        {rightSidePropertyInfo ? (
          rightSidePropertyInfo in entity ? (
            <Grid.Col xs={1} p={0} m={0}>
              <Text c={TEXT_COLOR}>
                {rightSidePropertyInfoLabel} : {getPropertyValue(entity, rightSidePropertyInfo)}
              </Text>
            </Grid.Col>
          ) : null
        ) : null}
        {!isHidden && (
          <ActionIcon
            onClick={e => handleOnClickItem(e)}
            pos="absolute"
            right={28}
            top={20}
            radius={20}
            className={styles.actionButton}
            size="lg">
            {optionalButtonIcon}
          </ActionIcon>
        )}
      </Grid>
    </Card>
  );
}

export default ListGridCardForItem;
