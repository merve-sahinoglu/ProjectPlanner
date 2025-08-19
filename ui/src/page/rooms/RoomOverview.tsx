import { Grid, Group, Highlight, Text, Title } from "@mantine/core";
import React, { useMemo, useRef, useState } from "react";
import { modals } from "@mantine/modals";
import Dictionary from "../../constants/dictionary";
import { useTranslation } from "react-i18next";
import { useAuthenticationContext } from "../../authentication/AuthenticationContext";
import { useCredentialActions } from "../../authentication/store/useCredentialsStore";
import { BsExclamationDiamondFill } from "react-icons/bs";
import { motion } from "framer-motion";
import CardGridItem from "../../components/CardGrid/CardGridItem";
import CardGrid from "../../components/CardGrid/CardGrid";
import AddNewItemButton from "../../components/AddNewItemButton/AddNewItemButton";
import CardGridDetail from "../../components/CardGrid/CardGridDetail";
import PaginationMetadata from "../../types/pagination-metadata";
import { RoomRowProps, RoomType } from "./props/RoomRowProps";
import RoomDetail from "./RoomDetail";
import useRooms from "./hooks/useRooms";
import styles from "./RoomOverview.module.css";

const RoomOverview: React.FC = () => {
  const { t } = useTranslation();

  // const { currentUser } = useAuthenticationContext();

  // const { checkIfUserHasAuthorization } = useCredentialActions();

  const createdRoomGuid = useRef<string>(crypto.randomUUID());

  const [roomInput, setRoomInput] = useState<string>("");

  const [roomStatus, setRoomStatus] = useState<boolean>(true);

  const [metadata, setMetadata] = useState<PaginationMetadata | null>(null);

  const changeMetadata = (value: PaginationMetadata | null) => {
    setMetadata(value);
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
  } = useRooms({
    searchQuery: roomInput,
    isActive: roomStatus,
    changeMetadata: changeMetadata,
  });

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const [canAddItem, setCanAddItem] = useState<boolean>(true);

  const [selectedItem, setSelectedItem] = useState<RoomRowProps>();

  const toggleItemFilter = () => {
    setRoomStatus(!roomStatus);
  };

  const changeCreatedItemGuid = (id: string) => {
    createdRoomGuid.current = id;
  };

  const keepDefinition = (item: RoomRowProps) => {
    setCanAddItem(!canAddItem);
    handleDeleteItems(createdRoomGuid.current);
    createdRoomGuid.current = "";

    if (createdRoomGuid.current !== item.id) {
      setIsDisabled(true);
    }

    setSelectedItem(item);
  };

  const changeSelectedItem = (item: RoomRowProps | null) => {
    if (item) {
      setSelectedItem(item);
    }
  };

  const handleKeepModifiedItem = (item: RoomRowProps) => {
    if (selectedItem) {
      handleUpdateItems(selectedItem);
    }

    setIsDisabled(true);
    setSelectedItem(item);
  };

  const handleClickItem = (event: React.MouseEvent, item: RoomRowProps) => {
    event.preventDefault();
    if (!canAddItem) {
      modals.openConfirmModal({
        title: (
          <Group>
            <BsExclamationDiamondFill color="red" size="1.5rem" />{" "}
            <Title order={5}>{t(Dictionary.Popup.NOT_SAVED_TITLE)}</Title>
          </Group>
        ),
        centered: true,
        children: (
          <Text fz={14}>{t(Dictionary.Popup.NOT_SAVED_DESCRIPTION)}</Text>
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

    if (createdRoomGuid.current !== item.id) {
      setIsDisabled(true);
    }

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
              <Highlight highlight={roomInput}>{`${item.name}`}</Highlight>
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
          <Group>
            <BsExclamationDiamondFill color="red" size="1.5rem" />{" "}
            <Title order={5}>
              {t(Dictionary.Popup.MODIFICATION_NOT_SAVED_TITLE)}
            </Title>
          </Group>
        ),
        centered: true,
        children: (
          <Text fz={14}>
            {t(Dictionary.Popup.MODIFICATION_NOT_SAVED_DESCRIPTION)}
          </Text>
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

    createdRoomGuid.current = crypto.randomUUID();

    const newRoom: RoomRowProps = {
      id: createdRoomGuid.current,
      name: "",
      description: "",
      maxCapacity: 0,
      isAvailable: false,
      roomTypeId: "0",
      amenities: [],
    };

    setSelectedItem(newRoom);

    handleAddItems(newRoom);

    setIsDisabled(false);
  };

  return (
    <Grid justify="center" align="stretch">
      <Grid.Col span={{ xs: 12, sm: 12, md: 3 }} className={styles.col}>
        <CardGrid
          title={t(Dictionary.Room.CARD_TITLE)}
          cards={itemCards}
          isLoading={isFetching}
          searchInput={roomInput}
          setSearchInput={setRoomInput}
          isSearching={isFetching}
          addButton={
            <AddNewItemButton
              disabled={!canAddItem}
              handleAdd={(e) => handleAdd(e)}
            />
          }
          filterStatus={roomStatus}
          filterFunction={toggleItemFilter}
          totalItemCount={0}
          currentItemCount={items.length}
          refreshData={refetch}
          fetchNextPage={fetchNextPage}
        />
      </Grid.Col>
      <Grid.Col span={{ xs: 12, sm: 12, md: 9 }} className={styles.col}>
        <div className={styles.panel}>
          {selectedItem && (
            <div className={styles.panelBody}>
              <CardGridDetail>
                <RoomDetail
                  key={selectedItem?.id}
                  selectedRoom={selectedItem}
                  handleDeleteItem={handleDeleteItems}
                  handleUpdateItem={handleUpdateItems}
                  canAddItem={canAddItem}
                  setCanAddItem={setCanAddItem}
                  createdItemGuid={createdRoomGuid.current}
                  disabled={isDisabled}
                  setDisabled={setIsDisabled}
                  changeCreatedItemGuid={changeCreatedItemGuid}
                  handleUpdateItemWithId={handleUpdateItemWithId}
                  changeSelectedItem={changeSelectedItem}
                />
              </CardGridDetail>
            </div>
          )}
        </div>
      </Grid.Col>
    </Grid>
  );
};

export default RoomOverview;
