import React from "react";
import {
  IoHomeOutline,
  IoNotificationsOutline,
  IoPeopleOutline,
  IoCalendarOutline,
  IoCheckboxOutline,
  IoSettingsOutline,
  IoPersonOutline,
  IoLogoReact,
} from "react-icons/io5";

import SideBarElement from "./SideBarElement";

function SideBar(props: {
  selectedItem: string;
  onItemClick: (item: string) => void;
}) {
  const sidebarItems = [
    { name: "Dashboard", icon: <IoHomeOutline size={20} /> },
    { name: "Notifications", icon: <IoNotificationsOutline size={20} /> },
    { name: "Groups", icon: <IoPeopleOutline size={20} /> },
    { name: "Events", icon: <IoCalendarOutline size={20} /> },
    { name: "Tasks", icon: <IoCheckboxOutline size={20} /> },
    { name: "Settings", icon: <IoSettingsOutline size={20} /> },
    { name: "Profile", icon: <IoPersonOutline size={20} /> },
  ];

  return (
    <div className="w-64 bg-white flex flex-col items-center">
      <div className="p-4">
        <IoLogoReact className="text-purple-500 text-4xl" />
      </div>
      {sidebarItems.map((sidebarItem, index) => (
        <React.Fragment key={sidebarItem.name}>
          <SideBarElement
            itemName={sidebarItem.name}
            isSelected={props.selectedItem === sidebarItem.name}
            onItemClick={props.onItemClick}
            icon={sidebarItem.icon}
          />
          {index === sidebarItems.length - 3 && (
            <hr className="my-2 border-gray-300 w-4/5" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default SideBar;
