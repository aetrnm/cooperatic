import { useState } from "react";
import LoginForm from "./LoginForm";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onFormSubmit() {
    openMainWindow();
    await store.set("loggedInEmail", { value: email });
    await store.save();
  }

  return (
    <LoginForm
      onFormSubmit={onFormSubmit}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
    />
  );
}

export default App;
