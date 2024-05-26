from flask import Flask, request, jsonify

from database.sqlite import MySqlite

app = Flask(__name__)
db = MySqlite()

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    try:
        user = db.get_user(data["username"])
        if user:
            return jsonify(data), 200

        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    try:
        db.create_user(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify(data), 201

if __name__ == "__main__":
    app.run(debug=True)
    db.close()
    

