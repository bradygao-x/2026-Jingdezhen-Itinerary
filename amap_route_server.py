#!/usr/bin/env python3
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlencode, urlparse
from urllib.request import urlopen
import json
import os
import re

ROOT = Path(__file__).resolve().parents[3]
KEYS_PATH = ROOT / "90_系统" / "keys.md"


def read_amap_key():
    env_key = os.environ.get("AMAP_WEB_KEY")
    if env_key:
        return env_key
    text = KEYS_PATH.read_text(encoding="utf-8")
    match = re.search(r"##高德地图：([0-9a-fA-F]+)", text)
    if not match:
        raise RuntimeError("AMap key not found; set AMAP_WEB_KEY or keep keys.md available")
    return match.group(1)


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path != "/amap-driving":
            return super().do_GET()

        params = parse_qs(parsed.query)
        origin = params.get("origin", [""])[0]
        destination = params.get("destination", [""])[0]
        if not origin or not destination:
            self.end_json(400, {"ok": False, "error": "origin and destination are required"})
            return

        try:
            key = read_amap_key()
            query = urlencode({
                "key": key,
                "origin": origin,
                "destination": destination,
                "strategy": "10",
                "extensions": "base",
                "output": "json",
            })
            with urlopen(f"https://restapi.amap.com/v3/direction/driving?{query}", timeout=20) as response:
                data = json.loads(response.read().decode("utf-8"))

            if data.get("status") != "1":
                self.end_json(502, {
                    "ok": False,
                    "error": data.get("info") or "AMap route request failed",
                    "infocode": data.get("infocode"),
                })
                return

            paths = data.get("route", {}).get("paths", [])
            if not paths:
                self.end_json(502, {"ok": False, "error": "AMap returned no paths"})
                return

            points = []
            for step in paths[0].get("steps", []):
                polyline = step.get("polyline", "")
                for item in polyline.split(";"):
                    if not item:
                        continue
                    lng, lat = item.split(",")
                    points.append([float(lat), float(lng)])

            self.end_json(200, {
                "ok": True,
                "points": points,
                "distance": paths[0].get("distance"),
                "duration": paths[0].get("duration"),
            })
        except Exception as exc:
            self.end_json(500, {"ok": False, "error": str(exc)})


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8765), Handler)
    print("Serving Jingdezhen itinerary with AMap route proxy at http://127.0.0.1:8765/")
    server.serve_forever()
