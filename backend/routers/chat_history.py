import json
import logging
from typing import List, Optional


from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.chat_history import Chat_historyService
from dependencies.auth import get_current_user
from schemas.auth import UserResponse

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/chat_history", tags=["chat_history"])


# ---------- Pydantic Schemas ----------
class Chat_historyData(BaseModel):
    """Entity data schema (for create/update)"""
    session_id: str
    role: str
    content: str
    intake_step: str = None
    created_at: str


class Chat_historyUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    session_id: Optional[str] = None
    role: Optional[str] = None
    content: Optional[str] = None
    intake_step: Optional[str] = None
    created_at: Optional[str] = None


class Chat_historyResponse(BaseModel):
    """Entity response schema"""
    id: int
    user_id: str
    session_id: str
    role: str
    content: str
    intake_step: Optional[str] = None
    created_at: str

    class Config:
        from_attributes = True


class Chat_historyListResponse(BaseModel):
    """List response schema"""
    items: List[Chat_historyResponse]
    total: int
    skip: int
    limit: int


class Chat_historyBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[Chat_historyData]


class Chat_historyBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: Chat_historyUpdateData


class Chat_historyBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[Chat_historyBatchUpdateItem]


class Chat_historyBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=Chat_historyListResponse)
async def query_chat_historys(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Query chat_historys with filtering, sorting, and pagination (user can only see their own records)"""
    logger.debug(f"Querying chat_historys: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = Chat_historyService(db)
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
        logger.debug(f"Found {result['total']} chat_historys")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying chat_historys: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=Chat_historyListResponse)
async def query_chat_historys_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query chat_historys with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying chat_historys: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = Chat_historyService(db)
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
        logger.debug(f"Found {result['total']} chat_historys")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying chat_historys: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=Chat_historyResponse)
async def get_chat_history(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single chat_history by ID (user can only see their own records)"""
    logger.debug(f"Fetching chat_history with id: {id}, fields={fields}")
    
    service = Chat_historyService(db)
    try:
        result = await service.get_by_id(id, user_id=str(current_user.id))
        if not result:
            logger.warning(f"Chat_history with id {id} not found")
            raise HTTPException(status_code=404, detail="Chat_history not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching chat_history {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=Chat_historyResponse, status_code=201)
async def create_chat_history(
    data: Chat_historyData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new chat_history"""
    logger.debug(f"Creating new chat_history with data: {data}")
    
    service = Chat_historyService(db)
    try:
        result = await service.create(data.model_dump(), user_id=str(current_user.id))
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create chat_history")
        
        logger.info(f"Chat_history created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating chat_history: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating chat_history: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[Chat_historyResponse], status_code=201)
async def create_chat_historys_batch(
    request: Chat_historyBatchCreateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create multiple chat_historys in a single request"""
    logger.debug(f"Batch creating {len(request.items)} chat_historys")
    
    service = Chat_historyService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump(), user_id=str(current_user.id))
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} chat_historys successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[Chat_historyResponse])
async def update_chat_historys_batch(
    request: Chat_historyBatchUpdateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update multiple chat_historys in a single request (requires ownership)"""
    logger.debug(f"Batch updating {len(request.items)} chat_historys")
    
    service = Chat_historyService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict, user_id=str(current_user.id))
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} chat_historys successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=Chat_historyResponse)
async def update_chat_history(
    id: int,
    data: Chat_historyUpdateData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an existing chat_history (requires ownership)"""
    logger.debug(f"Updating chat_history {id} with data: {data}")

    service = Chat_historyService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict, user_id=str(current_user.id))
        if not result:
            logger.warning(f"Chat_history with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Chat_history not found")
        
        logger.info(f"Chat_history {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating chat_history {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating chat_history {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_chat_historys_batch(
    request: Chat_historyBatchDeleteRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple chat_historys by their IDs (requires ownership)"""
    logger.debug(f"Batch deleting {len(request.ids)} chat_historys")
    
    service = Chat_historyService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id, user_id=str(current_user.id))
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} chat_historys successfully")
        return {"message": f"Successfully deleted {deleted_count} chat_historys", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_chat_history(
    id: int,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a single chat_history by ID (requires ownership)"""
    logger.debug(f"Deleting chat_history with id: {id}")
    
    service = Chat_historyService(db)
    try:
        success = await service.delete(id, user_id=str(current_user.id))
        if not success:
            logger.warning(f"Chat_history with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Chat_history not found")
        
        logger.info(f"Chat_history {id} deleted successfully")
        return {"message": "Chat_history deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting chat_history {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")