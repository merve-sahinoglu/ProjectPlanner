import DataTable from "../../../component/DataTable/DataTable";
import { ColDef } from "@ag-grid-community/core";
interface Instructor {
  id: string;
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  type: "dil terapisi" | "müzik terapisi" | "özel eğitim";
}

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
  const columns: ColDef<any>[] = [
    { field: "name", headerName: "Ad" },
    { field: "surname", headerName: "Soyad" },
    { field: "email", headerName: "E-posta" },
    { field: "phone", headerName: "Telefon" },
    { field: "type", headerName: "Tip" },
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
