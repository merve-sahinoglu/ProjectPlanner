import { ICellRendererParams } from 'ag-grid-community';
import { BsCheck, BsX } from 'react-icons/bs';

function DataTableStatusIndicator({ value }: ICellRendererParams) {
  return <>{value ? <BsCheck size={20} color="#43A047" /> : <BsX size={20} color="#ec7063" />}</>;
}

export default DataTableStatusIndicator;