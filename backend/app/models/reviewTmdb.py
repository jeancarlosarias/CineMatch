from datetime import datetime

from pydantic import BaseModel

class ReviewTMDB(BaseModel):
    author: str
    content: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True