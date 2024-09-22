from flask import request, jsonify
from celery.result import AsyncResult

from models import app, db, Notes
from celery_worker import celery, send_reminder


@app.route('/notes', methods=['POST'])
def create_note():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    new_note = Notes(title=title, content=content)
    db.session.add(new_note)
    db.session.commit()

    return jsonify(new_note.to_dict()), 201


@app.route('/notes/<int:id>', methods=['PUT'])
def update_note(id):
    note = Notes.query.get_or_404(id=id)
    data = request.get_json()

    title = data.get('title')
    content = data.get('content')

    note.title = title
    note.content = content
    db.session.commit()

    return jsonify(note.to_dict()), 200


@app.route('/list_notes', methods=['GET'])
def get_notes():
    notes = Notes.query.all()
    return jsonify([note.to_dict() for note in notes]), 200


@app.route('/notes/<int:id>', methods=['DELETE'])
def delete_note(id):
    note = Notes.query.get_or_404(id=id)

    db.session.delete(note)
    db.session.commit()

    return jsonify({'message': 'Note deleted'}), 200


@app.route('/create_reminder', methods=['POST'])
def create_reminder():
    data = request.get_json()
    notes_id = data.get('notes_id')
    reminder_eta = data.get('eta')
    receiver_email = data.get('email')
    note = Notes.query.get_or_404(id=notes_id)
    task = send_reminder.apply_async(args=[note.content, receiver_email], eta=reminder_eta)
    note.task_id = task.id
    db.session.commit()

    return jsonify({'message': 'Reminder added'}), 200

@app.route('/update_reminder', methods=['POST'])
def update_reminder():
    data = request.get_json()
    notes_id = data.get('notes_id')
    reminder_eta = data.get('eta')
    receiver_email = data.get('email')
    note = Notes.query.get_or_404(id=notes_id)
    try:
        result = AsyncResult(note.task_id, app=celery)
        if result.state in ['PENDING', 'RECEIVED', 'STARTED']:
            result.revoke(terminate=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    task = send_reminder.apply_async(args=[note.content, receiver_email], eta=reminder_eta)
    note.task_id = task.id
    db.session.commit()

    return jsonify({'message': 'Reminder updated'}), 200


@app.route('/delete_reminder', methods=['POST'])
def delete_reminder():
    data = request.get_json()
    notes_id = data.get('notes_id')
    note = Notes.query.get_or_404(id=notes_id)
    try:
        result = AsyncResult(note.task_id, app=celery)
        if result.state in ['PENDING', 'RECEIVED', 'STARTED']:
            result.revoke(terminate=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    note.task_id=None
    db.session.commit()

    return jsonify({'message': 'Reminder deleted'}), 200


if __name__ == '__main__':
    app.run(debug=True)
