import {
  Avatar,
  Burger,
  Group,
  Text
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import KIDS_IMG from "../../assets/images.jpeg";
import Dictionary from "../../helpers/translation/dictionary/dictionary";
import classes from "./AppHeader.module.css";
import UserProfileDropdown from "./UserProfileDropdown";

interface HeaderMenuProps {
  mobileOpened: boolean;
  desktopOpened: boolean;
  toggleMobile: () => void;
  toggleDesktop: () => void;
}

export function AppHeader({
  mobileOpened,
  desktopOpened,
  toggleMobile,
  toggleDesktop,
}: HeaderMenuProps) {
  const { t } = useTranslation();
  return (
    <header className={classes.header}>
      <div className={classes.ribbon} />
      <div className={classes.bar}>
          <div className={classes.inner}>
            {/* SOL BLOK: margin-right:auto ile SOLA YAPIŞIK */}
            <div className={classes.left}>
              <Group gap="xs">
                <Burger
                  opened={mobileOpened}
                  onClick={toggleMobile}
                   hiddenFrom="sm"
                  size="sm"
                  aria-label={t(Dictionary.Header.OPEN_MOBILE_NAV)}
                />
                <Burger
                  opened={desktopOpened}
                  onClick={toggleDesktop}
                  visibleFrom="sm"
                  size="sm"
                  aria-label={t(Dictionary.Header.TOGGLE_SIDEBAR)}
                />
              </Group>

              <div className={classes.brand}>
                <div className={classes.logoWrap}>
                  <Avatar
                    src={KIDS_IMG}
                    size={36}
                    radius="xl"
                    alt={t(Dictionary.Header.LOGO_ALT)}
                    className={classes.logoAvatar}
                  />
                </div>

                <div className={classes.brandText}>
                  <Group gap={6}>
                    <Text fw={900} className={classes.title}>
                      {t(Dictionary.Header.APP_TITLE)}
                    </Text>
                  </Group>
                </div>
              </div>
            </div>

            {/* SAĞ BLOK */}
            <Group gap="xs" wrap="nowrap" className={classes.right}>
              <UserProfileDropdown />
            </Group>
          </div>
      </div>
    </header>
  );
}

export default AppHeader;
