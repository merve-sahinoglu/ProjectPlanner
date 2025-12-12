import React, { useState } from "react";

import { Grid, Highlight, Text } from "@mantine/core";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import AddNewItemButton from "@components/AddNewItemButton/AddNewItemButton";
import CardGrid from "@components/CardGrid/CardGrid";
import CardGridItem from "@components/CardGrid/CardGridItem";
import useCardGrid from "@components/CardGrid/hooks/useCardGrid";
import PageDetail from "@components/PageDetail/PageDetail";
import Dictionary from "../../helpers/translation/dictionary/dictionary";
import useRooms from "./hooks/useRooms";
import { RoomRowProps } from "./props/RoomRowProps";
import RoomDetail from "./RoomDetail";
import styles from "./RoomOverview.module.css";

const getNewRoom = (): RoomRowProps => ({
  id: crypto.randomUUID(),
  name: "",
  description: "",
  maxCapacity: 0,
  isAvailable: false,
  roomTypeId: "0",
  amenities: [],
});

const RoomOverview: React.FC = () => {
  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    query: "",
    showActives: true,
  });

  const changeQuery = (query: string) => {
    setFilters((prev) => ({ ...prev, query }));
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
  } = useRooms({
    searchQuery: filters.query,
    isActive: filters.showActives,
  });

  const {
    mode,
    selectedEntity,
    changeSelectedEntity,
    changeMode,
    handleClickEntity,
    handleAddNewEntity,
  } = useCardGrid<RoomRowProps>({
    addEntity: handleAddItems,
    deleteEntity: handleDeleteItems,
    updateEntity: handleUpdateItems,
    getNewEntity: getNewRoom,
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
        onCardClick={(e) => handleClickEntity(e, item)}
        text={
          <Text lineClamp={2} fz="sm" fw={500}>
            <Highlight highlight={filters.query}>{item.name}</Highlight>
          </Text>
        }
      />
    </motion.div>
  ));

  console.log("Item rendered:", items); // DEBUG

  return (
    <Grid className={styles.page} align="stretch" gutter="md">
      <Grid.Col span={3}>
        <CardGrid
          headerTitle={t(Dictionary.Room.CARD_TITLE)}
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
            <RoomDetail
              key={selectedEntity.id}
              selectedRoom={selectedEntity}
              handleDeleteItem={handleDeleteItems}
              handleUpdateItem={handleUpdateItems}
              handleUpdateItemWithId={handleUpdateItemWithId}
              mode={mode}
              changeMode={changeMode}
              changeSelectedItem={changeSelectedEntity}
            />
          ) : (
            <Text c="dimmed" ta="center" py="xl">
              Lütfen bir oda seçiniz
            </Text>
          )}
        </PageDetail>
      </Grid.Col>
    </Grid>
  );
};

export default RoomOverview;
