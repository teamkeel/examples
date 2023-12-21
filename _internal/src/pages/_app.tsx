import "@/styles/globals.css";
import "react-material-symbols/rounded";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
