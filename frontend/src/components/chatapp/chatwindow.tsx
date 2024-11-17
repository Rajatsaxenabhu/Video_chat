import React, { useState } from 'react';
import { FaVideo, FaPaperPlane } from 'react-icons/fa';

interface ChatWindowProps {
  selectedUser: string; // The selected user's name
  sendMessage: (message: string) => void; // The sendMessage function passed from ChatApp
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedUser, sendMessage }) => {
  const [newMessage, setNewMessage] = useState<string>('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage); 
      setNewMessage(''); // Clear the input field
    }
  };

  return (
    <div className="h-full w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      <div className="p-4 border-b-2 border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">Chat with {selectedUser}</h2>
      </div>
      <div className="flex-1 p-4 overflow-auto bg-gray-50">
        <div className="space-y-4">
          {/* Chat messages */}
          {/* Here, you can render your messages */}
        </div>
      </div>
      {/* Input and buttons */}
      <div className="p-4 border-t-2 border-gray-200 flex items-center space-x-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message"
          className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaPaperPlane />
        </button>
        <button
          className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <FaVideo />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
