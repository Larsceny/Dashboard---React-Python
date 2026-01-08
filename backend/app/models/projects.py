from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Project(Base):
    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    status = Column(String(20), default='active')  # active, paused, completed
    progress = Column(Integer, default=0)  # 0-100 percentage
    next_step = Column(Text)
    obsidian_link = Column(String(500))  # obsidian:// URI - just a string
    is_main = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    # Relationship to project tasks
    tasks = relationship('ProjectTask', back_populates='project', cascade='all, delete-orphan')

    def to_dict(self, include_tasks=False):
        """Convert project to dictionary for JSON serialization"""
        data = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'status': self.status,
            'progress': self.progress,
            'next_step': self.next_step,
            'obsidian_link': self.obsidian_link,
            'is_main': self.is_main,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

        if include_tasks:
            data['tasks'] = [task.to_dict() for task in self.tasks]

        return data

class ProjectTask(Base):
    __tablename__ = 'project_tasks'

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=False)
    title = Column(String(200), nullable=False)
    completed = Column(Boolean, default=False)
    order = Column(Integer, default=0)

    # Relationship to parent project
    project = relationship('Project', back_populates='tasks')

    def to_dict(self):
        """Convert project task to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'project_id': self.project_id,
            'title': self.title,
            'completed': self.completed,
            'order': self.order
        }
