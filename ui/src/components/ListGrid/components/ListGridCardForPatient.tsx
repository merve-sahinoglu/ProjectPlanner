import { Card, Grid, Divider, Text } from '@mantine/core';
import React from 'react';
import { TEXT_COLOR } from 'src/constants/constants';
import styles from './ListGridCard.module.css';
import { Patient } from '../../../types/patient';

interface ListGridCardForPatientProps {
  entity: Patient;
  children: React.ReactNode | React.ReactNode[];
  isSelected: boolean;
}

function ListGridCardForPatient({ entity, children, isSelected }: ListGridCardForPatientProps) {
  return (
    <Card
      shadow="md"
      radius="md"
      className={isSelected ? styles.activeListGridCard : styles.listGridCard}
      key={entity.id}>
      <Grid mt={1} grow className={styles.detailGrid}>
        {children}
        <Divider
          h={60}
          mt={10}
          mx={15}
          className={styles.divider}
          size="sm"
          orientation="vertical"
        />
        <Grid.Col span={6}>
          <Text c={TEXT_COLOR}>
            <b>({entity.patientCode})</b> {entity.patientName} {entity.patientSurname}
          </Text>
        </Grid.Col>
      </Grid>
    </Card>
  );
}

export default ListGridCardForPatient;
