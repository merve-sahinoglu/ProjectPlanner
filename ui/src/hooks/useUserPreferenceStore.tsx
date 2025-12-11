import { i18n } from "i18next";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import Language from "../enums/language";

export enum Theme {
  Light = "light",
  Dark = "dark",
}

interface UserPreferencesState {
  // Language
  language: Language;
  changeLanguage: (language: Language, i18n: i18n) => Promise<void>;
}

const useUserPreferences = create(
  persist<UserPreferencesState>(
    (set, get) => ({
      language: Language.Turkish,
      changeLanguage: async (lang: Language, languageSwitcher: i18n) => {
        set({ language: lang });
        await languageSwitcher.changeLanguage(lang);
      },
    }),
    {
      name: "user-preferences",
    }
  )
);

export default useUserPreferences;
