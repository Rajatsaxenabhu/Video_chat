import jwt
from datetime import datetime, timedelta
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"  # You can use other algorithms like RS256 for more security


def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=1)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_jwt_token(token: str):
    try:
        # Decode the JWT token to verify it
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # Return the payload which contains user information
    except jwt.PyJWTError:
        return False