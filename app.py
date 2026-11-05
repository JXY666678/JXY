from flask import Flask, render_template, jsonify
import time

app = Flask(__name__)


@app.get("/")
def index():
    return render_template("index.html")


@app.get("/api/status")
def status():
    return jsonify(
        {
            "ok": True,
            "name": "绿分 · 校园垃圾分类系统",
            "engine": "MobileNetV2 · 本地推理",
            "time": int(time.time()),
        }
    )


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
