import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slice/authslice'; // Your logout action
import { FaCog, FaSignOutAlt } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.auth.sender_name); // Assuming username is in the state
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action (adjust depending on your redux setup)
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
      {/* Left Section - Logo or Title */}
      <div className="text-lg font-bold">
        <span className="text-white">ChatApp</span>
      </div>

      {/* Center Section - Username */}
      <div className="flex items-center space-x-4">
        <span className="text-lg font-medium">{username}</span>
        <div className="flex space-x-4">
          {/* Settings Button */}
          <button
            onClick={() => alert('Settings clicked!')} // Replace with actual settings page/modal
            className="hover:bg-purple-500 rounded-full p-2 transition duration-300"
          >
            <FaCog /> {/* Settings icon */}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="hover:bg-red-500 rounded-full p-2 transition duration-300"
          >
            <FaSignOutAlt /> {/* Logout icon */}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
