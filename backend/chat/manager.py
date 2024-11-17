from typing import Dict
from fastapi import WebSocket

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}  # user_id -> WebSocket

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        print(f"User {user_id} connected.")

    async def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            print(f"User {user_id} disconnected.")

    async def send_message(self, user_id: str, message: str):
        """Send message to a specific user."""
        websocket = self.active_connections.get(user_id)
        if websocket:
            await websocket.send_text(message)
        else:
            raise ValueError(f"User {user_id} is not connected.")

    def is_connected(self, user_id: str) -> bool:
        """Check if a user is currently connected."""
        return user_id in self.active_connections

# WebSocket endpoint example