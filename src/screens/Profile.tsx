import { useEffect, useState } from "react";

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

      setUsername(userProfile.username);
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
            email: "email@flowbite.com",
          };
        });

        resolve({
          username: "Oleh",
          profilePicture: "https://fakeimg.pl/300/",
          joinDate: "July, 2023",
          joinedGroups,
        });
      }, 0);
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Profile</h1>
      <div className="flex items-center text-lg mb-4">
        <p className="mr-4">Username:</p>
        <p>{username}</p>
      </div>
      <div className="flex items-center text-lg mb-4">
        <p className="mr-4">Profile Picture:</p>
        <img
          src={profilePicture}
          alt="Profile"
          className="w-12 h-12 rounded-full"
        />
      </div>
      <div className="flex items-center text-lg mb-4">
        <p className="mr-4">Join Date:</p>
        <p>{joinDate}</p>
      </div>
      <div>
        <p className="text-lg">Joined Groups:</p>
        <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
          {joinedGroups.map((group) => (
            <li key={group.name} className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={group.image}
                    alt={group.name}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {group.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    {group.email}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Profile;
