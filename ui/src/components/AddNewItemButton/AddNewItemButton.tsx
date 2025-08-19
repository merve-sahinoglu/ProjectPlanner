import { ActionIcon } from "@mantine/core";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import classes from "./AddNewItemButton.module.css";

interface AddNewItemButtonProps {
  disabled: boolean;
  handleAdd: (event: React.MouseEvent) => void;
}
function AddNewItemButton({ disabled, handleAdd }: AddNewItemButtonProps) {
  return (
    <ActionIcon
      disabled={disabled}
      color="blue"
      variant="filled"
      className={classes.add}
      onClick={(e) => handleAdd(e)}
    >
      <AiOutlinePlus />
    </ActionIcon>
  );
}

export default AddNewItemButton;
