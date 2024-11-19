import React, { useState, useEffect, useRef } from 'react';
import { WebSocketService, UserScheme } from '../hooks/websocket';

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [target_user_id, setTargetUserId] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false); // Track WebSocket connection status

  const sender_user_id = useRef<string>(String(Math.floor(Math.random() * 10000) + 1)); // Store senderid in ref
  const wsService = useRef<WebSocketService | null>(null);

  // Connect WebSocket when the component mounts
  useEffect(() => {
    // Initialize WebSocketService
    wsService.current = new WebSocketService(`ws://127.0.0.1:8000/ws/chat?user_id=${sender_user_id.current}`);
    wsService.current.connect();

    // Handle incoming messages
    wsService.current.onMessage((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Handle WebSocket connection status changes
    wsService.current.onOpen(() => {
      setIsConnected(true);
    });

    wsService.current.onClose(() => {
      setIsConnected(false);
    });

    // Cleanup: WebSocket disconnects when the component unmounts
    return () => {
      if (wsService.current) {
        wsService.current.close();
      }
    };
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate message and target user ID
    if (!newMessage.trim() || !target_user_id) {
      alert('Please provide a valid message and receiver ID.');
      return;
    }

    const form: UserScheme = {
      sender_user_id: sender_user_id.current,
      target_user_id,
      message: newMessage,
    };

    // Send the message through WebSocketService
    if (wsService.current && isConnected) {
      wsService.current.sendMessage(form);
      setMessages((prevMessages) => [...prevMessages, `You: ${newMessage}`]); // Add message to local state
      setNewMessage(''); // Clear input
    } else {
      console.error('WebSocket is not connected.');

    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <div className="flex-1 overflow-auto bg-white p-4 rounded-lg shadow-lg">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className="text-sm p-2 rounded bg-gray-200">
              {message}
            </div>
          ))}
        </div>
      </div>
      <div className="flex mt-4">
        <h1>SENDER ID: {sender_user_id.current}</h1>
        <form onSubmit={sendMessage} className="flex flex-row w-full">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 rounded-l-lg border border-gray-300"
            placeholder="Type a message..."
          />
          <input
            type="text"
            value={target_user_id}
            onChange={(e) => setTargetUserId((e.target.value))}
            className="flex-1 p-2 rounded-l-lg border border-gray-300"
            placeholder="Receiver ID"
          />
          <button
            type="submit"
            className="px-4 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
            disabled={!isConnected} // Disable the send button when not connected
          >
            Send
          </button>
        </form>
        {!isConnected && <p className="text-red-500 mt-2">Disconnected from WebSocket</p>}
      </div>
    </div>
  );
};

export default ChatApp;
