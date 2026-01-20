from core.database import Base
from sqlalchemy import Column, Integer, String


class Protocol_recommendations(Base):
    __tablename__ = "protocol_recommendations"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    profile_id = Column(Integer, nullable=True)
    protocol_name = Column(String, nullable=False)
    core_product = Column(String, nullable=True)
    catalyst_product = Column(String, nullable=True)
    foundation_product = Column(String, nullable=True)
    confidence_level = Column(String, nullable=False)
    risk_level = Column(String, nullable=True)
    warnings = Column(String, nullable=True)
    eligibility = Column(String, nullable=False)
    mechanistic_basis = Column(String, nullable=True)
    created_at = Column(String, nullable=False)