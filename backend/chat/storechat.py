from fastapi import APIRouter,Request
router = APIRouter()
from.rediss import RedisClient
r=RedisClient()
from fastapi.responses import JSONResponse
store_chat = APIRouter()
from pydantic import BaseModel

class UserDetails(BaseModel):
    sender_id: str
    receiver_id: str
    class Config:
        orm_mode = True

@store_chat.post('/')
async def store_message(request: Request, users: UserDetails):
    print(users.sender_id, users.receiver_id)
    sender_id = users.sender_id
    receiver_id = users.receiver_id
    return JSONResponse(content=r.get_conversation_messages(sender_id, receiver_id), status_code=222)

