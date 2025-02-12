import { Grid, TextInput } from "@mantine/core";
import { AiOutlineSearch } from "react-icons/ai";

interface SearchInputProps {
  searchKeyword: string;
  searchPlaceholder: string;
  handleKeywordChange(event: React.ChangeEvent<HTMLInputElement>): void;
  optionalRightElement?: React.ReactNode;
  optionalBottomElement?: React.ReactNode;
  isDisabled?: boolean;
}

function SearchInput({
  searchKeyword,
  searchPlaceholder,
  handleKeywordChange,
  optionalRightElement = null,
  optionalBottomElement = null,
  isDisabled = false,
}: SearchInputProps) {
  return (
    <>
      <Grid grow align="center">
        <Grid.Col span={optionalRightElement ? 11 : 12}>
          <TextInput
            miw="48%"
            radius="md"
            size="md"
            placeholder={searchPlaceholder}
            value={searchKeyword}
            onChange={(event) => handleKeywordChange(event)}
            disabled={isDisabled}
            rightSection={<AiOutlineSearch color="#D9D9D9" size={18} />}
          />
        </Grid.Col>
        {optionalRightElement ? (
          <Grid.Col span={1}>{optionalRightElement}</Grid.Col>
        ) : null}
      </Grid>
      {optionalBottomElement || null}
    </>
  );
}

export default SearchInput;
