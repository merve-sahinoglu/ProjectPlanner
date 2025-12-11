import React, { useEffect, useState } from "react";

import { ActionIcon, Flex, Indicator, Text } from "@mantine/core";
import { useInterval } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { BsArrowClockwise } from "react-icons/bs";

import Dictionary from "@helpers/translation/dictionary/dictionary";

interface CardGridFooterProps {
  totalItemCount: number;
  currentItemCount: number;
  refreshData?(): Promise<unknown>;
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

  const handleRefreshClick = async (event: React.MouseEvent) => {
    event.preventDefault();

    if (refreshData) await refreshData();

    setSeconds(0);
  };

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, []);

  return (
    <Flex justify="space-between" pt={10} align="center">
      <Text size="sm" c="dimmed" pt={disableRefresh ? 6 : undefined}>
        {`${t(Dictionary.DataGrid.PAGINATION, {
          pageSize: currentItemCount,
          totalPageSize: totalItemCount,
        })}`}
      </Text>
      {!disableRefresh && (
        <Indicator color={seconds <= 60 ? "green" : "red"} size={12} processing>
          <ActionIcon
            onClick={(e) => handleRefreshClick(e)}
            color="blue"
            size="md"
            radius="xl"
            variant="filled"
          >
            <BsArrowClockwise />
          </ActionIcon>
        </Indicator>
      )}
    </Flex>
  );
}

export default CardGridFooter;
