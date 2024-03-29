import { useEffect, useState } from "react";
import Modal from "react-modal";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

import { invoke } from "@tauri-apps/api/tauri";
import { WebviewWindow, appWindow } from "@tauri-apps/api/window";
import { Store } from "tauri-plugin-store-api";
const store = new Store(".settings.dat");

function openMainWindow(): void {
  const webview = new WebviewWindow("main_window", {
    url: "index.html",
    title: "Cooperatic",
    maximized: false,
    width: 1000,
    height: 800,
    minWidth: 1000,
    minHeight: 800,
  });
  webview.once("tauri://created", async function () {
    await appWindow.close();
  });
}

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [showRegisterForm, setShowRegisterForm] = useState(true);
  const [showLoginError, setShowLoginError] = useState(false);

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  const toggleLoginForm = () => {
    setShowRegisterForm(false);
  };

  const toggleRegisterForm = () => {
    setShowRegisterForm(true);
  };

  async function onRegisterFormSubmit() {
    invoke("add_user_to_db", {
      email: email,
      name: email.split("@")[0],
      created: new Date(Date.now()).toISOString().slice(0, 10),
      password: password,
    });

    const user_id = await invoke("get_id_by_email", {
      email: email,
    });

    openMainWindow();
    await store.set("loggedInEmail", { value: email });
    await store.set("loggedInID", { value: user_id });
    await store.save();
  }

  type UserInDBResponse = "Success" | { Failure: string };

  async function onLoginFormSubmit() {
    const UserInDB: UserInDBResponse = await invoke("check_if_user_in_db", {
      email: email,
      enteredPassword: password,
    });

    const user_id = await invoke("get_id_by_email", {
      email: email,
    });

    console.log(user_id);

    if (UserInDB === "Success") {
      openMainWindow();
      await store.set("loggedInEmail", { value: email });
      await store.set("loggedInID", { value: user_id });
      await store.save();
    } else if (UserInDB.Failure) {
      setShowLoginError(true);
    }
  }

  return (
    <div>
      {showRegisterForm ? (
        <RegisterForm
          onFormSubmit={onRegisterFormSubmit}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmedPassword={confirmedPassword}
          setConfirmedPassword={setConfirmedPassword}
          onToggleLoginForm={toggleLoginForm}
        />
      ) : (
        <LoginForm
          onFormSubmit={onLoginFormSubmit}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onToggleRegisterForm={toggleRegisterForm}
        />
      )}

      <Modal
        isOpen={showLoginError}
        onRequestClose={() => setShowLoginError(false)}
        contentLabel="Login Error"
        className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-black"
        overlayClassName="fixed inset-0"
      >
        <div className="bg-white p-8 rounded-md max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center text-purple-600">
            Login error
          </h2>
          <p className="mb-4 text-center text-gray-600">
            Email or Password is wrong. Please try again.
          </p>
          <button
            onClick={() => setShowLoginError(false)}
            className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
