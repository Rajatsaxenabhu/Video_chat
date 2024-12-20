import React from "react";

interface User {
  id: string;
  username: string;
  images: string;
  is_active: boolean; // Assuming each user has a profile picture URL
}

interface UserListProps {
  users: User[];
  onSelectUser: (user: User) => void;
  getUserStatus: (userId: string) => string;
}

const UserList: React.FC<UserListProps> = ({ users, onSelectUser, getUserStatus }) => {
  return (
    <div className="p-2 my-4  shadow-md rounded-">
      {/* the owner iamge */}
      {/* Handle the case when there are no users */}
      {users.length === 0 ? (
        <p className="text-center text-gray-500">No users to chat with.</p>
      ) : (
        <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user.id}
                onClick={() => onSelectUser(user)} // Handle user click
                className="flex bg-gray-800 items-center cursor-pointer p-3 rounded-lg  hover:bg-gray-900 text-gray-800"
              >
                {/* User profile picture */}
                <div className="relative">
                  <img
                    src={user.images || "./src/assets/no.jpg"} // Default fallback avatar
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>

                {/* Display username */}
                <div className=" ml-8  flex-1 text-left">
                  <div className="font-medium text-lg text-white">{user.username}</div>
                  <p
                    className={`text-sm ${
                      getUserStatus(user.id) === "online" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {/* <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        getUserStatus(user.id) === "online" ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span> */}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserList;
