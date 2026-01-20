import json
import logging
from typing import List, Optional


from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.protocol_recommendations import Protocol_recommendationsService
from dependencies.auth import get_current_user
from schemas.auth import UserResponse

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/protocol_recommendations", tags=["protocol_recommendations"])


# ---------- Pydantic Schemas ----------
class Protocol_recommendationsData(BaseModel):
    """Entity data schema (for create/update)"""
    profile_id: int = None
    protocol_name: str
    core_product: str = None
    catalyst_product: str = None
    foundation_product: str = None
    confidence_level: str
    risk_level: str = None
    warnings: str = None
    eligibility: str
    mechanistic_basis: str = None
    created_at: str


class Protocol_recommendationsUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    profile_id: Optional[int] = None
    protocol_name: Optional[str] = None
    core_product: Optional[str] = None
    catalyst_product: Optional[str] = None
    foundation_product: Optional[str] = None
    confidence_level: Optional[str] = None
    risk_level: Optional[str] = None
    warnings: Optional[str] = None
    eligibility: Optional[str] = None
    mechanistic_basis: Optional[str] = None
    created_at: Optional[str] = None


class Protocol_recommendationsResponse(BaseModel):
    """Entity response schema"""
    id: int
    user_id: str
    profile_id: Optional[int] = None
    protocol_name: str
    core_product: Optional[str] = None
    catalyst_product: Optional[str] = None
    foundation_product: Optional[str] = None
    confidence_level: str
    risk_level: Optional[str] = None
    warnings: Optional[str] = None
    eligibility: str
    mechanistic_basis: Optional[str] = None
    created_at: str

    class Config:
        from_attributes = True


class Protocol_recommendationsListResponse(BaseModel):
    """List response schema"""
    items: List[Protocol_recommendationsResponse]
    total: int
    skip: int
    limit: int


class Protocol_recommendationsBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[Protocol_recommendationsData]


class Protocol_recommendationsBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: Protocol_recommendationsUpdateData


class Protocol_recommendationsBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[Protocol_recommendationsBatchUpdateItem]


class Protocol_recommendationsBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=Protocol_recommendationsListResponse)
async def query_protocol_recommendationss(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Query protocol_recommendationss with filtering, sorting, and pagination (user can only see their own records)"""
    logger.debug(f"Querying protocol_recommendationss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = Protocol_recommendationsService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")
        
        result = await service.get_list(
            skip=skip, 
            limit=limit,
            query_dict=query_dict,
            sort=sort,
            user_id=str(current_user.id),
        )
        logger.debug(f"Found {result['total']} protocol_recommendationss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying protocol_recommendationss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=Protocol_recommendationsListResponse)
async def query_protocol_recommendationss_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query protocol_recommendationss with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying protocol_recommendationss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = Protocol_recommendationsService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")

        result = await service.get_list(
            skip=skip,
            limit=limit,
            query_dict=query_dict,
            sort=sort
        )
        logger.debug(f"Found {result['total']} protocol_recommendationss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying protocol_recommendationss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=Protocol_recommendationsResponse)
async def get_protocol_recommendations(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single protocol_recommendations by ID (user can only see their own records)"""
    logger.debug(f"Fetching protocol_recommendations with id: {id}, fields={fields}")
    
    service = Protocol_recommendationsService(db)
    try:
        result = await service.get_by_id(id, user_id=str(current_user.id))
        if not result:
            logger.warning(f"Protocol_recommendations with id {id} not found")
            raise HTTPException(status_code=404, detail="Protocol_recommendations not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching protocol_recommendations {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=Protocol_recommendationsResponse, status_code=201)
async def create_protocol_recommendations(
    data: Protocol_recommendationsData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new protocol_recommendations"""
    logger.debug(f"Creating new protocol_recommendations with data: {data}")
    
    service = Protocol_recommendationsService(db)
    try:
        result = await service.create(data.model_dump(), user_id=str(current_user.id))
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create protocol_recommendations")
        
        logger.info(f"Protocol_recommendations created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating protocol_recommendations: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating protocol_recommendations: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[Protocol_recommendationsResponse], status_code=201)
async def create_protocol_recommendationss_batch(
    request: Protocol_recommendationsBatchCreateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create multiple protocol_recommendationss in a single request"""
    logger.debug(f"Batch creating {len(request.items)} protocol_recommendationss")
    
    service = Protocol_recommendationsService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump(), user_id=str(current_user.id))
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} protocol_recommendationss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[Protocol_recommendationsResponse])
async def update_protocol_recommendationss_batch(
    request: Protocol_recommendationsBatchUpdateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update multiple protocol_recommendationss in a single request (requires ownership)"""
    logger.debug(f"Batch updating {len(request.items)} protocol_recommendationss")
    
    service = Protocol_recommendationsService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict, user_id=str(current_user.id))
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} protocol_recommendationss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=Protocol_recommendationsResponse)
async def update_protocol_recommendations(
    id: int,
    data: Protocol_recommendationsUpdateData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an existing protocol_recommendations (requires ownership)"""
    logger.debug(f"Updating protocol_recommendations {id} with data: {data}")

    service = Protocol_recommendationsService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict, user_id=str(current_user.id))
        if not result:
            logger.warning(f"Protocol_recommendations with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Protocol_recommendations not found")
        
        logger.info(f"Protocol_recommendations {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating protocol_recommendations {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating protocol_recommendations {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_protocol_recommendationss_batch(
    request: Protocol_recommendationsBatchDeleteRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple protocol_recommendationss by their IDs (requires ownership)"""
    logger.debug(f"Batch deleting {len(request.ids)} protocol_recommendationss")
    
    service = Protocol_recommendationsService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id, user_id=str(current_user.id))
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} protocol_recommendationss successfully")
        return {"message": f"Successfully deleted {deleted_count} protocol_recommendationss", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_protocol_recommendations(
    id: int,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a single protocol_recommendations by ID (requires ownership)"""
    logger.debug(f"Deleting protocol_recommendations with id: {id}")
    
    service = Protocol_recommendationsService(db)
    try:
        success = await service.delete(id, user_id=str(current_user.id))
        if not success:
            logger.warning(f"Protocol_recommendations with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Protocol_recommendations not found")
        
        logger.info(f"Protocol_recommendations {id} deleted successfully")
        return {"message": "Protocol_recommendations deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting protocol_recommendations {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")