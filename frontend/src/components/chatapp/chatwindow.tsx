import React, { useEffect, useState } from 'react';
import { FaVideo, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import { MsgScheme } from '../../hooks/websocket';

interface ChatWindowProps {
  selectedUser: string;
  selectedUser_id: string;
  target_id: string;
  messages: MsgScheme[];
  setMessages: React.Dispatch<React.SetStateAction<MsgScheme[]>>;
  newMessage: MsgScheme;
  setNewMessage: React.Dispatch<React.SetStateAction<MsgScheme>>;
  sendMessage: (message: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedUser, selectedUser_id, target_id, messages, setMessages, newMessage, setNewMessage, sendMessage }) => {
  const [preMessage, setPreMessage] = useState<MsgScheme[]>([]);
  const [newChatMessage,setNewChatMessage] = useState<string>('');

  // Function to send the message
  const handleSendMessage = () => {
    sendMessage(newChatMessage);
    setNewChatMessage('');
    // Clear input field after sending
  };

  // Fetch previous messages on initial load
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.post('http://localhost:8000/storechat', {
          sender_id: String(selectedUser_id),
          receiver_id: String(target_id),
        });
        console.log(response.data);
        setMessages(response.data);  // Set the initial messages
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    getData();
  }, [target_id, selectedUser_id]);
  //data cominf to here from abcekdn redis
  console.log('first prev msg', messages);

  return (
    <div className="h-full w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      <div className="p-4 border-b-2 border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">
          Chat with {selectedUser}
        </h2>
      </div>
      <div className="flex-1 p-4 overflow-auto bg-gray-50">
        <div className="space-y-4">
          {/* Display messages */}
          {messages.map((msgg, index) => {
            const isUserMessage = msgg.sender_ID === selectedUser_id;
            return (
              <div key={index} className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs p-3 rounded-lg ${isUserMessage ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}
                >
                  {msgg.message}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Input and buttons */}
      <div className="p-4 border-t-2 border-gray-200 flex items-center space-x-4">
        <input
          type="text"
          value={newChatMessage}
          onChange={(e) => setNewChatMessage(e.target.value)}
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
