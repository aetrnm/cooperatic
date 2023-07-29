import { useEffect, useState } from "react";
import { Store } from "tauri-plugin-store-api";
const store = new Store(".settings.dat");

interface UserProfile {
  username: string;
  profilePicture: string;
  joinDate: string;
  joinedGroups: {
    name: string;
    image: string;
    email: string;
  }[];
}

function Profile() {
  const [username, setUsername] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [joinDate, setJoinDate] = useState<string>("");
  const [joinedGroups, setJoinedGroups] = useState<UserProfile["joinedGroups"]>(
    []
  );

  useEffect(() => {
    const fetchProfileData = async () => {
      const userProfile = await fetchUserProfile();

      const storedEmail: any = await store.get("loggedInEmail");
      setUsername(storedEmail.value);
      setProfilePicture(userProfile.profilePicture);
      setJoinDate(userProfile.joinDate);
      setJoinedGroups(userProfile.joinedGroups);
    };

    fetchProfileData();
  }, []);

  const fetchUserProfile = () => {
    return new Promise<UserProfile>((resolve) => {
      setTimeout(() => {
        const joinedGroups = Array.from({ length: 12 }, (_, index) => {
          const groupName = `Group ${String.fromCharCode(65 + index)}`;

          return {
            name: groupName,
            image: "https://fakeimg.pl/300/",
            email: "email@cooperatic.com",
          };
        });

        resolve({
          username: "Oleh",
          profilePicture: "https://fakeimg.pl/500/",
          joinDate: "July, 2023",
          joinedGroups,
        });
      }, 0);
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4 font-semibold">Profile</h1>
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden">
          <img src={profilePicture} alt="Profile" />
        </div>
        <div>
          <p className="text-lg font-medium">{username}</p>
          <p className="text-gray-500">Member since: {joinDate}</p>
        </div>
      </div>
      <div>
        <p className="text-lg font-medium mb-2">Joined Groups:</p>
        <ul className="space-y-2">
          {joinedGroups.map((group, index) => (
            <li key={group.name}>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={group.image} alt={group.name} />
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900">
                    {group.name}
                  </p>
                  <p className="text-sm text-gray-500">{group.email}</p>
                </div>
              </div>
              {index !== joinedGroups.length - 1 && (
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Profile;
