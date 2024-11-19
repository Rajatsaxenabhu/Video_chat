import React, { useState, useEffect, useRef } from 'react';
import { WebSocketService, MsgScheme } from '../../hooks/websocket';
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
  const [newMessage, setNewMessage] = useState<MsgScheme>({ receiver_ID: '' ,timestamp: '', message: '', sender_ID: '', });
  const [messages, setMessages] = useState<MsgScheme[]>([]);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const senderUserId: string = useSelector((state: RootState) => state.auth.sender_id);
  const wsService = useRef<WebSocketService | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        // this is for the side bar 
        let senderUserIdStr = String(senderUserId);
        const resp = await axios.post("http://localhost:8000/auth/detail", { id: senderUserIdStr });
        setUsers(resp.data.users);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getData();

    // WebSocket connection
    let senderUserIdStr = String(senderUserId);
    wsService.current = new WebSocketService(`ws://127.0.0.1:8000/ws/chat?user_id=${senderUserIdStr}`);
    wsService.current.connect();

    // WebSocket event handlers
    wsService.current.onMessage((message: string) => {
      try {
        const parsedMessage: MsgScheme= JSON.parse(message);
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, parsedMessage];
          console.log(updatedMessages); 
          return updatedMessages;
        });
        //update the message
        console.log(messages)
      } catch (err) {
        console.error('Failed to parse message:', err);
      }
    });

    wsService.current.onOpen(() => {
      setIsConnected(true);
    });

    wsService.current.onClose(() => {
      setIsConnected(false);
    });

    return () => {
      if (wsService.current) {
        wsService.current.close();
      }
    };
  }, [senderUserId]);

  const sendMessage = (message: string) => {
    if (wsService.current && targetUser) {
      const form: MsgScheme = {
        timestamp: '',
        message: message,
        sender_ID: String(senderUserId),
        receiver_ID: String(targetUser.id),
      };
      try {
        setMessages((prevMessages) => [...prevMessages, form]);
        wsService.current.sendMessage(form);
        console.log("sending message to websocket ",form);
        console.log("update message to render ",messages);
      } catch (err) {
        console.error('Error sending message:', err);
      }
      setNewMessage({ timestamp: '', message: '', sender_ID: '', receiver_ID: '' }); // Clear input field
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
          <ChatWindow
            selectedUser={targetUser.username}
            selectedUser_id={String(senderUserId)}
            target_id={String(targetUser.id)}
            messages={messages}
            setMessages={setMessages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
          />
        ) : (
          <div className="text-center text-gray-500">Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
