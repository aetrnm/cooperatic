import React, { useState, useEffect, ChangeEvent } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Store } from "tauri-plugin-store-api";

const store = new Store(".settings.dat");

function Groups() {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [groupCode, setGroupCode] = useState<string>("");
  const [groupName, setGroupName] = useState<string>("");
  const [userGroups, setUserGroups] = useState<number[]>([]);

  const handlePopupToggle = () => {
    setShowPopup((prevState) => !prevState);
  };

  const handleJoinGroup = () => {
    console.log("Join group button clicked with code:", groupCode);
  };

  const handleCreateGroup = async () => {
    const storedEmail: any = await store.get("loggedInEmail");

    invoke<number[]>("add_group_to_db", {
      name: groupName,
      created: new Date(Date.now()).toISOString().slice(0, 10),
      ownerEmail: storedEmail.value,
    });

    console.log("Created group with name:", groupName);

    setGroupCode("");
    setGroupName("");
    setShowPopup(false);

    window.location.reload();
  };

  const handleClosePopup = () => {
    setGroupCode("");
    setGroupName("");
    setShowPopup(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value.toUpperCase().slice(0, 6);
    const filteredText = inputText.replace(/[^A-Z0-9]/g, "");
    setGroupCode(filteredText);
  };

  const handleGroupNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };

  const fetchUserGroups = async () => {
    try {
      const storedID: any = await store.get("loggedInID");
      const response = await invoke<number[]>("get_groups_by_user_id", {
        userId: parseInt(storedID.value, 10),
      });

      setUserGroups(response);

      if (!response || response.length === 0) {
        setUserGroups([]);
      } else {
        console.error("Failed to fetch user groups!");
      }
    } catch (error) {
      console.error("An error occurred while fetching user groups!");
    }
  };

  useEffect(() => {
    fetchUserGroups();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Groups</h1>
      <button
        className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-colors duration-300"
        onClick={handlePopupToggle}
      >
        Join or Create a Group
      </button>
      <hr className="my-2 border-gray-300 w-100" />

      <div className="grid grid-cols-2 gap-4">
        {userGroups.map((group, index) => (
          <div key={index} className="w-full">
            <div className="bg-white border rounded-md p-4 hover:cursor-pointer hover:bg-gray-200 transition-colors duration-100">
              Group {group}
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md p-4 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={handleClosePopup}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">Choose an Option</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-4 flex flex-col justify-center items-center">
                <h3 className="text-lg font-semibold mb-2">
                  Join a group with a code
                </h3>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-500"
                  placeholder="Enter code"
                  value={groupCode}
                  onChange={handleInputChange}
                  maxLength={6}
                />
                <button
                  className="bg-purple-500 text-white py-2 px-4 rounded-md mt-4 hover-bg-purple-600 transition-colors duration-300 w-full"
                  onClick={handleJoinGroup}
                >
                  Join group
                </button>
              </div>

              <div className="border rounded-md p-4 flex flex-col justify-center items-center">
                <h3 className="text-lg font-semibold mb-2">
                  Create your group
                </h3>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-500"
                  placeholder="Group name"
                  value={groupName}
                  onChange={handleGroupNameChange}
                />
                <button
                  className="bg-purple-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-purple-600 transition-colors duration-300 w-full"
                  onClick={handleCreateGroup}
                >
                  Create group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Groups;
