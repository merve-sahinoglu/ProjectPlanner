import { MultiSelect } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import useRequestHandler from "../../hooks/useRequestHandler";
import { useTranslation } from "react-i18next";
import Dictionary from "../../constants/dictionary";
import { apiUrl, createRequestUrl } from "../../config/app.config";

interface AutocompleteOption {
  value: string;
  label: string;
}

interface UserResponse {
  id: string;
  name: string;
  surname: string;
}

interface MultiSelectProps {
  changeSelectedIds: (value: string[]) => void;
  selectedIds: string[];
}

function ExecutiveMultiSelect({
  changeSelectedIds,
  selectedIds,
}: MultiSelectProps) {
  const { t } = useTranslation();
  const { fetchData } = useRequestHandler();

  const [users, setUsers] = useState<AutocompleteOption[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const request: { [key: string]: any } = { isActive: true };
      const response = await fetchData<UserResponse[]>(
        createRequestUrl(apiUrl.userUrl),
        request
      );

      if (response.isSuccess) {
        setUsers(
          response.value.map((user) => ({
            value: user.id, // ID değerini value olarak set ediyoruz
            label: `${user.name} ${user.surname}`, // Görünen ismi oluşturuyoruz
          }))
        );
      }
    };

    fetchUsers();
  }, []);

  const handleClearSelected = () => {
    changeSelectedIds([]);
  };

  return (
    <MultiSelect
      placeholder={t(Dictionary.User.EXECUTIVE)}
      label={t(Dictionary.Validation.List.SELECT)}
      data={users}
      value={selectedIds} // Seçili ID'leri burada kullanıyoruz
      onChange={(selected) => changeSelectedIds(selected)} // ID listesini güncelliyoruz
      clearable
      searchable
      rightSection={
        selectedIds.length > 0 && (
          <IconX
            size={18}
            style={{ display: "block", opacity: 0.5, cursor: "pointer" }}
            onClick={handleClearSelected}
          />
        )
      }
    />
  );
}

export default ExecutiveMultiSelect;
