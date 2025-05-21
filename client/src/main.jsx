import { StrictMode } from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store, { persistor } from "./Store/index.js";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./Theme";
import { PersistGate } from "redux-persist/integration/react";

// A wrapper to connect theme from Redux
function ThemedApp() {
  const mode = useSelector((state) => state.theme.mode);
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemedApp />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
