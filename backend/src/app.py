from flask import Flask, jsonify, request
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS


app = Flask(__name__)

app.config['MONGO_URI'] = 'mongodb://your_mongodb_host/your_mongodb'

mongo = PyMongo(app)

CORS(app)
db = mongo.db.notes


@app.route('/notes', methods=['POST'])
def createNote():
    id = db.insert_one({
        'title': request.json['title'],
        'content': request.json['content']
    })
    return jsonify(str(id.inserted_id))


@app.route('/notes', methods=['GET'])
def getNotes():
    notes = []
    for doc in db.find():
        notes.append({
            '_id': str(doc['_id']),
            'title': doc['title'],
            'content': doc['content']
        })
    return jsonify(notes)


@app.route('/notes/<id>', methods=['GET'])
def getNote(id):
    note = db.find_one({'_id': ObjectId(id)})
    return jsonify({
        '_id': str(ObjectId(note['_id'])),
        'title': note['title'],
        'content': note['content']
    })


@app.route('/notes/<id>', methods=['DELETE'])
def deleteNote(id):
    db.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Note Deleted'})


@app.route('/notes/<id>', methods=['PUT'])
def updateNote(id):
    db.update_one({'_id': ObjectId(id)}, {"$set": {
        'title': request.json['title'],
        'content': request.json['content']
    }})
    return jsonify({'message': 'Note Updated'})


if __name__ == "__main__":
    app.run(debug=True)
