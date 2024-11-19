from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from .manager import WebSocketManager
router = APIRouter()
from fastapi import Query
import json

from.rediss import RedisClient
r=RedisClient()
chat_app = APIRouter()

manager = WebSocketManager()
@chat_app.websocket('/chat')
async def chat(websocket: WebSocket, user_id: str):
    print('connection start')
    await manager.connect(websocket, user_id)

    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            receiver_id = message_data.get("receiver_ID")
            message = message_data.get("message")
            print(receiver_id, message)
            print(type(receiver_id), type(message))

            if receiver_id and message:
                print(manager.is_connected(receiver_id))
                if manager.is_connected(receiver_id):
                    await manager.send_message(user_id,receiver_id, message)
                r.store_message(user_id, receiver_id, message)                
            else:
                await websocket.send_text("Invalid message format.")
    
    except WebSocketDisconnect:
        await manager.disconnect(user_id)
