import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import MyStorage from "../store";
const { store, persistor } = MyStorage();
import { setAuthToken, setGoogleAuth } from "../utils/setAuthToken";
import Layout from "../components/layout/layout";

import "../styles/common.css";
import "../styles/theme/App.css";
import "../styles/myown.css";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../themeConfig";

import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS

function MyApp({ Component, pageProps }: AppProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const token = localStorage.token || localStorage.userid;
    if (token) setAuthToken(token);

    if (+localStorage.isDarkTheme) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <ThemeProvider theme={isDark ? darkTheme : lightTheme}> */}
        {/* <GlobalStyles /> */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
        {/* </ThemeProvider> */}
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
