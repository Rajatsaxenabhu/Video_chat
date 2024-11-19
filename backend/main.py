from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from chat.websocket import chat_app  # Assuming chat is the WebSocket handler
from auth.auth import auth_router
from chat.storechat import store_chat
app = FastAPI()

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (e.g., GET, POST)
    allow_headers=["*"],  # Allows all headers
)


app.include_router(auth_router,prefix="/auth")
app.include_router(chat_app,prefix="/ws")
app.include_router(store_chat,prefix="/storechat")