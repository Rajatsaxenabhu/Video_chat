from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.orm import DeclarativeBase,Mapped
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.engine import URL
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy import Column, Integer, String, DateTime, Boolean
import datetime


from sqlalchemy import create_engine

# Example MySQL connection string
engine = create_engine("mysql+pymysql://root:rootpassword@localhost:3306/mysql")
class Base(DeclarativeBase):
    pass
class User(Base):
    __tablename__ = 'users'  
   
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(30), nullable=False)
    email: Mapped[str] = mapped_column(String(30), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(70), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now())
    is_authenticated: Mapped[bool] = mapped_column(Boolean, default=False)
    def __repr__(self):
        return f"User(id={self.id}, username={self.username}, email={self.email})"

Base.metadata.create_all(engine)


