import { Grid, Highlight, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { motion } from "framer-motion";
import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsExclamationDiamondFill } from "react-icons/bs";
import AddNewItemButton from "../../components/AddNewItemButton/AddNewItemButton";
import CardGrid from "../../components/CardGrid/CardGrid";
import CardGridItem from "../../components/CardGrid/CardGridItem";
import CardGridDetail from "../../components/CardGrid/components/CardGridHeader";
import Dictionary from "../../helpers/translation/dictionary/dictionary";
import PaginationMetadata from "../../types/pagination-metadata";
import useUsers from "./hooks/useUsers";
import { UserRowProps } from "./props/UserTypes";
import UserDetail from "./UserDetail";
/* YENİ */
import styles from "./UserOverview.module.css";

const UserOverview: React.FC = () => {
  const { t } = useTranslation();
  const createdUserGuid = useRef<string>(crypto.randomUUID());
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
  } = useUsers({
    searchQuery: userInput,
    isActive: userStatus,
    changeMetadata: changeMetadata,
  });

  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [canAddItem, setCanAddItem] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<UserRowProps>();

  const toggleItemFilter = () => setUserStatus(!userStatus);
  const changeCreatedItemGuid = (id: string) => {
    createdUserGuid.current = id;
  };

  const keepDefinition = (item: UserRowProps) => {
    setCanAddItem(!canAddItem);
    handleDeleteItems(createdUserGuid.current);
    createdUserGuid.current = "";
    if (createdUserGuid.current !== item.id) setIsDisabled(true);
    setSelectedItem(item);
  };

  const changeSelectedItem = (item: UserRowProps | null) => {
    if (item) setSelectedItem(item);
  };

  const handleClickItem = (event: React.MouseEvent, item: UserRowProps) => {
    event.preventDefault();
    if (!canAddItem) {
      modals.openConfirmModal({
        title: (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BsExclamationDiamondFill color="red" size="1.5rem" />
            <span>{t(Dictionary.Popup.NOT_SAVED_TITLE)}</span>
          </div>
        ),
        centered: true,
        children: (
          <span style={{ fontSize: 14 }}>
            {t(Dictionary.Popup.NOT_SAVED_DESCRIPTION)}
          </span>
        ),
        labels: {
          cancel: t(Dictionary.Button.NO),
          confirm: t(Dictionary.Button.YES),
        },
        confirmProps: { color: "red", size: "xs" },
        cancelProps: { size: "xs" },
        onConfirm: () => keepDefinition(item),
      });
      return;
    }
    if (createdUserGuid.current !== item.id) setIsDisabled(true);
    setSelectedItem(item);
  };

  const itemCards = useMemo(
    () =>
      items.map((item) => (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          key={item.id}
        >
          <CardGridItem
            entity={item}
            selectedEntity={selectedItem}
            handleCardItemClick={(e) => handleClickItem(e, item)}
          >
            <Text lineClamp={2} fz="sm" fw={500}>
              <Highlight highlight={userInput}>{`${item.name}`}</Highlight>
            </Text>
            <Text fz="sm" c="dimmed">
              <Highlight
                highlight={userInput}
              >{`(${item.userName})`}</Highlight>
            </Text>
          </CardGridItem>
        </motion.div>
      )),
    [items, selectedItem]
  );

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isDisabled) {
      modals.openConfirmModal({
        title: (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BsExclamationDiamondFill color="red" size="1.5rem" />
            <span>{t(Dictionary.Popup.MODIFICATION_NOT_SAVED_TITLE)}</span>
          </div>
        ),
        centered: true,
        children: (
          <span style={{ fontSize: 14 }}>
            {t(Dictionary.Popup.MODIFICATION_NOT_SAVED_DESCRIPTION)}
          </span>
        ),
        labels: {
          cancel: t(Dictionary.Button.NO),
          confirm: t(Dictionary.Button.YES),
        },
        confirmProps: { color: "red", size: "xs" },
        cancelProps: { size: "xs" },
        onConfirm: () => handleAddNewItemAfterEdit(),
      });
      return;
    }
    handleAddNewItemAfterEdit();
  };

  const handleAddNewItemAfterEdit = () => {
    if (!canAddItem) return;
    setCanAddItem(false);
    createdUserGuid.current = crypto.randomUUID();

    const newUser: UserRowProps = {
      id: createdUserGuid.current,
      userName: "",
      email: "",
      password: null,
      cardNumber: null,
      searchText: "",
      name: "",
      surname: "",
      birthDate: null,
      gender: "",
      isActive: true,
      relativeId: "",
    };

    setSelectedItem(newUser);
    handleAddItems(newUser);
    setIsDisabled(false);
  };

  return (
    <Grid className={styles.page} align="stretch" gutter="md">
      {/* SOL SÜTUN */}
      <Grid.Col span={{ xs: 12, md: 4, lg: 3 }} className={styles.col}>
        <div className={styles.panel}>
          <div className={styles.panelBody}>
            <CardGrid
              title={t(Dictionary.User.CARD_TITLE)}
              cards={itemCards}
              isLoading={isFetching}
              searchInput={userInput}
              setSearchInput={setUserInput}
              isSearching={isFetching}
              addButton={
                <AddNewItemButton
                  disabled={!canAddItem}
                  handleAdd={(e) => handleAdd(e)}
                />
              }
              filterStatus={userStatus}
              filterFunction={toggleItemFilter}
              totalItemCount={0}
              currentItemCount={items.length}
              refreshData={refetch}
              fetchNextPage={fetchNextPage}
            />
          </div>
        </div>
      </Grid.Col>

      {/* SAĞ SÜTUN */}
      <Grid.Col span={{ xs: 12, md: 8, lg: 9 }} className={styles.col}>
        <div className={styles.panel}>
          <CardGridDetail>
            <div className={styles.panelBody}>
              {selectedItem && (
                <UserDetail
                  key={selectedItem?.id}
                  selectedUser={selectedItem}
                  handleDeleteItem={handleDeleteItems}
                  handleUpdateItem={handleUpdateItems}
                  canAddItem={canAddItem}
                  setCanAddItem={setCanAddItem}
                  createdItemGuid={createdUserGuid.current}
                  disabled={isDisabled}
                  setDisabled={setIsDisabled}
                  changeCreatedItemGuid={changeCreatedItemGuid}
                  handleUpdateItemWithId={handleUpdateItemWithId}
                  changeSelectedItem={changeSelectedItem}
                />
              )}
            </div>
          </CardGridDetail>
        </div>
      </Grid.Col>
    </Grid>
  );
};

export default UserOverview;
