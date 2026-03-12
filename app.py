from flask import Flask, render_template_string, request, jsonify

app = Flask(__name__)

HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flask App</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }

        .card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            padding: 48px 40px;
            width: 100%;
            max-width: 440px;
        }

        .logo {
            width: 48px; height: 48px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 14px;
            display: flex; align-items: center; justify-content: center;
            margin-bottom: 24px;
            font-size: 22px;
        }

        h1 { font-size: 1.6rem; font-weight: 600; color: #111; margin-bottom: 6px; }
        .subtitle { font-size: 0.9rem; color: #888; margin-bottom: 32px; }

        .field { margin-bottom: 20px; }
        label { display: block; font-size: 0.8rem; font-weight: 600; color: #555; margin-bottom: 8px; letter-spacing: 0.03em; text-transform: uppercase; }

        input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #eee;
            border-radius: 10px;
            font-size: 0.95rem;
            font-family: inherit;
            color: #111;
            transition: border-color 0.2s, box-shadow 0.2s;
            outline: none;
        }
        input:focus { border-color: #667eea; box-shadow: 0 0 0 4px rgba(102,126,234,0.15); }
        input::placeholder { color: #bbb; }

        button {
            width: 100%;
            padding: 13px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 0.95rem;
            font-weight: 600;
            font-family: inherit;
            cursor: pointer;
            margin-top: 8px;
            transition: opacity 0.2s, transform 0.1s;
        }
        button:hover { opacity: 0.9; }
        button:active { transform: scale(0.98); }

        #result {
            display: none;
            margin-top: 24px;
            padding: 16px 18px;
            background: #f5f3ff;
            border-left: 4px solid #667eea;
            border-radius: 0 10px 10px 0;
            color: #4c3d8f;
            font-size: 0.95rem;
            line-height: 1.5;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="logo">👋</div>
        <h1>Hello there</h1>
        <p class="subtitle">Send a message and get a greeting back.</p>

        <div class="field">
            <label for="name">Your name</label>
            <input type="text" id="name" placeholder="e.g. Alice">
        </div>
        <div class="field">
            <label for="message">Message</label>
            <input type="text" id="message" placeholder="What's on your mind?">
        </div>

        <button onclick="submit()">Send message</button>
        <div id="result"></div>
    </div>

    <script>
        async function submit() {
            const name = document.getElementById('name').value.trim();
            const message = document.getElementById('message').value.trim();
            if (!name || !message) { alert('Please fill in both fields.'); return; }
            const res = await fetch('/greet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, message })
            });
            const data = await res.json();
            const el = document.getElementById('result');
            el.textContent = data.reply;
            el.style.display = 'block';
        }

        document.getElementById('message').addEventListener('keydown', e => {
            if (e.key === 'Enter') submit();
        });
    </script>
</body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(HTML)

@app.route('/greet', methods=['POST'])
def greet():
    data = request.get_json()
    name = data.get('name', 'stranger')
    message = data.get('message', '')
    return jsonify(reply=f"Hello, {name}! You said: \"{message}\"")

if __name__ == '__main__':
    app.run(debug=True)
