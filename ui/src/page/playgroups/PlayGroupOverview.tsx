import React, { useState } from "react";

import { Grid, Highlight, Text } from "@mantine/core";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import useCardGrid from "@components/CardGrid/hooks/useCardGrid";
import PageDetail from "@components/PageDetail/PageDetail";
import AddNewItemButton from "../../components/AddNewItemButton/AddNewItemButton";
import CardGrid from "../../components/CardGrid/CardGrid";
import CardGridItem from "../../components/CardGrid/CardGridItem";
import Dictionary from "../../helpers/translation/dictionary/dictionary";
import usePlayGroup from "./hooks/usePlayGroup";
import PlayGroupDetail from "./PlayGroupDetail";
import { PlayGroupRowProps } from "./props/PlayGroupRowProps";

const getNewPlayGroup = (): PlayGroupRowProps => ({
  id: crypto.randomUUID(),
  name: "",
  minAge: 0,
  maxAge: 0,
  maxParticipants: 0,
  playgroupTherapists: [],
  isActive: false,
});

const PlayGroupOverview: React.FC = () => {
  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    query: "",
    showActives: true,
  });

  const changeQuery = (query: string) => {
    setFilters((prev) => ({
      ...prev,
      query,
    }));
  };

  const toggleFilter = () => {
    setFilters((prev) => ({
      ...prev,
      showActives: !prev.showActives,
    }));
  };

  const {
    playGroups,
    handleAddItems,
    handleUpdateItems,
    handleDeleteItems,
    refetch,
    handleUpdateItemWithId,
    isFetching,
    fetchNextPage,
    totalRecordCount,
  } = usePlayGroup({
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
  } = useCardGrid<PlayGroupRowProps>({
    addEntity: handleAddItems,
    deleteEntity: handleDeleteItems,
    updateEntity: handleUpdateItems,
    getNewEntity: getNewPlayGroup,
  });

  const playGroupCards = playGroups.map((item) => (
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
          <Text lineClamp={2} fz="sm" fw={500} component="span">
            <Highlight highlight={filters.query} component="span" unstyled>
              {item.name}
            </Highlight>
          </Text>
        }
      />
    </motion.div>
  ));

  return (
    <Grid align="stretch" gutter="md">
      <Grid.Col span={3}>
        <CardGrid
          headerTitle={t(Dictionary.PlayGroup.CARD_TITLE)}
          cards={playGroupCards}
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
          currentItemCount={playGroups.length}
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
            <PlayGroupDetail
              key={selectedEntity.id}
              selectedPlayGroup={selectedEntity}
              changeSelectedItem={changeSelectedEntity}
              handleDeleteItem={handleDeleteItems}
              handleUpdateItem={handleUpdateItems}
              handleUpdateItemWithId={handleUpdateItemWithId}
              mode={mode}
              changeMode={changeMode}
            />
          ) : (
            <Text c="dimmed" ta="center" py="xl">
              Lütfen bir playgroup seçiniz
            </Text>
          )}
        </PageDetail>
      </Grid.Col>
    </Grid>
  );
};

export default PlayGroupOverview;
