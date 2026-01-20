from core.database import Base
from sqlalchemy import Column, Integer, String


class Subscriptions(Base):
    __tablename__ = "subscriptions"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    protocol_id = Column(Integer, nullable=True)
    subscription_type = Column(String, nullable=False)
    status = Column(String, nullable=False)
    start_date = Column(String, nullable=False)
    next_delivery_date = Column(String, nullable=True)
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=True)