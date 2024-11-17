export interface UserScheme {
  sender_user_id: string;
  target_user_id:string;
  message: string;
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
    if (this.ws) {
      console.warn('WebSocket is already connected.');
      return;
    }

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('Connected to WebSocket');
      if (this.onOpenCallback) {
        this.onOpenCallback();
      }
    };

    this.ws.onclose = (event) => {
      console.log(`WebSocket closed: ${event.code}`);
      if (this.onCloseCallback) {
        this.onCloseCallback();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    this.ws.onmessage = (event) => {
      if (this.onMessageCallback) {
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

  // Send message
  sendMessage(message: UserScheme): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open');
    }
  }

  // Register a handler for incoming messages
  onMessage(callback: (message: string) => void): void {
    this.onMessageCallback = callback;
  }
  close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
