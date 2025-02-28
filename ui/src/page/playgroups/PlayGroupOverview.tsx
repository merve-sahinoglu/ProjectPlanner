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
import usePlayGroup from "./hooks/usePlayGroup";
import { PlayGroupRowProps } from "./props/PlayGroupRowProps";
import PlayGroupDetail from "./PlayGroupDetail";

const PlayGroupOverview: React.FC = () => {
  const { t } = useTranslation();

  // const { currentUser } = useAuthenticationContext();

  // const { checkIfUserHasAuthorization } = useCredentialActions();

  const createdPlayGroupGuid = useRef<string>(crypto.randomUUID());

  const [playGroupInput, setPlayGroupInput] = useState<string>("");

  const [playGroupStatus, setPlayGroupStatus] = useState<boolean>(true);

  const [metadata, setMetadata] = useState<PaginationMetadata | null>(null);

  const changeMetadata = (value: PaginationMetadata | null) => {
    setMetadata(value);
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
  } = usePlayGroup({
    searchQuery: playGroupInput,
    isActive: playGroupStatus,
    changeMetadata: changeMetadata,
  });

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const [canAddItem, setCanAddItem] = useState<boolean>(true);

  const [selectedItem, setSelectedItem] = useState<PlayGroupRowProps>();

  const toggleItemFilter = () => {
    setPlayGroupStatus(!playGroupStatus);
  };

  const changeCreatedItemGuid = (id: string) => {
    createdPlayGroupGuid.current = id;
  };

  const keepDefinition = (item: PlayGroupRowProps) => {
    setCanAddItem(!canAddItem);
    handleDeleteItems(createdPlayGroupGuid.current);
    createdPlayGroupGuid.current = "";

    if (createdPlayGroupGuid.current !== item.id) {
      setIsDisabled(true);
    }

    setSelectedItem(item);
  };

  const changeSelectedItem = (item: PlayGroupRowProps | null) => {
    if (item) {
      setSelectedItem(item);
    }
  };

  const handleKeepModifiedItem = (item: PlayGroupRowProps) => {
    if (selectedItem) {
      handleUpdateItems(selectedItem);
    }

    setIsDisabled(true);
    setSelectedItem(item);
  };

  const handleClickItem = (
    event: React.MouseEvent,
    item: PlayGroupRowProps
  ) => {
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

    if (createdPlayGroupGuid.current !== item.id) {
      setIsDisabled(true);
    }

    setSelectedItem(item);
  };

  const playGroupsCards = useMemo(
    () =>
      playGroups.map((item) => (
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
              <Highlight highlight={playGroupInput}>{`${item.name}`}</Highlight>
            </Text>
          </CardGridItem>
        </motion.div>
      )),
    [playGroups, selectedItem]
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

    createdPlayGroupGuid.current = crypto.randomUUID();

    const newPlayGroup: PlayGroupRowProps = {
      id: createdPlayGroupGuid.current,
      name: "",
      minAge: 0,
      maxAge: 0,
      maxParticipants: 0,
      playgroupTherapists: [],
      isActive: false,
    };

    setSelectedItem(newPlayGroup);

    handleAddItems(newPlayGroup);

    setIsDisabled(false);
  };

  return (
    <Grid justify="center" align="stretch">
      <Grid.Col span={{ xs: 12, sm: 12, md: 3 }}>
        <CardGrid
          title={t(Dictionary.PlayGroup.CARD_TITLE)}
          cards={playGroupsCards}
          isLoading={isFetching}
          searchInput={playGroupInput}
          setSearchInput={setPlayGroupInput}
          isSearching={isFetching}
          addButton={
            <AddNewItemButton
              disabled={!canAddItem}
              handleAdd={(e) => handleAdd(e)}
            />
          }
          filterStatus={playGroupStatus}
          filterFunction={toggleItemFilter}
          totalItemCount={0}
          currentItemCount={playGroups.length}
          refreshData={refetch}
          fetchNextPage={fetchNextPage}
        />
      </Grid.Col>
      <Grid.Col span={{ xs: 12, sm: 12, md: 9 }}>
        {selectedItem && (
          <CardGridDetail>
            <PlayGroupDetail
              key={selectedItem?.id}
              selectedPlayGroup={selectedItem}
              handleDeleteItem={handleDeleteItems}
              handleUpdateItem={handleUpdateItems}
              canAddItem={canAddItem}
              setCanAddItem={setCanAddItem}
              createdItemGuid={createdPlayGroupGuid.current}
              disabled={isDisabled}
              setDisabled={setIsDisabled}
              changeCreatedItemGuid={changeCreatedItemGuid}
              handleUpdateItemWithId={handleUpdateItemWithId}
              changeSelectedItem={changeSelectedItem}
            />
          </CardGridDetail>
        )}
      </Grid.Col>
    </Grid>
  );
};

export default PlayGroupOverview;
