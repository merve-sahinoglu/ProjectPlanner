import { Card, Grid, Divider, Text, Group } from '@mantine/core';
import React from 'react';
import { User } from 'src/types/user';
import { PiIdentificationCardLight } from 'react-icons/pi';
import { TEXT_COLOR } from 'src/constants/constants';
import styles from './ListGridCard.module.css';

interface ListGridCardForUserProps {
  user: User;
  handleFingerprintModal(
    event: React.MouseEvent,
    cardId: string,
    userId: string,
    userName: string,
    userSurname: string
  ): void;
}

function ListGridCardForUser({ user, handleFingerprintModal }: ListGridCardForUserProps) {
  return (
    <Card className={styles.listGridCard} shadow="md" radius="md">
      <Grid mt={4} ml={15}>
        <Card.Section
          onClick={e =>
            handleFingerprintModal(e, user.id, user.cardNumber!, user.name, user.surname)
          }
          className={styles.listGridCardLeftDetailUser}
          withBorder
          py={10}
          m={10}
          inheritPadding>
          <Text c="#353c3d">
            <Group>
              <PiIdentificationCardLight color="#566368" size={30} />
              {user.cardNumber}
            </Group>
          </Text>
        </Card.Section>
        <Divider color="lightgray" size="sm" orientation="vertical" ml={20} mr={20} />
        <Grid.Col span={9}>
          <Text mt={15} c={TEXT_COLOR}>
            {user.name} {user.surname}
          </Text>
        </Grid.Col>
      </Grid>
    </Card>
  );
}

export default ListGridCardForUser;
