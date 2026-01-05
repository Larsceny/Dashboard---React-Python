from sqlalchemy import Column, Integer, String, Date, Time, DateTime, Text
from datetime import datetime
from app.database import Base

class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    category = Column(String(50))  # Daily, Weekly, Monthly
    status = Column(String(20), default='pending')  # pending, completed
    date = Column(Date, index=True)
    time = Column(Time, nullable=True)
    priority = Column(Integer, default=0)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    def to_dict(self):
        """Convert task to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'status': self.status,
            'date': self.date.isoformat() if self.date else None,
            'time': self.time.isoformat() if self.time else None,
            'priority': self.priority,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }
