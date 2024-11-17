from fastapi import APIRouter, Request, Depends, HTTPException,Response
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import select
from models.connect import User, engine
from fastapi.responses import JSONResponse
from passlib.context import CryptContext 
from typing import List
import jwt
from datetime import datetime, timedelta
from sqlalchemy.orm import class_mapper
from fastapi.security import OAuth2PasswordBearer
auth_router = APIRouter()
from .helper import verify_jwt_token, create_access_token

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256" 

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# Database Dependency
def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()

# Pydantic Model for Serialization and Validation
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    class Config:
        orm_mode = True


class UserCheck(BaseModel):
    email: str
    password: str
    class Config:
        orm_mode = True

# Function to generate a JWT token

@auth_router.post("/signup")
async def signup(request: Request, user: UserCreate,response: Response,db: Session = Depends(get_db)):
    val = select(User).where((User.email == user.email))
    existing_user = db.execute(val).scalar()
    if existing_user is not None:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_password = pwd_context.hash(user.password)
    new_user = User(username=user.username, email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    user_dict = {c.key: getattr(new_user, c.key) for c in class_mapper(User).columns}
    user_dict.pop("password", None)
    access_token = create_access_token(data={"sub": new_user.username})
    response.set_cookie(key="token", value=access_token, httponly=True)
    return JSONResponse(content={"user": user_dict, "access_token": access_token, "token_type": "bearer"}, status_code=201)

@auth_router.post("/login")
async def login(request: Request, user: UserCheck,response: Response, db: Session = Depends(get_db)):
    print(user)
    val = select(User).where((User.email == user.email))
    existing_user = db.execute(val).scalar()
    if existing_user is None:
        return JSONResponse(content={"message": "User not found"}, status_code=404)
    if not pwd_context.verify(user.password, existing_user.password):
        return JSONResponse(content={"message": "Invalid credentials"}, status_code=401)
    access_token = create_access_token(data={"sub": existing_user.username})
    response.set_cookie(key="token", value=access_token, httponly=True)
    user_dict={c.key: getattr(existing_user, c.key) for c in class_mapper(User).columns}
    user_dict.pop("password", None)
    return JSONResponse(content={"user": user_dict,"access_token": access_token, "token_type": "bearer"}, status_code=200)
