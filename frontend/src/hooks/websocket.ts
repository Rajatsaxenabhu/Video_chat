import { io, Socket } from 'socket.io-client';
export interface MsgScheme {
  message: string;
  sender_ID: string;
  receiver_ID: string;
}

// Define an interface for user status
interface UserStatusMessage {
  username: string;
  status: 'online' | 'offline';
}

export class WebSocketClient {
  private socket: Socket;

  constructor(serverUrl: string,private onMessageReceived: (msg: MsgScheme) => void) {
    this.socket = io(serverUrl,{ transports: ["websocket"] });
    this.setupListeners();
  }
  public getSocket(): Socket {
    return this.socket;
  }

  // Method to send a message
  sendMessage(msg: MsgScheme): void {
    this.socket.emit('sendMessage', msg);
  }

  // Method to send user status
  sendUserStatus(statusMessage: UserStatusMessage): void {
    this.socket.emit('userStatus', statusMessage);
  }

  // Listen for messages from the server
  private setupListeners(): void {
    // Listen for incoming messages
    this.socket.on('message', (msg: MsgScheme) => {
      console.log('Received message:', msg);
      this.onMessageReceived(msg);
    });

    // Listen for user status updates
    this.socket.on('userStatusUpdate', (status: UserStatusMessage) => {
      console.log('User status updated:', status);
    });

    // Handle connection and disconnection events

    this.socket.on('disconnect', () => {
      console.log('Disconnected from the server!');
    });
  }
}
