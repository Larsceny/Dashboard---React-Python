from flask import Blueprint, request, jsonify
from app.database import db_session
from app.models.projects import Project, ProjectTask

# Create blueprint
projects_bp = Blueprint('projects', __name__)

@projects_bp.route('/api/projects', methods=['GET'])
def get_projects():
    """Get all projects with optional filtering by status"""
    try:
        query = db_session.query(Project)

        # Apply status filter if provided
        status = request.args.get('status')
        if status:
            query = query.filter(Project.status == status)

        projects = query.all()
        return jsonify([project.to_dict(include_tasks=True) for project in projects]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/api/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    """Get specific project by ID with tasks"""
    try:
        project = db_session.query(Project).filter(Project.id == project_id).first()
        if not project:
            return jsonify({'error': 'Project not found'}), 404

        return jsonify(project.to_dict(include_tasks=True)), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/api/projects', methods=['POST'])
def create_project():
    """Create new project"""
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('name'):
            return jsonify({'error': 'Name is required'}), 400

        # Create new project
        project = Project(
            name=data['name'],
            description=data.get('description'),
            status=data.get('status', 'active'),
            progress=data.get('progress', 0),
            next_step=data.get('next_step'),
            obsidian_link=data.get('obsidian_link'),
            is_main=data.get('is_main', False)
        )

        db_session.add(project)
        db_session.commit()

        return jsonify(project.to_dict(include_tasks=True)), 201

    except Exception as e:
        db_session.rollback()
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/api/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    """Update existing project"""
    try:
        project = db_session.query(Project).filter(Project.id == project_id).first()
        if not project:
            return jsonify({'error': 'Project not found'}), 404

        data = request.get_json()

        # Update fields
        if 'name' in data:
            project.name = data['name']
        if 'description' in data:
            project.description = data['description']
        if 'status' in data:
            project.status = data['status']
        if 'progress' in data:
            project.progress = data['progress']
        if 'next_step' in data:
            project.next_step = data['next_step']
        if 'obsidian_link' in data:
            project.obsidian_link = data['obsidian_link']
        if 'is_main' in data:
            project.is_main = data['is_main']

        db_session.commit()

        return jsonify(project.to_dict(include_tasks=True)), 200

    except Exception as e:
        db_session.rollback()
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/api/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    """Delete project and all its tasks (cascade)"""
    try:
        project = db_session.query(Project).filter(Project.id == project_id).first()
        if not project:
            return jsonify({'error': 'Project not found'}), 404

        db_session.delete(project)
        db_session.commit()

        return jsonify({'message': 'Project deleted successfully'}), 200

    except Exception as e:
        db_session.rollback()
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/api/projects/<int:project_id>/tasks', methods=['POST'])
def create_project_task(project_id):
    """Add task to project"""
    try:
        # Verify project exists
        project = db_session.query(Project).filter(Project.id == project_id).first()
        if not project:
            return jsonify({'error': 'Project not found'}), 404

        data = request.get_json()

        # Validate required fields
        if not data.get('title'):
            return jsonify({'error': 'Title is required'}), 400

        # Create new project task
        task = ProjectTask(
            project_id=project_id,
            title=data['title'],
            completed=data.get('completed', False),
            order=data.get('order', 0)
        )

        db_session.add(task)
        db_session.commit()

        return jsonify(task.to_dict()), 201

    except Exception as e:
        db_session.rollback()
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/api/projects/<int:project_id>/tasks/<int:task_id>', methods=['PATCH'])
def toggle_project_task(project_id, task_id):
    """Toggle task completion status"""
    try:
        task = db_session.query(ProjectTask).filter(
            ProjectTask.id == task_id,
            ProjectTask.project_id == project_id
        ).first()

        if not task:
            return jsonify({'error': 'Task not found'}), 404

        # Toggle completion
        task.completed = not task.completed

        db_session.commit()

        return jsonify(task.to_dict()), 200

    except Exception as e:
        db_session.rollback()
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/api/projects/<int:project_id>/tasks/<int:task_id>', methods=['DELETE'])
def delete_project_task(project_id, task_id):
    """Delete project task"""
    try:
        task = db_session.query(ProjectTask).filter(
            ProjectTask.id == task_id,
            ProjectTask.project_id == project_id
        ).first()

        if not task:
            return jsonify({'error': 'Task not found'}), 404

        db_session.delete(task)
        db_session.commit()

        return jsonify({'message': 'Task deleted successfully'}), 200

    except Exception as e:
        db_session.rollback()
        return jsonify({'error': str(e)}), 500
