import { MantineProvider } from "@mantine/core";
import { MantineEmotionProvider } from "@mantine/emotion";
import { ModalsProvider } from "@mantine/modals";
import "@mantine/tiptap/styles.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import AppRouter from "./AppRouter";
import { mantineTheme } from "./assets/theme";
import { AuthenticationProvider } from "./authentication/AuthenticationContext";
import useUserPreferences from "./hooks/useUserPreferenceStore";
import queryClient from "./services/query-client";

function App() {
  const { i18n } = useTranslation();
  const language = useUserPreferences((state) => state.language);

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return (
    <AuthenticationProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <MantineProvider theme={mantineTheme}>
        <MantineEmotionProvider>
          <QueryClientProvider client={queryClient}>
            <ModalsProvider>
              <AppRouter />
            </ModalsProvider>
          </QueryClientProvider>
        </MantineEmotionProvider>
      </MantineProvider>
    </AuthenticationProvider>
  );
}

export default App;
