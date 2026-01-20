import logging
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.protocol_recommendations import Protocol_recommendations

logger = logging.getLogger(__name__)


# ------------------ Service Layer ------------------
class Protocol_recommendationsService:
    """Service layer for Protocol_recommendations operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any], user_id: Optional[str] = None) -> Optional[Protocol_recommendations]:
        """Create a new protocol_recommendations"""
        try:
            if user_id:
                data['user_id'] = user_id
            obj = Protocol_recommendations(**data)
            self.db.add(obj)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created protocol_recommendations with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating protocol_recommendations: {str(e)}")
            raise

    async def check_ownership(self, obj_id: int, user_id: str) -> bool:
        """Check if user owns this record"""
        try:
            obj = await self.get_by_id(obj_id, user_id=user_id)
            return obj is not None
        except Exception as e:
            logger.error(f"Error checking ownership for protocol_recommendations {obj_id}: {str(e)}")
            return False

    async def get_by_id(self, obj_id: int, user_id: Optional[str] = None) -> Optional[Protocol_recommendations]:
        """Get protocol_recommendations by ID (user can only see their own records)"""
        try:
            query = select(Protocol_recommendations).where(Protocol_recommendations.id == obj_id)
            if user_id:
                query = query.where(Protocol_recommendations.user_id == user_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching protocol_recommendations {obj_id}: {str(e)}")
            raise

    async def get_list(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        user_id: Optional[str] = None,
        query_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get paginated list of protocol_recommendationss (user can only see their own records)"""
        try:
            query = select(Protocol_recommendations)
            count_query = select(func.count(Protocol_recommendations.id))
            
            if user_id:
                query = query.where(Protocol_recommendations.user_id == user_id)
                count_query = count_query.where(Protocol_recommendations.user_id == user_id)
            
            if query_dict:
                for field, value in query_dict.items():
                    if hasattr(Protocol_recommendations, field):
                        query = query.where(getattr(Protocol_recommendations, field) == value)
                        count_query = count_query.where(getattr(Protocol_recommendations, field) == value)
            
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()

            if sort:
                if sort.startswith('-'):
                    field_name = sort[1:]
                    if hasattr(Protocol_recommendations, field_name):
                        query = query.order_by(getattr(Protocol_recommendations, field_name).desc())
                else:
                    if hasattr(Protocol_recommendations, sort):
                        query = query.order_by(getattr(Protocol_recommendations, sort))
            else:
                query = query.order_by(Protocol_recommendations.id.desc())

            result = await self.db.execute(query.offset(skip).limit(limit))
            items = result.scalars().all()

            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit,
            }
        except Exception as e:
            logger.error(f"Error fetching protocol_recommendations list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any], user_id: Optional[str] = None) -> Optional[Protocol_recommendations]:
        """Update protocol_recommendations (requires ownership)"""
        try:
            obj = await self.get_by_id(obj_id, user_id=user_id)
            if not obj:
                logger.warning(f"Protocol_recommendations {obj_id} not found for update")
                return None
            for key, value in update_data.items():
                if hasattr(obj, key) and key != 'user_id':
                    setattr(obj, key, value)

            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated protocol_recommendations {obj_id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating protocol_recommendations {obj_id}: {str(e)}")
            raise

    async def delete(self, obj_id: int, user_id: Optional[str] = None) -> bool:
        """Delete protocol_recommendations (requires ownership)"""
        try:
            obj = await self.get_by_id(obj_id, user_id=user_id)
            if not obj:
                logger.warning(f"Protocol_recommendations {obj_id} not found for deletion")
                return False
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted protocol_recommendations {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting protocol_recommendations {obj_id}: {str(e)}")
            raise

    async def get_by_field(self, field_name: str, field_value: Any) -> Optional[Protocol_recommendations]:
        """Get protocol_recommendations by any field"""
        try:
            if not hasattr(Protocol_recommendations, field_name):
                raise ValueError(f"Field {field_name} does not exist on Protocol_recommendations")
            result = await self.db.execute(
                select(Protocol_recommendations).where(getattr(Protocol_recommendations, field_name) == field_value)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching protocol_recommendations by {field_name}: {str(e)}")
            raise

    async def list_by_field(
        self, field_name: str, field_value: Any, skip: int = 0, limit: int = 20
    ) -> List[Protocol_recommendations]:
        """Get list of protocol_recommendationss filtered by field"""
        try:
            if not hasattr(Protocol_recommendations, field_name):
                raise ValueError(f"Field {field_name} does not exist on Protocol_recommendations")
            result = await self.db.execute(
                select(Protocol_recommendations)
                .where(getattr(Protocol_recommendations, field_name) == field_value)
                .offset(skip)
                .limit(limit)
                .order_by(Protocol_recommendations.id.desc())
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error fetching protocol_recommendationss by {field_name}: {str(e)}")
            raise