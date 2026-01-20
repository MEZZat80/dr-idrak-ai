from core.database import Base
from sqlalchemy import Boolean, Column, Integer, String


class User_profiles(Base):
    __tablename__ = "user_profiles"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    primary_goal = Column(String, nullable=False)
    medications = Column(String, nullable=True)
    medical_conditions = Column(String, nullable=True)
    allergies = Column(String, nullable=True)
    age_verified = Column(Boolean, nullable=False)
    language_preference = Column(String, nullable=True)
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=True)