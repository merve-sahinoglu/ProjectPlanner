import { ActionIcon, Group, Indicator, Text } from "@mantine/core";
import { useInterval } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsArrowClockwise } from "react-icons/bs";
import Dictionary from "../../constants/dictionary";
import classes from "./Card.module.css";
interface CardGridFooterProps {
  totalItemCount: number;
  currentItemCount: number;
  refreshData?(): void;
  disableRefresh?: boolean;
}

function CardGridFooter({
  totalItemCount,
  currentItemCount,
  refreshData,
  disableRefresh = false,
}: CardGridFooterProps) {
  const [seconds, setSeconds] = useState(0);
  const interval = useInterval(() => setSeconds((s) => s + 1), 1000);

  const { t } = useTranslation();

  const handleRefreshClick = (event: React.MouseEvent) => {
    event.preventDefault();

    if (refreshData) refreshData();

    setSeconds(0);
  };

  useEffect(() => {
    if (!disableRefresh) {
      interval.start();
    }
  }, []);

  return (
    <Group justify="space-between">
      <Text size="sm" c="dimmed">
        {`${t(Dictionary.DataGrid.PAGINATION, {
          pageSize: currentItemCount,
          totalPageSize: totalItemCount,
        })}`}
      </Text>
      {!disableRefresh ? (
        <Indicator color={seconds <= 60 ? "green" : "red"} size={12} processing>
          <ActionIcon
            onClick={(e) => handleRefreshClick(e)}
            size="md"
            className={classes.add}
            radius="xl"
            variant="filled"
          >
            <BsArrowClockwise />
          </ActionIcon>
        </Indicator>
      ) : null}
    </Group>
  );
}

export default CardGridFooter;
