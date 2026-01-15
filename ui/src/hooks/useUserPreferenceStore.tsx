import { i18n } from "i18next";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import Language from "@enums/language";

enum UserInterfaceType {
  Classic = 0,
  Flow = 1,
}

enum Theme {
  Light = "light",
  Dark = "dark",
}

interface UserPreferencesState {
  // Language
  language: Language;
  changeLanguage: (language: Language, i18n: i18n) => void;

  // User Interface
  userInterface: UserInterfaceType;
  changeUserInterface: (uiType?: UserInterfaceType) => void;

  // Theme
  colorScheme: "dark" | "light";
  toggleColorScheme: () => void;
}

const useUserPreferences = create(
  persist<UserPreferencesState>(
    (set, get) => ({
      language: Language.Turkish,
      userInterface: UserInterfaceType.Flow,
      colorScheme: Theme.Light,
      changeLanguage: (lang: Language, languageSwitcher: i18n) => {
        set({ language: lang });
        languageSwitcher.changeLanguage(lang);
      },
      changeUserInterface: (uiType?: UserInterfaceType) => {
        set({
          userInterface:
            uiType ||
            (get().userInterface === UserInterfaceType.Flow
              ? UserInterfaceType.Classic
              : UserInterfaceType.Flow),
        });
      },
      toggleColorScheme: () => {
        const scheme =
          get().colorScheme === Theme.Light ? Theme.Dark : Theme.Light;

        set({ colorScheme: scheme });
      },
    }),
    {
      name: "user-preferences",
    }
  )
);

export default useUserPreferences;
