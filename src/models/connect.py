from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.orm import DeclarativeBase,Mapped
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.engine import URL
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column


engine = create_engine("postgresql://myuser:password@localhost:5432/postgres")


class Base(DeclarativeBase):
    pass
class User(Base):
    __tablename__ = 'users'  
    id:Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username:Mapped[str]=mapped_column(nullable=False)
    email:Mapped[str]=mapped_column(nullable=False,unique=True)
    password:Mapped[str]=mapped_column(nullable=False)
    def __repr__(self):
        return f"User(id={self.id}, username={self.username}, email={self.email})"



Base.metadata.create_all(engine)


