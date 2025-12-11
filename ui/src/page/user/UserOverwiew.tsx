import React, { useState } from "react";

import useCardGrid from "@components/CardGrid/hooks/useCardGrid";
import { ActionIcon, Grid, Highlight, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { BsXLg } from "react-icons/bs";

import AddNewItemButton from "@components/AddNewItemButton/AddNewItemButton";
import PageDetail from "@components/PageDetail/PageDetail";
import CardGrid from "../../components/CardGrid/CardGrid";
import CardGridItem from "../../components/CardGrid/CardGridItem";
import Dictionary from "../../helpers/translation/dictionary/dictionary";
import PaginationMetadata from "../../types/pagination-metadata";
import useUsers from "./hooks/useUsers";
import { getNewItem, UserRowProps } from "./props/UserTypes";
import UserDetail from "./UserDetail";
import styles from "./UserOverview.module.css";
/* YENİ */

const UserOverview: React.FC = () => {
  const { t } = useTranslation();
  const [createdUserGuid, setCreatedUserGuid] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [userStatus, setUserStatus] = useState<boolean>(true);
  const [metadata, setMetadata] = useState<PaginationMetadata | null>(null);

  const changeMetadata = (value: PaginationMetadata | null) =>
    setMetadata(value);

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
    searchQuery: userInput,
    isActive: userStatus,
    changeMetadata: changeMetadata,
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
    <CardGridItem
      entity={item}
      selectedEntity={selectedEntity}
      text={
        <>
          <Text lineClamp={2} fz="sm" fw={500}>
            <Highlight highlight={userInput}>{`${item.name}`}</Highlight>
          </Text>
          <Text fz="sm" c="dimmed">
            <Highlight highlight={userInput}>{`(${item.userName})`}</Highlight>
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
  ));

  return (
    <Grid className={styles.page} align="stretch" gutter="md">
      {/* SOL SÜTUN */}
      <Grid.Col span={3}>
        <CardGrid
          headerTitle={t(Dictionary.User.CARD_TITLE)}
          cards={itemCards}
          isFetching={isFetching}
          searchQuery={userInput}
          onSearchChange={setUserInput}
          headerRightComponent={
            <AddNewItemButton
              disabled={mode === "create"}
              handleAdd={(e) => handleAddNewEntity(e)}
            />
          }
          filterStatus={userStatus}
          currentItemCount={items.length}
          onRefresh={refetch}
          onLoadMore={fetchNextPage}
          showFilterMenu={false}
          totalCount={totalRecordCount}
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
