// src/userlist.tsx
import React from 'react';

interface User {
  id: string;
  username: string;
  is_active: boolean;
}

interface UserListProps {
  users: User[];
  onSelectUser: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onSelectUser }) => {
  return (
    <div className="p-4 my-4 bg-indigo-50 shadow-md rounded-lg  ">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 scrollbar-hide">Users</h2>

      {/* Handle the case when there are no users */}
      {users.length === 0 ? (
        <p className="text-center text-gray-500">No users to chat with.</p>
      ) : (
        <div className=" max-h-[500px] overflow-y-auto scrollbar-hide ">
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user.id}
                onClick={() => onSelectUser(user)} // Handle user click
                className="flex items-center cursor-pointer p-3 rounded-lg 
                hover:bg-red-400 transition duration-30 
                ease-in-out transform hover:scale-105
                hover:shadow-2xl hover:shadow-red-400
                border-2 border-red-40 radius-2xl"
              >
                {/* Display username */}
                <span className="flex-1 font-semibold text-2xl text-gray-800">{user.username}</span>
                
                {/* Display active status with a green dot */}
                {user.is_active ? (
                  <span className="w-4 h-4 rounded-full bg-green-500"></span>
                ) : (
                  <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserList;
