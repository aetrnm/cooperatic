import { useState } from "react";
import Login from "./Login";

import { WebviewWindow, appWindow } from "@tauri-apps/api/window";
import { Store } from "tauri-plugin-store-api";
const store = new Store(".settings.dat");

function openMainWindow(): void {
  const webview = new WebviewWindow("main_window", {
    url: "index.html",
    title: "Cooperatic",
    maximized: true,
  });
  webview.once("tauri://created", async function () {
    await appWindow.close();
  });
}

function App() {
  const [email, setEmail] = useState("asdsdas@adasd.ads");
  const [password, setPassword] = useState("21231213");

  async function onFormSubmit() {
    openMainWindow();
    await store.set("loggedInEmail", { value: email });
    await store.save();
  }

  return (
    <Login
      onFormSubmit={onFormSubmit}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
    />
  );
}

export default App;
