from typing import Dict
from fastapi import WebSocket
import json

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}  # user_id -> WebSocket

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        print("type of user_id", type(user_id))
        self.active_connections[user_id] = websocket
        print(self.active_connections)
        print(f"User {user_id} connected.")

    async def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            print(f"User {user_id} disconnected.")

    async def send_message(self, user_id: str,receiver_id: str, message: str):
        """Send message to a specific user."""
        websocket = self.active_connections.get(receiver_id)
        if websocket:
            json_data=json.dumps({"receiver_ID":receiver_id,"message":message,"sender_ID":user_id,"timestamp":""})
            print("prepare sed ata")
            await websocket.send_text(json_data)
        else:
            raise ValueError(f"User {user_id} is not connected.")

    def is_connected(self, user_id: str) -> bool:
        print("useris conneted",user_id in self.active_connections)
        print(type(user_id))
        return user_id in self.active_connections