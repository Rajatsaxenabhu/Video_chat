export interface MsgScheme {
  timestamp: string;
  message: string;
  sender_ID: string;
  receiver_ID: string;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private onMessageCallback: ((message: string) => void) | null = null;
  private onOpenCallback: (() => void) | null = null;
  private onCloseCallback: (() => void) | null = null;

  constructor(url: string) {
    this.url = url;
  }

  // Connect to WebSocket
  connect(): void {
    // Check if WebSocket is already connected
    if (this.ws) {
      console.warn('WebSocket is already connected.');
      return;
    }

    // Create a new WebSocket instance and connect to the backend WebSocket server
    this.ws = new WebSocket(this.url);

    // When WebSocket is opened, execute the provided callback
    this.ws.onopen = () => {
      console.log('Connected to WebSocket');
      if (this.onOpenCallback) {
        this.onOpenCallback();
      }
    };

    // When WebSocket is closed, execute the provided callback
    this.ws.onclose = (event) => {
      console.log(`WebSocket closed: ${event.code}`);
      if (this.onCloseCallback) {
        this.onCloseCallback();
      }
    };

    // Handle WebSocket errors
    this.ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    // Handle incoming messages from the backend server
    this.ws.onmessage = (event) => {
      console.log('Received message from backendwe :', event.data);
      if (this.onMessageCallback) {
        // Pass the backend message to the onMessage handler
        this.onMessageCallback(event.data);
      }
    };
  }

  // Register onOpen callback
  onOpen(callback: () => void): void {
    this.onOpenCallback = callback;
  }

  // Register onClose callback
  onClose(callback: () => void): void {
    this.onCloseCallback = callback;
  }

  // Send message to backend WebSocket server
  sendMessage(message: MsgScheme): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      // Send a message in JSON format to the backend WebSocket server
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open');
    }
  }

  // Register a handler for incoming messages from the backend
  onMessage(callback: (message:string) => void): void {
    this.onMessageCallback = callback;
  }

  // Close the WebSocket connection
  close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
