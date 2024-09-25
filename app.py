from flask import request, jsonify
from celery.result import AsyncResult
from flask_cors import cross_origin

from models import app, db, Notes
from celery_worker import celery, send_reminder


@app.route('/notes', methods=['POST'])
@cross_origin(origin='*')
def create_note():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    new_note = Notes(title=title, content=content)
    db.session.add(new_note)
    db.session.commit()
    return jsonify(new_note.to_dict(), {'message': 'Note added successfully'}), 200


@app.route('/notes/<int:id>', methods=['PUT'])
@cross_origin(origin='*')
def update_note(id):
    note = Notes.query.get_or_404(id)
    data = request.get_json()

    title = data.get('title')
    content = data.get('content')

    note.title = title
    note.content = content
    db.session.commit()

    return jsonify(note.to_dict(),{'message': 'Note updated successfully'}), 200


@app.route('/notes', methods=['GET'])
@cross_origin(origin='*')
def get_notes():
    notes = Notes.query.all()
    return jsonify([note.to_dict() for note in notes]), 200


@app.route('/notes/<int:id>', methods=['DELETE'])
@cross_origin(origin='*')
def delete_note(id):
    note = Notes.query.get_or_404(id)

    db.session.delete(note)
    db.session.commit()

    return jsonify({'message': 'Note deleted successfully'}), 200


@app.route('/create_reminder', methods=['POST'])
@cross_origin(origin='*')
def create_reminder():
    data = request.get_json()
    notes_id = data.get('notes_id')
    reminder_eta = data.get('eta')
    receiver_email = data.get('email')
    note = Notes.query.get_or_404(notes_id)
    task = send_reminder.apply_async(args=[note.content, receiver_email], eta=reminder_eta
                                    )
    note.task_id = task.id
    note.eta = reminder_eta
    note.email = receiver_email
    db.session.commit()

    return jsonify({'message': 'Reminder added successfully'}), 200

@app.route('/update_reminder', methods=['POST'])
@cross_origin(origin='*')
def update_reminder():
    data = request.get_json()
    notes_id = data.get('notes_id')
    reminder_eta = data.get('eta')
    receiver_email = data.get('email')
    note = Notes.query.get_or_404(notes_id)
    try:
        result = AsyncResult(note.task_id, app=celery)
        if result.state in ['PENDING', 'RECEIVED', 'STARTED']:
            result.revoke(terminate=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    task = send_reminder.apply_async(args=[note.content, receiver_email], eta=reminder_eta
                                    )
    note.task_id = task.id
    note.eta = reminder_eta
    note.email = receiver_email
    db.session.commit()

    return jsonify({'message': 'Reminder updated successfully'}), 200


@app.route('/delete_reminder', methods=['POST'])
@cross_origin(origin='*')
def delete_reminder():
    data = request.get_json()
    notes_id = data.get('notes_id')
    note = Notes.query.get_or_404(notes_id)
    try:
        result = AsyncResult(note.task_id, app=celery)
        if result.state in ['PENDING', 'RECEIVED', 'STARTED']:
            result.revoke(terminate=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    note.task_id=None
    note.eta = None
    note.email = None
    db.session.commit()

    return jsonify({'message': 'Reminder deleted successfully'}), 200


if __name__ == '__main__':
    app.run(debug=True)
