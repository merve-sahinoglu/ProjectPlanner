import { Card, Grid, Divider, Text, ActionIcon, rem } from '@mantine/core';
import React from 'react';
import { FaBarcode } from 'react-icons/fa';
import { PatientLocation } from 'src/types/patient-location';
import styles from './ListGridCard.module.css';

interface ListGridCardForPatientLocationProps {
  patientWithLocationInfo: PatientLocation;
  children: React.ReactNode | React.ReactNode[];
  handleClick(event: React.MouseEvent, patient: PatientLocation): void;
  optionalButton?: boolean;
}

function ListGridCardForPatientLocation({
  patientWithLocationInfo,
  children,
  optionalButton,
  handleClick,
}: ListGridCardForPatientLocationProps) {
  return (
    <Card
      onClick={e => handleClick(e, patientWithLocationInfo)}
      shadow="md"
      radius="md"
      className={styles.listGridCard}
      key={patientWithLocationInfo.patientId}>
      <Grid grow className={styles.detailGrid}>
        {children}
        <Divider
          my="auto"
          mr={10}
          ml={10}
          className={styles.divider}
          size="sm"
          orientation="vertical"
        />
        <Grid.Col span={6}>
          <Text c="#626F71">
            <b>({patientWithLocationInfo.patientCode})</b> {patientWithLocationInfo.patientName}{' '}
            {patientWithLocationInfo.patientSurname}
          </Text>
        </Grid.Col>
        {optionalButton ? (
          <ActionIcon bg="#e9ecef" radius="md" size={rem(45)} mr={15} variant="default">
            <FaBarcode color="#566368" size={rem(25)} />
          </ActionIcon>
        ) : null}
      </Grid>
    </Card>
  );
}

export default ListGridCardForPatientLocation;
