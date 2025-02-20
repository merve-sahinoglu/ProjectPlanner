import { Grid, Group, Highlight, Text, Title } from "@mantine/core";
import React, { useMemo, useRef, useState } from "react";
import { modals } from "@mantine/modals";
import Dictionary from "../../constants/dictionary";
import { useTranslation } from "react-i18next";
import { useAuthenticationContext } from "../../authentication/AuthenticationContext";
import { useCredentialActions } from "../../authentication/store/useCredentialsStore";
import { UserRowProps } from "./props/UserTypes";
import { BsExclamationDiamondFill } from "react-icons/bs";
import { motion } from "framer-motion";
import useUsers from "./hooks/useUsers";
import UserDetail from "./UserDetail";
import CardGridItem from "../../components/CardGrid/CardGridItem";
import CardGrid from "../../components/CardGrid/CardGrid";
import AddNewItemButton from "../../components/AddNewItemButton/AddNewItemButton";
import CardGridDetail from "../../components/CardGrid/CardGridDetail";
import PaginationMetadata from "../../types/pagination-metadata";

const UserOverview: React.FC = () => {
  const { t } = useTranslation();

  // const { currentUser } = useAuthenticationContext();

  // const { checkIfUserHasAuthorization } = useCredentialActions();

  const createdUserGuid = useRef<string>(crypto.randomUUID());

  const [userInput, setUserInput] = useState<string>("");

  const [userStatus, setUserStatus] = useState<boolean>(true);

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
  } = useUsers({
    searchQuery: userInput,
    isActive: userStatus,
    changeMetadata: changeMetadata,
  });

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const [canAddItem, setCanAddItem] = useState<boolean>(true);

  const [selectedItem, setSelectedItem] = useState<UserRowProps>();

  const toggleItemFilter = () => {
    setUserStatus(!userStatus);
  };

  const changeCreatedItemGuid = (id: string) => {
    createdUserGuid.current = id;
  };

  const keepDefinition = (item: UserRowProps) => {
    setCanAddItem(!canAddItem);
    handleDeleteItems(createdUserGuid.current);
    createdUserGuid.current = "";

    if (createdUserGuid.current !== item.id) {
      setIsDisabled(true);
    }

    setSelectedItem(item);
  };

  const changeSelectedItem = (item: UserRowProps | null) => {
    if (item) {
      setSelectedItem(item);
    }
  };

  const handleKeepModifiedItem = (item: UserRowProps) => {
    if (selectedItem) {
      handleUpdateItems(selectedItem);
    }

    setIsDisabled(true);
    setSelectedItem(item);
  };

  const handleClickItem = (event: React.MouseEvent, item: UserRowProps) => {
    event.preventDefault();
    debugger;
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

    if (createdUserGuid.current !== item.id) {
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
              <Highlight
                highlight={userInput}
              >{`${item.name} ${item.surname}`}</Highlight>
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
    debugger;
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

    createdUserGuid.current = crypto.randomUUID();

    const newUser: UserRowProps = {
      id: createdUserGuid.current,
      userName: "",
      email: "",
      password: null,
      cardNumber: null,
      searchText: "",
      title: null,
      name: "",
      surname: "",
      birthDate: null,
      gender: "",
      isActive: true,
    };

    setSelectedItem(newUser);

    handleAddItems(newUser);

    setIsDisabled(false);
  };

  return (
    <Grid justify="center" align="stretch">
      <Grid.Col span={{ xs: 12, sm: 12, md: 3 }}>
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
      </Grid.Col>
      <Grid.Col span={{ xs: 12, sm: 12, md: 9 }}>
        {selectedItem && (
          <CardGridDetail>
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
          </CardGridDetail>
        )}
      </Grid.Col>
    </Grid>
  );
};

export default UserOverview;
