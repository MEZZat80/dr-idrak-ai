from core.database import Base
from sqlalchemy import Column, Integer, String


class Chat_history(Base):
    __tablename__ = "chat_history"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    session_id = Column(String, nullable=False)
    role = Column(String, nullable=False)
    content = Column(String, nullable=False)
    intake_step = Column(String, nullable=True)
    created_at = Column(String, nullable=False)