from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from auth.auth import auth_router
from chat.storechat import store_chat
from chat.sockets import socketio_mount
from chat.rediss import RedisClient
r=RedisClient()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:5173"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (e.g., GET, POST)
    allow_headers=["*"],  # Allows all headers
)
sio = socketio_mount(app=app,async_mode="asgi",mount_path="/socket.io/",socketio_path="socket.io",cors_allowed_origins=["*","http://localhost:5173"])# CORS middleware setup


app.include_router(auth_router,prefix="/auth")
app.include_router(store_chat,prefix="/storechat")

connected_clients = {}
   
@sio.event
async def connect(sid,environ):
    await sio.emit("message","Welcome to the server!",room=sid)

@sio.event
async def sendUserData(sid, user_id):
    print(f"Received user data from {sid}: {user_id}")
    connected_clients[str(user_id)] = sid
    print(connected_clients)

@sio.event()
async def sendMessage(user_id, message):
    print("this si the usereid and mesage ",user_id, message)
    sid = connected_clients.get(message.get("receiver_ID"))
    print("sender id",user_id,"receiver id",sid)
    if sid is not None:
        await sio.emit("message", message, room=sid)
    r.store_message(message.get("sender_ID"), message.get("receiver_ID"), message.get("message"))


@sio.event
async def disconnect(sid):
    # When a client disconnects, remove their SID from the connected clients
    if sid in connected_clients:
        del connected_clients[sid]
    print(f"Client {sid} disconnected")
    await sio.emit("message", "Goodbye! You have been disconnected.", room=sid)
