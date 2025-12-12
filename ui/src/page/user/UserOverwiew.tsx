import React, { useState } from "react";

import { Grid, Highlight, Text } from "@mantine/core";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import AddNewItemButton from "@components/AddNewItemButton/AddNewItemButton";
import useCardGrid from "@components/CardGrid/hooks/useCardGrid";
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

  console.log("selectedEntity:", selectedEntity); // DEBUG
  console.log("mode:", mode); // DEBUG

  const itemCards = items.map((item) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 1 }}
      key={item.id}
    >
      <CardGridItem
        entity={item}
        selectedEntity={selectedEntity}
        onCardClick={(e) => {
          console.log("Card clicked:", item); // DEBUG
          handleClickEntity(e, item);
        }}
        leftSection={<CircleDot isActive={item.isActive} />}
        text={
          <Text lineClamp={2} fz="sm" fw={500} component="span">
            <Highlight highlight={filters.query} component="span" unstyled>
              {`${item.name}`}
            </Highlight>
          </Text>
        }
      />
    </motion.div>
  ));

  return (
    <Grid className={styles.page} align="stretch" gutter="md">
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
          {selectedEntity ? (
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
          ) : (
            <Text c="dimmed" ta="center" py="xl">
              {"Lütfen bir kullanıcı seçiniz"}
            </Text>
          )}
        </PageDetail>
      </Grid.Col>
    </Grid>
  );
};

export default UserOverview;
