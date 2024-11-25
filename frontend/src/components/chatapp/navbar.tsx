import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slice/authslice';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import UploadApp from '../../hooks/cloudnary';

interface NavProps {
  user_id: string;
}

const Navbar: React.FC<NavProps> = ({ user_id }) => {
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.auth.sender_name);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev); // Toggle modal visibility
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 py-7 flex justify-between items-center text-white sticky top-0 z-10 md:px-12">
        {/* Left Section - Logo or Title */}
        <div className="flex items-center space-x-2 ">
          <span className='text-3xl font-bold '>ChatX</span>
        </div>

        {/* Center Section - Username */}
        <div className="flex items-center space-x-4 md:space-x-8">
          <span className="text-lg font-medium">{username}</span>
          <div className="flex space-x-4">
            {/* Settings Button */}
            <button
              onClick={toggleModal} // Trigger modal on click
              className="hover:bg-purple-700 rounded-full p-2 transition duration-300"
            >
              <FaCog /> {/* Settings icon */}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="hover:bg-red-700 rounded-full p-2 transition duration-300"
            >
              <FaSignOutAlt /> {/* Logout icon */}
            </button>
          </div>
        </div>
      </nav>

      {/* Modal for Upload App */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <button
              onClick={toggleModal} // Close modal
              className="absolute top-2 right-2 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-xl mb-4">Upload Your Image</h2>
            console.log(user_id)
            <UploadApp user_id={user_id} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;