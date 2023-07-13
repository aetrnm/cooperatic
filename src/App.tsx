import { useState } from "react";
import SideBar from "./components/SideBar";
import "./index.css";

import Dashboard from "./screens/Dashboard";
import Notifications from "./screens/Notifications";
import Groups from "./screens/Groups";
import Events from "./screens/Events";
import Tasks from "./screens/Tasks";
import Settings from "./screens/Settings";
import Profile from "./screens/Profile";

function App() {
  const [selectedItem, setSelectedItem] = useState("Dashboard");

  const handleMenuItemClick = (item: string) => {
    setSelectedItem(item);
  };

  const renderContent = () => {
    switch (selectedItem) {
      case "Dashboard":
        return <Dashboard />;
      case "Notifications":
        return <Notifications />;
      case "Groups":
        return <Groups />;
      case "Events":
        return <Events />;
      case "Tasks":
        return <Tasks />;
      case "Settings":
        return <Settings />;
      case "Profile":
        return <Profile />;
      default:
        return <h1>Default Content</h1>;
    }
  };

  return (
    <div>
      <div className="flex h-screen">
        <SideBar
          selectedItem={selectedItem}
          onItemClick={handleMenuItemClick}
        />
        <div className="flex-grow overflow-auto bg-gray-100 border-l border-gray-200 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-300 scrollbar-thumb-rounded">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
