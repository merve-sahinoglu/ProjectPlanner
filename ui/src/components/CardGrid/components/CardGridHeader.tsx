import React, { RefObject, useCallback } from "react";

import {
  Card,
  Group,
  Loader,
  Menu,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { BsChevronDown, BsSearch } from "react-icons/bs";

import classes from "@components/CardGrid/CardGrid.module.css";
import Dictionary from "@helpers/translation/dictionary/dictionary";

interface CardGridHeaderProps {
  headerTitle: string;
  headerRightComponent?: React.ReactNode;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  additionalSearchComponents?: React.ReactNode;
  onFilterToggle?(): void;
  filterStatus?: boolean;
  showFilterMenu?: boolean;
  isFetching?: boolean;
  scrollAreaRef: RefObject<HTMLDivElement | null>;
}

function CardGridHeader({
  headerTitle,
  headerRightComponent,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  additionalSearchComponents,
  onFilterToggle,
  filterStatus,
  showFilterMenu,
  isFetching,
  scrollAreaRef,
}: CardGridHeaderProps) {
  const { t } = useTranslation();

  const handleFilterClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (!onFilterToggle) return;

      onFilterToggle();
    },
    [onFilterToggle]
  );

  return (
    <>
      <Card.Section
        className={classes.headerCardSection}
        withBorder
        inheritPadding
        py="xs"
      >
        <Group justify="space-between">
          <Text fw={500} fz={17}>
            {headerTitle}
          </Text>
          {headerRightComponent}
        </Group>
      </Card.Section>
      <Card.Section withBorder inheritPadding py="xs">
        {isFetching}
        <TextInput
          value={searchQuery}
          onChange={(event) => {
            if (scrollAreaRef.current) scrollAreaRef.current.scrollTop = 0;

            onSearchChange(event.currentTarget.value);
          }}
          placeholder={`${t(searchPlaceholder)}`}
          rightSection={isFetching && <Loader color={"gray"} size="xs" />}
          radius="lg"
          leftSection={<BsSearch size="13px" />}
        />
        {additionalSearchComponents}
      </Card.Section>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {t(Dictionary.CardGrid.RESULTS)}
          </Text>
          {showFilterMenu && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Group>
                    <Text size="sm" c="dimmed" pr={-5} mr={-10}>
                      {t(Dictionary.CardGrid.FILTER)}
                    </Text>
                    <BsChevronDown />
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item onClick={(e) => handleFilterClick(e)}>
                  {filterStatus
                    ? `${t(Dictionary.CardGrid.SHOW_ALL)}`
                    : `${t(Dictionary.CardGrid.SHOW_ACTIVES)}`}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Card.Section>
    </>
  );
}

export default CardGridHeader;
