// import '../styles/globals.css'
import "../styles/common.css";
import "../styles/theme/App.css";
import "../styles/myown.css";
import type { AppProps } from "next/app";

import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
