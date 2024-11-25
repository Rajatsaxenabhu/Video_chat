from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.orm import DeclarativeBase,Mapped
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.engine import URL
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy import Integer, String, DateTime, Boolean, func
from datetime import datetime

from sqlalchemy import create_engine
# Example MySQL connection string
engine = create_engine("mysql+pymysql://root:rootpassword@localhost:3306/kali")
class Base(DeclarativeBase):
    pass
class User(Base):
    __tablename__ = 'users'
    id = mapped_column(Integer, primary_key=True, autoincrement=True)
    username = mapped_column(String(30), nullable=False)
    email = mapped_column(String(30), nullable=False, unique=True)
    password = mapped_column(String(70), nullable=False)
    images=mapped_column(String(100), nullable=True)
    is_active = mapped_column(Boolean, default=False)

    def to_dict(self):
        """Convert the model instance into a dictionary."""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'password': self.password,
            'is_active': self.is_active,
            'images':self.images
        }

Base.metadata.create_all(engine)


