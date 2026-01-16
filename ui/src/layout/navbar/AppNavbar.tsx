import { ScrollArea } from "@mantine/core";
import {
  IconCalendarStats,
  IconHome2,
  IconNotebook,
  IconSettings,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthenticationContext } from "../../authentication/AuthenticationContext";
import { useCredentialActions } from "../../authentication/store/useCredentialsStore";
import routes from "../../constants/routes";
import Dictionary from "../../helpers/translation/dictionary/dictionary";
import { LinksGroup } from "./LinksGroup";
import classes from "./Navbar.module.css";

export function AppNavbar() {
  const { t, i18n } = useTranslation();
  const [activeParent, setActiveParent] = useState<string>(
    t(Dictionary.Navbar.MY_PAGE)
  );
  const [activePath, setActivePath] = useState<string>("");
  const auth = useAuthenticationContext();
  const navigate = useNavigate();
  const { checkIfUserHasFunctionAuthorization } = useCredentialActions();

  const handleMenuItemSelect = (parentLabel: string) => {
    setActiveParent(parentLabel);
  };

  const handleActiveLink = (path: string, additionalInfo?: string) => {
    const finalPath = additionalInfo ? `${path}/${additionalInfo}` : path;
    setActivePath(finalPath);
    navigate(finalPath);
  };

  const data = useMemo(
    () => [
      {
        icon: IconHome2,
        label: t(Dictionary.Navbar.MY_PAGE),
        initiallyOpened: true,
        links: [
          {
            label: t(Dictionary.Navbar.MY_PROFILE),
            link: routes.profile,
          },
          {
            label: t(Dictionary.Navbar.MY_NOTES),
            link: routes.notes,
            additionalInfo: auth?.currentUser?.userId,
          },
          {
            label: t(Dictionary.Navbar.MY_APPOINTMENT),
            link: routes.appointment,
            additionalInfo: auth?.currentUser?.userId,
          },
        ],
      },
      {
        icon: IconCalendarStats,
        label: t(Dictionary.Navbar.APPOINTMENT),
        link: routes.appointment,
        hidden: !checkIfUserHasFunctionAuthorization("Randevu"),
      },
      {
        icon: IconNotebook,
        label: t(Dictionary.Navbar.NOTE),
        link: routes.notes,
        hidden: !checkIfUserHasFunctionAuthorization("Not"),
      },
      {
        icon: IconSettings,
        label: t(Dictionary.Navbar.SETTINGS),
        hidden: !checkIfUserHasFunctionAuthorization("Ayarlar"),
        links: [
          { label: t(Dictionary.Navbar.USER), link: routes.user },
          { label: t(Dictionary.Navbar.USER_RELATION), link: routes.userRelation },
          { label: t(Dictionary.Navbar.ROOM), link: routes.room },
          { label: t(Dictionary.Navbar.PLAY_GROUPS), link: routes.playGroups },
        ],
      },
    ],
    [auth?.currentUser?.userId, i18n.language]
  );

  return (
    <nav className={classes.navbar}>
      <ScrollArea className={classes.links} type="auto" scrollbarSize={8}>
        <div className={classes.linksInner}>
          {data.map((item) => (
            <LinksGroup
              key={item.label}
              {...item}
              hidden={item.hidden || false}
              activeParent={activeParent}
              activePath={activePath}
              handleActiveLink={handleActiveLink}
              handleMenuItemSelect={handleMenuItemSelect}
            />
          ))}
        </div>
      </ScrollArea>
    </nav>
  );
}

export default AppNavbar;
