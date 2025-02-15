'use client';
import {  Provider } from "./lib/appContext";
import Main from "./main";

// wrapper for the main component with providers
export default function Home() {
  return (
    <Provider>
      <Main />
    </Provider>
  );
}
