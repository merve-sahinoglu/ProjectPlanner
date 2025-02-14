import { ActionIcon, Grid, Select } from "@mantine/core";
import { VscClearAll } from "react-icons/vsc";
import styles from "./SearchGrid.module.css";

interface SearchGridProps {
  children: React.ReactNode;
  showFilterSelect?: boolean;
  selectedProcessType?: string | null;
  data?: SelectItem[];
  handleProcessTypeChange?(eventValue: string | null): void;
  clearItemList?(event: React.MouseEvent): void;
  showClearButton?: boolean;
  isDisabled?: boolean;
}

function SearchGrid({
  selectedProcessType,
  data,
  clearItemList,
  handleProcessTypeChange,
  children,
  showFilterSelect = true,
  showClearButton = false,
  isDisabled = false,
}: SearchGridProps) {
  return (
    <Grid className={styles.header}>
      {showFilterSelect && (
        <Grid.Col span={2.7}>
          <Select
            disabled={isDisabled}
            dropdownPosition="bottom"
            radius="md"
            mt={2}
            styles={{
              dropdown: {
                marginTop: -5,
                maxWidth: 250,
                borderRadius: 10,
                overflowY: "auto",
              },
              item: { marginTop: 5, marginBottom: 5 },
            }}
            size="md"
            placeholder="Select process type"
            allowDeselect={false}
            value={selectedProcessType}
            onChange={(e) =>
              handleProcessTypeChange && handleProcessTypeChange(e)
            }
            data={data || []}
          />
        </Grid.Col>
      )}

      <Grid.Col
        md={
          showFilterSelect && showClearButton
            ? 8.3
            : !showClearButton && showFilterSelect
            ? 9.3
            : 12
        }
        mt={2}
      >
        {children}
      </Grid.Col>
      {showClearButton && (
        <Grid.Col md={1}>
          <ActionIcon
            disabled={isDisabled}
            onClick={(e) => clearItemList && clearItemList(e)}
            className={styles.clearButton}
            ml={25}
            size="2.5rem"
            variant="outline"
          >
            <VscClearAll size="2rem" color="gray" />
          </ActionIcon>
        </Grid.Col>
      )}
    </Grid>
  );
}

export default SearchGrid;
