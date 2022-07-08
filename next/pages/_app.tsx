import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "../store";

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
    if (+localStorage.isDarkTheme) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyles />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
