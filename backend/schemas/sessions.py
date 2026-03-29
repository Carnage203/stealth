from pydantic import BaseModel, Field, field_validator
from typing import Optional, Any
from datetime import datetime
from bson import ObjectId

# ---- Mongo ObjectId wrapper ----
class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        from pydantic_core import core_schema
        
        return core_schema.union_schema([
            core_schema.is_instance_schema(ObjectId),
            core_schema.chain_schema([
                core_schema.str_schema(),
                core_schema.no_info_plain_validator_function(cls.validate),
            ])
        ],
        serialization=core_schema.plain_serializer_function_ser_schema(
            lambda x: str(x)
        ))

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)


# ---- User Session Schema ----
class UserSessions(BaseModel):
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str}
    }

    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId   # 🔗 reference to users collection

    refresh_token_hash: str
    device: str
    browser: str
    os: str
    ip: str

    is_current: bool = False
    revoked: bool = False

    created_at: datetime
    last_active: datetime
    expires_at: Optional[datetime] = None