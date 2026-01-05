from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
import os

# Database path from .env or default
DATABASE_PATH = os.getenv('DATABASE_PATH', 'data/database/dashboard.db')

# Ensure directory exists
os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)

# Create engine
engine = create_engine(
    f'sqlite:///{DATABASE_PATH}',
    echo=True,  # Set to False in production
    connect_args={'check_same_thread': False}  # Needed for SQLite
)

# Create session factory
db_session = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
)

# Create declarative base
Base = declarative_base()
Base.query = db_session.query_property()

def init_db():
    """Initialize database - create all tables"""
    # Import all models here to register them
    # NOTE: These imports are commented out initially since model files don't exist yet
    # Uncomment each line as you create the corresponding model file

    import app.models.tasks
    # import app.models.projects
    # import app.models.education
    # import app.models.calendar
    # import app.models.water
    # import app.models.weight
    # import app.models.exercise
    # import app.models.sleep
    # import app.models.nutrition
    # import app.models.medications
    # import app.models.health_events
    # import app.models.music

    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

def shutdown_session(exception=None):
    """Clean up database session"""
    db_session.remove()
