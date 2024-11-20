from typing import Dict
from fastapi import WebSocket
import json
import logging
from  .rediss import RedisClient
r=RedisClient()

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}  # user_id -> WebSocket
        self.logger = logging.getLogger(__name__)
        self.redis=r

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        print("type of user_id", type(user_id))
        self.active_connections[user_id] = websocket
        print(self.active_connections)
        print(f"User {user_id} connected.")
        self.redis.set_status(f"user:{user_id}:status", "online")
        await self.broadcast_user_status(user_id, "online")

    async def disconnect(self, user_id: str):
        websocket = self.active_connections.pop(user_id, None)
        if websocket:
            await websocket.close()
        self.redis.set_status(f"user:{user_id}:status", "offline")

        # Broadcast user offline status to all connected clients
        await self.broadcast_user_status(user_id, "offline")
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            print(f"User {user_id} disconnected.")

    async def send_message(self, user_id: str,receiver_id: str, message: str):
        if receiver_id in self.active_connections:
            websocket = self.active_connections[receiver_id]
            json_data=json.dumps({ "type": "chat_message","receiver_ID":receiver_id,"message":message,"sender_ID":user_id,"timestamp":""})
            print("prepare sed ata")
            await websocket.send_text(json_data)

    def is_connected(self, user_id: str) -> bool:
        print("useris conneted",user_id in self.active_connections)
        print(type(user_id))
        return user_id in self.active_connections
    
    async def broadcast_user_status(self, user_id: str, status: str):
        """Notify all connected clients about the online/offline status of a user."""
        message = json.dumps({
            "type": "user_status",
            "username": user_id,
            "status": status
        })

        for websocket in self.active_connections.values():
            await websocket.send_text(message)

    def get_user_status(self, user_id: str) -> str:
        """Fetch user status from Redis (online/offline)."""
        return self.redis.get(f"user:{user_id}:status") or "offline"