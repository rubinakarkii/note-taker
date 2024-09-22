from flask import request, jsonify
from models import app, db, User, Notes

# Route to create a new note
@app.route('/notes', methods=['POST'])
def create_note():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    new_note = Notes(title=title, content=content)
    db.session.add(new_note)
    db.session.commit()

    return jsonify(new_note.to_dict()), 201


# Route to update a note by ID
@app.route('/notes/<int:id>', methods=['PUT'])
def update_note(id):
    note = Notes.query.get_or_404(id)
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
    note = Notes.query.get_or_404(id)

    db.session.delete(note)
    db.session.commit()

    return jsonify({'message': 'Note deleted'}), 200


@app.route('/create_reminder', methods=['POST'])
def create_reminder(id):
    pass


@app.route('/update_reminder', methods=['POST'])
def update_reminder(id):
    pass


@app.route('/delete_reminder', methods=['POST'])
def delete_reminder(id):
    pass


if __name__ == '__main__':
    app.run(debug=True)
