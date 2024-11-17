from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from .manager import WebSocketManager
router = APIRouter()
from fastapi import Query
import json

chat_app = APIRouter()

manager = WebSocketManager()
@chat_app.websocket('/chat')
async def chat(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            target_user_id = message_data.get("target_user_id")
            message = message_data.get("message")
            print(target_user_id, message)

            if target_user_id and message:
                if manager.is_connected(target_user_id):
                    await manager.send_message(target_user_id, message)
                else:
                    await websocket.send_text(f"User {target_user_id} not connected.")
            else:
                await websocket.send_text("Invalid message format.")
    
    except WebSocketDisconnect:
        await manager.disconnect(user_id)
