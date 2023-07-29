import { Store } from "tauri-plugin-store-api";
const store = new Store(".settings.dat");
import { platform } from "@tauri-apps/api/os";
const platformName = await platform();

import { useEffect, useState } from "react";

function Settings() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const fetchTheme = async () => {
      const storedTheme: any = await store.get("isDarkTheme");
      setIsDarkTheme(storedTheme);
    };

    fetchTheme();
  }, []);

  const handleThemeSwitch = async () => {
    const newTheme = !isDarkTheme;
    await store.set("isDarkTheme", newTheme);
    await store.save();
    setIsDarkTheme(newTheme);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Settings</h1>
      <div className="flex items-center text-lg">
        <p className="mr-4">Dark theme:</p>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className={`form-checkbox accent-purple-500 cursor-pointer ${
              platformName === "darwin" ? "mac-checkbox" : "h-6 w-6"
            }`}
            onChange={handleThemeSwitch}
            checked={isDarkTheme}
          />
        </label>
      </div>
    </div>
  );
}

export default Settings;
