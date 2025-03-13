import { MultiSelect } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import useRequestHandler from "../../hooks/useRequestHandler";
import { useTranslation } from "react-i18next";
import Dictionary from "../../constants/dictionary";
import { apiUrl, createRequestUrl } from "../../config/app.config";

interface AutocompleteOption {
  value: string; // ID olacak
  label: string; // İsim Soyisim olacak
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
      const response = await fetchData<UserResponse[]>(
        createRequestUrl(apiUrl.userUrl),
        { isActive: true }
      );

      if (response.isSuccess) {
        const formattedUsers = response.value.map((user) => ({
          value: user.id, // MultiSelect için ID olarak kullanılacak
          label: `${user.name} ${user.surname}`, // Görünen isim soyisim
        }));
        setUsers(formattedUsers);
      }
    };

    fetchUsers();
  }, []);

  const handleClearSelected = () => {
    changeSelectedIds([]);
  };

  // **Seçili olan ID'leri alıp kullanıcıların label'larını eşleştiriyoruz.**
  const selectedOptions = selectedIds.map((id) => {
    const user = users.find((u) => u.value === id);
    return user ? user.value : id; // Eğer isim bulunamazsa ID'yi koruyoruz
  });

  return (
    <MultiSelect
      placeholder={t(Dictionary.User.EXECUTIVE)}
      label={t(Dictionary.Validation.List.SELECT)}
      data={users} // Kullanıcı listesini `data` olarak sağlıyoruz
      value={selectedOptions} // Seçili ID'leri burada gösteriyoruz
      onChange={(selected) => changeSelectedIds(selected)} // Seçim değiştiğinde güncelliyoruz
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
