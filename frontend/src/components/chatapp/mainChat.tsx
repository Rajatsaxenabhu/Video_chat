import React, { useState, useEffect, useRef } from 'react';
import { WebSocketService, UserScheme } from '../../hooks/websocket';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import axios from 'axios';
import UserList from './userlist';
import ChatWindow from './chatwindow';

interface User {
  id: string;
  username: string;
  is_active: boolean;
}

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const senderUserId = useSelector((state: RootState) => state.auth.sender_id);
  const wsService = useRef<WebSocketService | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Fetch user data when the component mounts
  useEffect(() => {
    const getData = async () => {
      try {
        const senderUserIdStr = String(senderUserId);
        const resp = await axios.post("http://localhost:8000/auth/detail", { id: senderUserIdStr });
        setUsers(resp.data.users);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getData();

    // Initialize WebSocket service
    wsService.current = new WebSocketService(`ws://127.0.0.1:8000/ws/chat?user_id=${senderUserId}`);
    wsService.current.connect();

    // WebSocket event handlers
    wsService.current.onMessage((message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    wsService.current.onOpen(() => {
      setIsConnected(true);
    });
    wsService.current.onClose(() => {
      setIsConnected(false);
    });

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (wsService.current) {
        wsService.current.close();
      }
    };
  }, [senderUserId]);

 
  const sendMessage = async (message: string) => {
    if (wsService.current && isConnected && targetUser) {
      const form: UserScheme = {
        sender_user_id: senderUserId,
        target_user_id: String(targetUser.id),
        message: message,
      };
      wsService.current.sendMessage(form);
      setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
    } else {
      console.error('WebSocket is not connected or no target user selected.');
      alert('Unable to send message. WebSocket is not connected or no target user selected.');
    }
  };

  const handleUserClick = (user: User) => {
    setTargetUser(user);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar with UserList */}
      <div className="w-2/4 bg-white p-4 shadow-lg rounded-l-lg">
        <UserList users={users} onSelectUser={handleUserClick} />
      </div>

      {/* Right Side - Chat Window */}
      <div className="flex-1 p-4">
        {targetUser ? (
          <ChatWindow selectedUser={targetUser.username} sendMessage={sendMessage} />
        ) : (
          <div className="text-center text-gray-500">Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
