from fastapi import APIRouter, Request, Depends, HTTPException
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

auth_router = APIRouter()

# Secret key for encoding and decoding JWTs
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"  # You can use other algorithms like RS256 for more security

# Password hashing context
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

# Function to generate a JWT token
def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=1)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@auth_router.post("/signup")
async def signup(request: Request, user: UserCreate, db: Session = Depends(get_db)):
    val = select(User).where((User.username == user.username) | (User.email == user.email))
    existing_user = db.execute(val).scalar()
    if existing_user is not None:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_password = pwd_context.hash(user.password)

    # Create the new user and add it to the database
    new_user = User(username=user.username, email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)  # Refresh to get the updated object with id

    # Convert the user object to a dictionary, excluding sensitive data
    user_dict = {c.key: getattr(new_user, c.key) for c in class_mapper(User).columns}
    
    # Remove password from the response
    user_dict.pop("password", None)

    access_token = create_access_token(data={"sub": new_user.username})

    # Return the user data along with the access token
    return JSONResponse(content={"user": user_dict, "access_token": access_token, "token_type": "bearer"}, status_code=201)

@auth_router.post("/login")
async def login(request: Request, user: UserCreate, db: Session = Depends(get_db)):
    val = select(User).where((User.username == user.username) | (User.email == user.email))
    existing_user = db.execute(val).scalar()
    if existing_user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not pwd_context.verify(user.password, existing_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": existing_user.username})
    return JSONResponse(content={"access_token": access_token, "token_type": "bearer"}, status_code=200)
