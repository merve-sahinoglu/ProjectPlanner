import DataTable from "../../../components/DataTable/DataTable";
import { Instructor } from "../types/instructer-types";

import { ColDef } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import Dictionary from "../../../helpers/translation/dictionary/dictionary";

interface InstructorTableProps {
  records: Instructor[];
  isFetching: boolean;
  h?: number | string;
  onRowClicked?: (data: Instructor) => void;
  hasPagination?: boolean;
}

function InstructorTable({
  records,
  h = 300,
  isFetching,
  onRowClicked,
  hasPagination = true,
}: InstructorTableProps) {
  const { t } = useTranslation();
  const columns: ColDef<Instructor>[] = [
    { field: "name", headerName: t(Dictionary.Instructor.Table.NAME) },
    { field: "surname", headerName: t(Dictionary.Instructor.Table.SURNAME) },
    { field: "email", headerName: t(Dictionary.Instructor.Table.EMAIL) },
    { field: "phone", headerName: t(Dictionary.Instructor.Table.PHONE) },
    { field: "type", headerName: t(Dictionary.Instructor.Table.TYPE) },
  ];

  return (
    <DataTable
      records={records}
      columns={columns}
      isFetching={isFetching}
      h={h}
      onRowClicked={onRowClicked}
      hasPagination={hasPagination}
    />
  );
}

export default InstructorTable;
