import { Button, Group } from "@mantine/core";
import React from "react";
import { useTranslation } from "react-i18next";
import Dictionary from "../../constants/dictionary";
interface OperationButtonsProps {
  disabled: boolean;
  isDirty: boolean;
  handleSave(e: React.MouseEvent): void;
  handleEdit(e: React.MouseEvent): void;
  handleCancel(e: React.MouseEvent): void;
  saveLabel?: string;
  editLabel?: string;
  cancelLabel?: string;
}

function OperationButtons({
  disabled,
  isDirty,
  handleSave,
  handleEdit,
  handleCancel,
  saveLabel = Dictionary.Button.SAVE,
  editLabel = Dictionary.Button.EDIT,
  cancelLabel = Dictionary.Button.CANCEL,
}: OperationButtonsProps) {
  const { t } = useTranslation();

  return (
    <>
      {!disabled && (
        <Group grow>
          <Button
            variant="outline"
            color="red"
            hidden={disabled}
            fullWidth
            onClick={(e) => handleCancel(e)}
            mt="md"
          >
            {t(cancelLabel)}
          </Button>
          <Button
            variant="outline"
            disabled={!isDirty}
            hidden={disabled}
            fullWidth
            onClick={(e) => handleSave(e)}
            mt="md"
          >
            {t(saveLabel)}
          </Button>
        </Group>
      )}
      {disabled && (
        <Button
          variant="outline"
          hidden={!disabled}
          fullWidth
          onClick={(e) => handleEdit(e)}
          mt="md"
        >
          {t(editLabel)}
        </Button>
      )}
    </>
  );
}

export default OperationButtons;
