import React, { useState, useEffect, useRef } from 'react';
import { useSelector, } from 'react-redux';
import { RootState } from '../../redux/store';
import axios from 'axios';
import UserList from './userlist';
import ChatWindow from './chatwindow';
import Navbar from './navbar';
import { WebSocketClient, MsgScheme } from '../../hooks/websocket';

interface User {
  id: string;
  username: string;
  is_active: boolean;
  images: string;
}

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<MsgScheme[]>([]);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const senderUserId: string = useSelector((state: RootState) => state.auth.sender_id);
  const [users, setUsers] = useState<User[]>([]);
  const [userStatus, setUserStatus] = useState<{ [key: string]: string }>({});
  
  // WebSocket client initialization
  const wsClient = useRef<WebSocketClient | null>(null);
  let socket = wsClient.current?.getSocket();
  const handleIncomingMessage = (msg: MsgScheme) => {
    setMessages((prevMessages) => [...prevMessages, msg]);
    console.log("New message received:", msg);
  };

  useEffect(() => {
    // Fetch initial user data
    const getData = async () => {
      try {
        const senderUserIdStr = String(senderUserId);
        const resp = await axios.post("http://localhost:8000/auth/detail", { id: senderUserIdStr });
        console.log(resp.data)
        setUsers(resp.data.users);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getData();
    if (!wsClient.current) {
    wsClient.current = new WebSocketClient('http://localhost:8000/', handleIncomingMessage);
    socket = wsClient.current.getSocket();
    socket.on('connect', () => {
      setIsConnected(true);
      socket?.emit('sendUserData',String(senderUserId));
      console.log('Connected to WebSocket server');
    });
  }
  return () => {
    wsClient.current?.getSocket().disconnect();
    wsClient.current = null;
  };
    //
  }, []);

  // Handle user click to set target user
  const handleUserClick = (user: User) => {
    setTargetUser(user);
  };

  // Get user status (Online or Offline)
  const getUserStatus = (username: string): string => {
    return userStatus[username] || 'Offline';
  };

  // Send message to the server
  const sendMessage = (message: string) => {
    console.log("touch",targetUser)
    if (targetUser) {
      const msg: MsgScheme = {
        message,
        sender_ID: String(senderUserId),
        receiver_ID: String(targetUser.id),
      };
      wsClient.current?.sendMessage(msg);
    }
  };


  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar user_id={String(senderUserId)}/>
      <div className="flex h-full">
        {/* Left Side - User List */}
        <div className="w-1/3  p-4 shadow-lg rounded-l-lg overflow-y-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Users</h2>
          <UserList
            users={users}
            onSelectUser={handleUserClick}
            getUserStatus={getUserStatus}
          />
        </div>
    
        {/* Right Side - Chat Window */}
        <div className="flex-1  bg-gray-100 rounded-r-lg overflow-hidden"
        style={{ backgroundImage: "url('./src/assets/chat_bg.jpg')" }}>
          {targetUser ? (
            <ChatWindow
              selectedUser={targetUser.username}
              selectedUser_id={String(senderUserId)}
              target_id={String(targetUser.id)}
              messages={messages}
              setMessages={setMessages}
              sendMessage={sendMessage}
            />
          ) : (
            <div className="text-center text-gray-500 p-4 font-semibold">Select a user to start chatting</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
