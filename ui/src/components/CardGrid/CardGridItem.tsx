import React from "react";

import { Card, Flex } from "@mantine/core";

import { LEFT_SECTION_FLEX_GAP } from "@constants/constants";
import styles from "./Card.module.css";

interface MinimumCardGridItemProps {
  id: string;
  isActive?: boolean;
}

interface CardGridItemProps<T extends MinimumCardGridItemProps> {
  entity: T;
  selectedEntity?: T | undefined | null;
  onCardClick?(event: React.MouseEvent, entity: T): void;
  text: React.ReactNode;
  subText?: React.ReactNode;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  h?: number;
}

function CardGridItem<T extends MinimumCardGridItemProps>({
  entity,
  selectedEntity,
  onCardClick,
  leftSection,
  text,
  subText,
  rightSection,
  h,
}: CardGridItemProps<T>) {
  return (
    <Card
      className={
        selectedEntity?.id === entity.id ? styles.cardActive : styles.card
      }
      onClick={(e) => onCardClick && onCardClick(e, entity)}
      key={entity.id}
      h={h}
      padding="lg"
      radius="md"
      withBorder
    >
      <Flex justify="space-between" align="center" h="100%">
        <Flex direction="column">
          <Flex direction={"row"} align={"center"} gap={LEFT_SECTION_FLEX_GAP}>
            {leftSection}
            {text}
          </Flex>
          <div>{subText}</div>
        </Flex>
        {rightSection}
      </Flex>
    </Card>
  );
}

export default CardGridItem;
