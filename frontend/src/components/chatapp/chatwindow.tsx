import React, { useEffect, useState, useRef } from 'react';
import { FaVideo, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import { MsgScheme } from '../../hooks/websocket';

interface ChatWindowProps {
  selectedUser: string;
  selectedUser_id: string;
  target_id: string;
  messages: MsgScheme[];
  setMessages: React.Dispatch<React.SetStateAction<MsgScheme[]>>;
  sendMessage: (message: string) => void;
  sender_image:string;
  receiver_image:string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedUser,sender_image,receiver_image, selectedUser_id, target_id, messages, setMessages, sendMessage }) => {
  const [newChatMessage, setNewChatMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Reference for auto-scrolling

  // Function to send the message
  const handleSendMessage = () => {
    if (!newChatMessage) { return; }
    sendMessage(newChatMessage);
    setMessages((prevMessages) => [...prevMessages, { message: newChatMessage, sender_ID: selectedUser_id, receiver_ID: target_id }]);
    setNewChatMessage(''); // Clear input field after sending
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

  // Scroll to bottom whenever the messages array changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="h-full w-full mx-auto rounded-lg shadow-xl overflow-hidden flex flex-col  bg-gray-900  "> {/* Background gradient */}
      {/* Top bar for chat title */}
      <div className="p-6 overflow-hidden bg-opacity-90  text-white "> {/* Gradient for top bar */}
        <div className="relative flex items-center gap-4 space-x-2 text-gray-800 text-lg text-white">
          <img
            src={receiver_image || "./src/assets/no.jpg"} // Default fallback avatar
            alt="upload image"
            className="w-12 h-12 rounded-full object-cover"
          />
          {selectedUser && <span className="ml-2">{selectedUser}</span>}
        </div>
      </div>

      {/* Main chat content */}
      <div className="flex-1 overflow-auto bg-opacity-75 border-t-2 border-gray-200 flex flex-col-reverse"
        > {/* Background for messages area */}
        <div className="space-y-3 mr-10">
          {/* Display messages */}
          {messages.map((msgg, index) => {
            const isUserMessage = msgg.sender_ID === selectedUser_id;
            return (
              <div key={index} className={`chat ${isUserMessage ? 'chat-end' : 'chat-start'} ml-4`}>
                <div className="chat-image avatar">
                  <div className="w-12 rounded-full">
                    {/* Assuming the user has a default avatar; this can be dynamic */}
                    <img
                      alt="User Avatar"
                      src={isUserMessage ?sender_image :receiver_image}
                    />
                  </div>
                </div>

                <div className={`chat-bubble ${isUserMessage ? 'bg-gray-300 font-semibold  text-gray-800' : 'gradient-to-r from-blue-700 to-indigo-000'}`}>{msgg.message}</div> {/* Chat bubble background */}
              </div>
            );
          })}
        </div>

        {/* Reference to scroll to the bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input and buttons */}
      <div className="p-4 border-t-2 border-white flex items-center space-x-6 bg-gray-900 mr-20"> {/* Background for input area */}
        <input
          type="text"
          value={newChatMessage}
          onChange={(e) => setNewChatMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message"
          className="flex-1 p-3 rounded-lg border border-gray-800 bg-gray-800 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all "
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <FaPaperPlane />
        </button>
        <button
          className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
        >
          <FaVideo />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
