/* eslint-disable react/no-unused-prop-types */
import { ICellRendererParams } from "@ag-grid-community/core";
import { BsCheck, BsX } from "react-icons/bs";

function DataTableStatusIndicator({ value }: ICellRendererParams) {
  // eslint-disable-next-line react/destructuring-assignment
  return (
    <>
      {value ? (
        <BsCheck size={20} color="#43A047" />
      ) : (
        <BsX size={20} color="#ec7063" />
      )}
    </>
  );
}

export default DataTableStatusIndicator;
