import { Avatar, Divider, Group, Menu, Select } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthenticationContext } from "../../authentication/AuthenticationContext";
import Language from "../../enums/language";
import Dictionary from "../../helpers/translation/dictionary/dictionary";
import useUserPreferences from "../../hooks/useUserPreferenceStore";

function UserProfileDropdown() {
  const { t, i18n } = useTranslation();

  const languages = [
    {
      label: t(Dictionary.General.ENGLISH),
      value: Language.English,
    },
    {
      label: t(Dictionary.General.TURKISH),
      value: Language.Turkish,
    },
  ];

  const [showMenu, setShowMenu] = useState<boolean>(false);

  const auth = useAuthenticationContext();

  const language = useUserPreferences((state) => state.language);

  const changeLanguage = useUserPreferences((state) => state.changeLanguage);

  const navigate = useNavigate();

  const handleLogout = (event: React.MouseEvent) => {
    event.preventDefault();
    auth.logoutUser();
    navigate("/login");
  };
  const avatarName =
    auth !== null
      ? `${auth.currentUser?.name.charAt(0)}${auth.currentUser?.surname.charAt(
          0
        )}`
      : "";

  return (
    <Group>
      <Menu
        withArrow
        opened={showMenu}
        onChange={setShowMenu}
        closeOnItemClick={false}
      >
        <Menu.Target>
          <Avatar radius="xl">{avatarName}</Avatar>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>
            <Menu.Label>{t(Dictionary.User.LANGUAGE)}</Menu.Label>
            <Select
              allowDeselect={false}
              value={language}
              data={languages}
              onChange={async (selectedLanguage) =>
                await changeLanguage(selectedLanguage as Language, i18n)
              }
            />
          </Menu.Item>
          <Divider m={5} />
          <Menu.Item onClick={(event) => handleLogout(event)} color="red">
            {t(Dictionary.User.LOGOUT)}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}

export default UserProfileDropdown;
