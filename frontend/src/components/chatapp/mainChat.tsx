import React, { useState, useEffect, useRef } from 'react';
import { WebSocketService, MsgScheme, UserStatusMessage } from '../../hooks/websocket';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import axios from 'axios';
import UserList from './userlist';
import ChatWindow from './chatwindow';
import Navbar from './navbar';

interface User {
  id: string;
  username: string;
  is_active: boolean;
  profilePic: string;
}

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<MsgScheme[]>([]);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const senderUserId: string = useSelector((state: RootState) => state.auth.sender_id);
  const wsService = useRef<WebSocketService | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userStatus, setUserStatus] = useState<{ [key: string]: string }>({});

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

    // Initialize WebSocket connection
    const senderUserIdStr = String(senderUserId);
    wsService.current = new WebSocketService(`ws://127.0.0.1:8000/ws/chat?user_id=${senderUserIdStr}`);
    wsService.current.connect();

  // Send user status on WebSocket open
    wsService.current.onOpen(() => {
      console.log('WebSocket connection established.');
      setIsConnected(true);
    });
    //listen the offline and online 

    wsService.current.onUserStatusChange((status: UserStatusMessage) => {
      setUserStatus(prevStatus => ({
        ...prevStatus,
        [status.username]: status.status,
      }));
    });

   
   

    // Handle incoming messages
    wsService.current.onMessage((message: string) => {
      try {
        const parsedMessage: MsgScheme = JSON.parse(message);
        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
      } catch (err) {
        console.error('Failed to parse message:', err);
      }
    });

    // Handle WebSocket close
    wsService.current.onClose(() => {
      console.log('WebSocket connection closed.');
      setIsConnected(false);
    });

    // Cleanup WebSocket on unmount
    return () => {
      if (wsService.current) {
        wsService.current.close();
      }
    };
  }, [senderUserId]);

  const sendMessage = (message: string) => {
    if (wsService.current && targetUser) {
      const timestamp = new Date().toISOString(); // Generate timestamp
      const form: MsgScheme = {
        timestamp: timestamp,
        message: message,
        sender_ID: String(senderUserId),
        receiver_ID: String(targetUser.id),
      };

      // Optimistically update the message list
      setMessages((prevMessages) => [...prevMessages, form]);

      try {
        wsService.current.sendMessage(form);
        console.log("Sending message to WebSocket", form);
      } catch (err) {
        console.error('Error sending message:', err);
        setTimeout(wsService.current.connect(), 5000); // Retry after 5 seconds
      }
    }
  };

  const handleUserClick = (user: User) => {
    setTargetUser(user);
  };

  const getUserStatus = (username: string): string => {
    return userStatus[username] || 'Offline';
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
    <Navbar />
    <div className="flex h-full bg-gradient-to-r from-indigo-500 to-purple-600">
      {/* Left Side - User List */}
      <div className="w-1/3 bg-white p-4 shadow-lg rounded-l-lg overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">All user</h2>
        <UserList
          users={users}
          onSelectUser={handleUserClick}
          getUserStatus={getUserStatus}
        />
      </div>
  
      {/* Right Side - Chat Window */}
      <div className="flex-1 p-6 bg-gray-100 rounded-r-lg overflow-hidden">
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
          <div className="text-center text-gray-500">Select a user to start chatting</div>
        )}
      </div>
    </div>
  </div>
  
  );
};

export default ChatApp;
