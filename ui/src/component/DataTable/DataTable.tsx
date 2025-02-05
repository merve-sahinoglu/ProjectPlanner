import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import {
  ColDef,
  ColGroupDef,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
  RowClickedEvent,
} from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useRef, useState } from "react";
import "./DataTable.css";
import {
  AG_GRID_LOCALE_EN,
  AG_GRID_LOCALE_TR,
} from "@ag-grid-community/locale";
import Language from "../../enum/language.ts";
import useUserPreferences from "../../hooks/useUserPreferenceStore.tsx";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export interface TableEntity {
  id: string;
}

interface DataTableProps<T extends TableEntity> {
  records: T[];
  columns: (ColDef<T> | ColGroupDef<T>)[];
  isFetching: boolean;
  h?: number | string;
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
  const gridRef = useRef<GridApi<any> | null>(null);

  const [isReady, setIsReady] = useState(true);

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
  };

  const language = useUserPreferences((state) => state.language);

  // const theme = useUserPreferences(state => state.colorScheme);

  const getRowId = (params: GetRowIdParams<T>) => params.data.id;

  useEffect(() => {
    if (gridRef.current) {
      setIsReady(false);
      setTimeout(() => setIsReady(true), 0);
    }
  }, [language]);

  return isReady ? (
    <div className={"ag-theme-quartz"} style={{ width: "100%", height: h }}>
      <AgGridReact
        rowData={records}
        columnDefs={columns}
        rowModelType="clientSide"
        pagination={hasPagination}
        getRowId={getRowId}
        paginationPageSize={250} // Number of rows per page
        paginationPageSizeSelector={[50, 150, 250, 500]}
        defaultColDef={{
          wrapHeaderText: true,
          resizable: false,
          flex: 1,
          lockVisible: true,
        }}
        tooltipShowDelay={0}
        loading={isFetching}
        localeText={
          language === Language.Turkish ? AG_GRID_LOCALE_TR : AG_GRID_LOCALE_EN
        }
        tooltipHideDelay={2000}
        onRowClicked={(event: RowClickedEvent) =>
          onRowClicked && onRowClicked(event.data)
        }
        onGridReady={onGridReady}
      />
    </div>
  ) : (
    <div />
  );
}

export default DataTable;
