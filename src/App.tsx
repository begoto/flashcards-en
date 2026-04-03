import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { AuthProvider } from "./context/AuthContext";
import { FlashcardsProvider } from "./context/FlashcardsContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SettingsProvider } from "./context/SettingsContext";
import { BadgeToast } from "./components/feature/BadgeToast";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <SettingsProvider>
          <AuthProvider>
            <FlashcardsProvider>
              <BrowserRouter basename={__BASE_PATH__}>
                <AppRoutes />
                <BadgeToast />
              </BrowserRouter>
            </FlashcardsProvider>
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;

