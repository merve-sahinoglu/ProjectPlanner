import React, { useRef, useState } from "react";

import { Group, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useTranslation } from "react-i18next";
import { BsExclamationDiamondFill } from "react-icons/bs";

import Dictionary from "@helpers/translation/dictionary/dictionary";
import { PageState } from "@shared/types/page.types";

interface Entity {
  id: string;
}

interface UseCardGridProps<T extends Entity> {
  deleteEntity: (id: string) => void;
  updateEntity: (entity: T) => void;
  addEntity: (entity: T) => void;
  getNewEntity: () => T;
}

function useCardGrid<T extends Entity>({
  deleteEntity,
  updateEntity,
  addEntity,
  getNewEntity,
}: UseCardGridProps<T>) {
  const { t } = useTranslation();

  const [mode, setMode] = useState<PageState>("view");

  const [selectedEntity, setSelectedEntity] = useState<T | null>(null);

  const newEntityId = useRef<string | null>(null);

  const changeSelectedEntity = (entity: T | null) => {
    setSelectedEntity(entity);
  };

  const changeMode = (mode: PageState) => {
    setMode(mode);
  };

  const handleClickEntity = (event: React.MouseEvent, entity: T) => {
    event.preventDefault();

    if (mode === "create") {
      modals.openConfirmModal({
        title: (
          <Group>
            <BsExclamationDiamondFill color={"red"} size="24px" />{" "}
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
        onConfirm: () => {
          setMode("view");
          if (newEntityId.current) deleteEntity(newEntityId.current);
          setSelectedEntity(entity);
        },
      });
      return;
    }

    if (mode === "edit") {
      modals.openConfirmModal({
        title: (
          <Group>
            <BsExclamationDiamondFill color="red" size="24px" />{" "}
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
        onConfirm: () => {
          if (selectedEntity) {
            updateEntity(entity);
          }

          setMode("view");
          setSelectedEntity(entity);
        },
      });
      return;
    }

    setMode("view");
    setSelectedEntity(entity);
  };

  const prepareNewEntity = () => {
    const newEntity = getNewEntity();
    newEntityId.current = newEntity.id;
    setSelectedEntity(newEntity);
    addEntity(newEntity);
  };

  const handleAddNewEntity = (event: React.MouseEvent) => {
    event.preventDefault();

    if (mode === "edit") {
      modals.openConfirmModal({
        title: (
          <Group>
            <BsExclamationDiamondFill color="red" size="24px" />{" "}
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
        onConfirm: () => {
          setMode("create");
          prepareNewEntity();
        },
      });
      return;
    }

    if (mode === "create") return;

    setMode("create");

    prepareNewEntity();
  };

  return {
    mode,
    selectedEntity,
    changeMode,
    changeSelectedEntity,
    handleClickEntity,
    handleAddNewEntity,
  };
}

export default useCardGrid;
