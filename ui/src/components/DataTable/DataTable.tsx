import { useRef } from "react";

import {
  AG_GRID_LOCALE_EN,
  AG_GRID_LOCALE_TR,
} from "@ag-grid-community/locale";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  colorSchemeDark,
  GetRowIdParams,
  ModuleRegistry,
  RowClickedEvent,
  themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

import Language from "@enums/language.enum";
import "./DataTable.css";
import { TableEntity } from "./types/table-entity";

import useUserPreferences from "@hooks/useUserPreferences";

ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);

interface DataTableProps<T extends TableEntity> {
  records: T[];
  columns: (ColDef<T> | ColGroupDef<T>)[];
  isFetching: boolean;
  h?: number;
  onRowClicked?(data: T): void;
  hasPagination?: boolean;
}
function DataTable<T extends TableEntity>({
  records,
  columns,
  h = 300,
  isFetching,
  onRowClicked,
  hasPagination = true,
}: DataTableProps<T>) {
  const gridRef = useRef<AgGridReact<T>>(null);

  const language = useUserPreferences(
    (state: { language: Language }) => state.language
  );

  const theme = useUserPreferences(
    (state: { colorScheme: "dark" | "light" }) => state.colorScheme
  );

  const lightTheme = themeQuartz.withParams({
    fontSize: "12px",
    fontFamily: "Inter",
  });

  const darkTheme = themeQuartz.withPart(colorSchemeDark).withParams({
    fontSize: "12px",
    fontFamily: "Inter",
    foregroundColor: "#b3b3b7",
    backgroundColor: "#25262B",
    headerBackgroundColor: "#34353a",
    oddRowBackgroundColor: "#1a1b1e",
    headerColumnResizeHandleColor: "#25262B",
  });

  const getRowId = (params: GetRowIdParams<T>) => params.data.id;

  return (
    <div style={{ width: "100%", height: h, minHeight: 200 }}>
      <AgGridReact
        theme={theme === "dark" ? darkTheme : lightTheme}
        ref={gridRef}
        rowData={records}
        columnDefs={columns}
        rowModelType="clientSide"
        pagination={hasPagination}
        getRowId={getRowId}
        gridOptions={{
          columnDefs: [
            {
              cellStyle: {
                alignContent: "center",
              },
            },
          ],
        }}
        paginationPageSize={250} // Number of rows per page
        paginationPageSizeSelector={[50, 150, 250, 500]}
        defaultColDef={{
          wrapHeaderText: true,
          resizable: false,
          flex: 1,
          lockVisible: true,
        }}
        enableCellTextSelection
        tooltipShowDelay={0}
        loading={isFetching}
        localeText={
          language === Language.Turkish ? AG_GRID_LOCALE_TR : AG_GRID_LOCALE_EN
        }
        tooltipHideDelay={2000}
        onRowClicked={(event: RowClickedEvent) =>
          onRowClicked && onRowClicked(event.data)
        }
      />
    </div>
  );
}

export default DataTable;
