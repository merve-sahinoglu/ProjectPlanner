import { ActionIcon, Card, Grid } from "@mantine/core";
import { BsPencil } from "react-icons/bs";
import CircleDot from "../CircleDot/CircleDot";
import styles from "./Card.module.css";

interface MinimumCardGridItemProps {
  id: string;
  isActive?: boolean;
}

interface CardGridItemProps<T extends MinimumCardGridItemProps> {
  entity: T;
  selectedEntity?: T | undefined | null;
  handleCardItemClick?(event: React.MouseEvent, entity: T): void;
  children: React.ReactNode | React.ReactNode[];
  showEditButton?: boolean;
  buttonIcon?: React.ReactNode;
  openEditModal?({ ...props }: T): void;
  handleOptionalButton?(event: React.MouseEvent, { ...props }): void;
}

function CardGridItem<T extends MinimumCardGridItemProps>({
  entity,
  selectedEntity,
  handleCardItemClick,
  children,
  showEditButton = false,
  openEditModal,
  handleOptionalButton,
  buttonIcon = <BsPencil size="0.8rem" />,
}: CardGridItemProps<T>) {
  return (
    <Card
      className={
        selectedEntity?.id === entity.id ? styles.cardActive : styles.card
      }
      onClick={(e) => handleCardItemClick && handleCardItemClick(e, entity)}
      key={entity.id}
      padding="lg"
      radius="md"
      withBorder
    >
      <Grid align="center">
        <Grid.Col xs={10}>
          {entity.isActive && <CircleDot isActive={entity.isActive} />}
          {children}
        </Grid.Col>
        <Grid.Col xs={2}>
          {showEditButton ? (
            <ActionIcon
              onClick={(e) =>
                openEditModal
                  ? openEditModal(entity)
                  : handleOptionalButton && handleOptionalButton(e, entity)
              }
              className={styles.cardEditButton}
              radius="xl"
              variant="outline"
            >
              {buttonIcon}
            </ActionIcon>
          ) : null}
        </Grid.Col>
      </Grid>
    </Card>
  );
}

export default CardGridItem;
