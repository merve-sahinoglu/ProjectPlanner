import DataTable from "../../../component/DataTable/DataTable";
import DataTableActionButton from "../../../component/DataTable/DataTableActionButton";
import { BsTrash } from "react-icons/bs";
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
  onRowClicked?(data: Instructor): void;
  hasPagination?: boolean;
  onDelete(id: string): void;
}

function InstructorTable({
  records,
  h = 300,
  isFetching,
  onRowClicked,
  hasPagination = true,
  onDelete,
}: InstructorTableProps) {
  const handleDelete = async (event: React.MouseEvent, data: Instructor) => {
    event.preventDefault();

    if (records.find((x) => x.id === data.id)) {
      onDelete(data.id);
    } else {
      console.log("Hata var geri bas");
    }
  };

  const columns = [
    { field: "id", headerName: "ID"  ,cellStyle: { textAlign: 'center' },
      flex: 1 },
    { field: "name", headerName: "Ad" },
    { field: "surname", headerName: "Soyad" },
    { field: "email", headerName: "E-posta" },
    { field: "phone", headerName: "Telefon" },
    { field: "type", headerName: "Tip" },
    {
      colId: "actions",
      flex: 1,
      sortable: false,
      headerName: "Actions",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        paddingTop: 5,
      },
      cellRenderer: DataTableActionButton,
      cellRendererParams: {
        handleClick: handleDelete,
        icon: <BsTrash />,
      },
    },
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
