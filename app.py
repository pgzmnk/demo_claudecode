from flask import Flask, render_template, request, jsonify
import uuid

app = Flask(__name__)

records = []


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/demo")
def demo():
    return render_template("demo.html")


@app.route("/demo/records", methods=["GET"])
def get_records():
    return jsonify(records)


@app.route("/demo/records", methods=["POST"])
def create_record():
    data = request.get_json()
    record = {
        "id": str(uuid.uuid4()),
        "image": data.get("image", ""),
        "title": data.get("title", "Untitled"),
        "description": data.get("description", ""),
    }
    records.append(record)
    return jsonify(record), 201


@app.route("/demo/records/<record_id>", methods=["DELETE"])
def delete_record(record_id):
    global records
    records = [r for r in records if r["id"] != record_id]
    return "", 204


@app.route("/greet", methods=["POST"])
def greet():
    data = request.get_json()
    name = data.get("name", "stranger")
    message = data.get("message", "")
    return jsonify(reply=f'Hello, {name}! You said: "{message}"')


if __name__ == "__main__":
    app.run(debug=True)
