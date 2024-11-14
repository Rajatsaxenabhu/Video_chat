from typing import Union
from fastapi import FastAPI,websockets
from routes.auth import auth_router
app = FastAPI()

@app.get("/")
async def read_root():
    return {"Hello": "World"}

app.include_router(auth_router,prefix="/auth")