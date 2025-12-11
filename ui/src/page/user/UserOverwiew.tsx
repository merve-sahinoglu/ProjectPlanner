import React, { useState } from "react";

// eslint-disable-next-line import/no-unresolved
import useCardGrid from "@components/CardGrid/hooks/useCardGrid";
import { ActionIcon, Grid, Highlight, Text } from "@mantine/core";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BsXLg } from "react-icons/bs";

import AddNewItemButton from "@components/AddNewItemButton/AddNewItemButton";
import CircleDot from "@components/CircleDot/CircleDot";
import PageDetail from "@components/PageDetail/PageDetail";
import { PageFilter } from "@shared/types/page.types";
import CardGrid from "../../components/CardGrid/CardGrid";
import CardGridItem from "../../components/CardGrid/CardGridItem";
import Dictionary from "../../helpers/translation/dictionary/dictionary";
import useUsers from "./hooks/useUsers";
import { getNewItem, UserRowProps } from "./props/UserTypes";
import UserDetail from "./UserDetail";
import styles from "./UserOverview.module.css";
/* YENİ */

const UserOverview: React.FC = () => {
  const { t } = useTranslation();

  const [filters, setFilters] = useState<PageFilter>({
    query: "",
    showActives: true,
  });

  const changeQuery = (query: string) => {
    setFilters((prev) => ({
      ...prev,
      query: query,
    }));
  };

  const toggleFilter = () => {
    setFilters((prev) => ({
      ...prev,
      showActives: !prev.showActives,
    }));
  };

  const {
    items,
    handleAddItems,
    handleUpdateItems,
    handleDeleteItems,
    refetch,
    handleUpdateItemWithId,
    isFetching,
    fetchNextPage,
    totalRecordCount,
  } = useUsers({
    searchQuery: filters.query,
  });

  const {
    mode,
    selectedEntity,
    changeSelectedEntity,
    changeMode,
    handleClickEntity,
    handleAddNewEntity,
  } = useCardGrid<UserRowProps>({
    addEntity: handleAddItems,
    deleteEntity: handleDeleteItems,
    updateEntity: handleUpdateItems,
    getNewEntity: getNewItem,
  });

  const itemCards = items.map((item) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 1 }}
      key={item.id}
    >
      <CardGridItem
        entity={item}
        selectedEntity={selectedEntity}
        leftSection={<CircleDot isActive={item.isActive} />}
        text={
          <>
            <Text lineClamp={2} fz="sm" fw={500}>
              <Highlight highlight={filters.query}>{`${item.name}`}</Highlight>
            </Text>
            <Text fz="sm" c="dimmed">
              <Highlight
                highlight={filters.query}
              >{`(${item.userName})`}</Highlight>
            </Text>
          </>
        }
        rightSection={
          <ActionIcon
            onClick={(e) => handleClickEntity(e, item)}
            radius="xl"
            variant="outline"
            color="gray"
          >
            <BsXLg style={{ marginLeft: "1px" }} size="16px" />
          </ActionIcon>
        }
      />
    </motion.div>
  ));

  return (
    <Grid className={styles.page} align="stretch" gutter="md">
      {/* SOL SÜTUN */}
      <Grid.Col span={3}>
        <CardGrid
          headerTitle={t(Dictionary.User.CARD_TITLE)}
          cards={itemCards}
          isFetching={isFetching}
          searchQuery={filters.query}
          onSearchChange={changeQuery}
          headerRightComponent={
            <AddNewItemButton
              disabled={mode === "create"}
              handleAdd={(e) => handleAddNewEntity(e)}
            />
          }
          filterStatus={filters.showActives}
          currentItemCount={items.length}
          totalCount={totalRecordCount}
          onRefresh={refetch}
          onLoadMore={fetchNextPage}
          showFilterMenu={false}
          onFilterToggle={toggleFilter}
        />
      </Grid.Col>
      <Grid.Col span={9}>
        <PageDetail>
          {selectedEntity && (
            <UserDetail
              key={selectedEntity.id}
              selectedUser={selectedEntity}
              changeSelectedItem={changeSelectedEntity}
              handleDeleteItem={handleDeleteItems}
              handleUpdateItem={handleUpdateItems}
              handleUpdateItemWithId={handleUpdateItemWithId}
              mode={mode}
              changeMode={changeMode}
            />
          )}
        </PageDetail>
      </Grid.Col>
    </Grid>
  );
};

export default UserOverview;
