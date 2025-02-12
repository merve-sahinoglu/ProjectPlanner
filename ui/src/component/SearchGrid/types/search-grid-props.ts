import { SelectItem } from "@mantine/core";

type SearchGridProps = {
  processType? : string | null;
  data: SelectItem[];
  changeProcessType?(value: string | null): void;
  showClearButton?: boolean;
  showFilterSelect?: boolean;
}

export type { SearchGridProps }