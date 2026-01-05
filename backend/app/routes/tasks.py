from flask import Blueprint, request, jsonify
from datetime import datetime
from app.database import db_session
from app.models.tasks import Task

# Create blueprint
tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks with optional filtering by category, status, or date"""
    try:
        query = db_session.query(Task)

        # Apply filters if provided
        category = request.args.get('category')
        status = request.args.get('status')
        date_filter = request.args.get('date')

        if category:
            query = query.filter(Task.category == category)
        if status:
            query = query.filter(Task.status == status)
        if date_filter:
            query = query.filter(Task.date == date_filter)

        tasks = query.all()
        return jsonify([task.to_dict() for task in tasks]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    """Get specific task by ID"""
    try:
        task = db_session.query(Task).filter(Task.id == task_id).first()
        if not task:
            return jsonify({'error': 'Task not found'}), 404

        return jsonify(task.to_dict()), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/api/tasks', methods=['POST'])
def create_task():
    """Create new task"""
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('title'):
            return jsonify({'error': 'Title is required'}), 400

        # Create new task
        task = Task(
            title=data['title'],
            category=data.get('category'),
            status=data.get('status', 'pending'),
            date=datetime.fromisoformat(data['date']).date() if data.get('date') else None,
            time=datetime.strptime(data['time'], '%H:%M:%S').time() if data.get('time') else None,
            priority=data.get('priority', 0),
            notes=data.get('notes')
        )

        db_session.add(task)
        db_session.commit()

        return jsonify(task.to_dict()), 201

    except Exception as e:
        db_session.rollback()
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Update existing task"""
    try:
        task = db_session.query(Task).filter(Task.id == task_id).first()
        if not task:
            return jsonify({'error': 'Task not found'}), 404

        data = request.get_json()

        # Update fields
        if 'title' in data:
            task.title = data['title']
        if 'category' in data:
            task.category = data['category']
        if 'status' in data:
            task.status = data['status']
        if 'date' in data:
            task.date = datetime.fromisoformat(data['date']).date() if data['date'] else None
        if 'time' in data:
            task.time = datetime.strptime(data['time'], '%H:%M:%S').time() if data['time'] else None
        if 'priority' in data:
            task.priority = data['priority']
        if 'notes' in data:
            task.notes = data['notes']

        db_session.commit()

        return jsonify(task.to_dict()), 200

    except Exception as e:
        db_session.rollback()
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete task"""
    try:
        task = db_session.query(Task).filter(Task.id == task_id).first()
        if not task:
            return jsonify({'error': 'Task not found'}), 404

        db_session.delete(task)
        db_session.commit()

        return jsonify({'message': 'Task deleted successfully'}), 200

    except Exception as e:
        db_session.rollback()
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/api/tasks/<int:task_id>/complete', methods=['PATCH'])
def complete_task(task_id):
    """Mark task as completed"""
    try:
        task = db_session.query(Task).filter(Task.id == task_id).first()
        if not task:
            return jsonify({'error': 'Task not found'}), 404

        task.status = 'completed'
        task.completed_at = datetime.utcnow()

        db_session.commit()

        return jsonify(task.to_dict()), 200

    except Exception as e:
        db_session.rollback()
        return jsonify({'error': str(e)}), 500
