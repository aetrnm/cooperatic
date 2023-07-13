import { Store } from "tauri-plugin-store-api";
import { useEffect, useState } from "react";

const store = new Store(".settings.dat");

function Settings() {
  const [theme, setTheme] = useState("");

  useEffect(() => {
    const fetchTheme = async () => {
      const storedTheme: any = await store.get("theme");
      setTheme(storedTheme);
    };

    fetchTheme();
  }, []);

  const handleThemeSwitch = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    await store.set("theme", newTheme);
    await store.save();
    setTheme(newTheme);
    console.log(newTheme);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Settings</h1>
      <div className="flex items-center text-lg">
        <p className="mr-4">Dark theme:</p>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-6 w-6 accent-purple-500 cursor-pointer"
            onChange={handleThemeSwitch}
            checked={theme === "dark"}
          />
        </label>
      </div>
    </div>
  );
}

export default Settings;
