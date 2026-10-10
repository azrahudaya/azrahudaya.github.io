#!/usr/bin/env python3
"""
Server lokal untuk Shuffle Deck ajra.tech
Menyajikan file statis dan endpoint API kirim email via Gmail SMTP.
"""

import http.server
import json
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

PORT = 4321
DIRECTORY = Path(__file__).parent.resolve()
SENDER_EMAIL = "hudaya.azra@gmail.com"

def get_smtp_password():
    # 1. Dari Environment variable
    env_pass = os.environ.get("SMTP_PASS") or os.environ.get("GMAIL_APP_PASSWORD")
    if env_pass:
        return env_pass.replace(" ", "").strip()
    
    # 2. Dari berkas .env lokal jika ada
    local_env = DIRECTORY / ".env"
    if local_env.exists():
        for line in local_env.read_text().splitlines():
            if line.startswith("SMTP_PASS="):
                return line.split("=", 1)[1].replace(" ", "").strip()
    
    # 3. Dari project budyah yang sudah terverifikasi
    budyah_env = Path("/home/fuudaya/Projects/budyah/.env")
    if budyah_env.exists():
        for line in budyah_env.read_text().splitlines():
            if line.startswith("SMTP_PASS="):
                return line.split("=", 1)[1].replace(" ", "").strip()
    
    return None

class ShuffleHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        if self.path == "/api/send-email":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode("utf-8"))
            except Exception as e:
                self._send_json({"ok": False, "error": f"Invalid JSON: {str(e)}"}, status=400)
                return

            recipient = data.get("email", "").strip()
            card_title = data.get("cardTitle", "Kartu Pilihan")
            card_content = data.get("cardContent", "Tidak ada konten")
            card_color = data.get("cardColor", "#2563eb")

            if not recipient or "@" not in recipient:
                self._send_json({"ok": False, "error": "Alamat email tidak valid."}, status=400)
                return

            smtp_password = get_smtp_password()
            if not smtp_password:
                self._send_json({"ok": False, "error": "SMTP Password tidak ditemukan di sistem."}, status=500)
                return

            try:
                msg = MIMEMultipart("alternative")
                msg["Subject"] = f"Kartu Pilihan Kamu: {card_title}"
                msg["From"] = f"Shuffle Deck <{SENDER_EMAIL}>"
                msg["To"] = recipient

                text_content = f"{card_title}\n\n{card_content}\n\nDikirim dari ajra.tech/shuffle"
                html_content = f"""
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <style>
                    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px; }}
                    .card-box {{ max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }}
                    .card-header {{ background-color: {card_color}; padding: 24px; text-align: center; color: #ffffff; }}
                    .card-body {{ padding: 32px 28px; }}
                    .title {{ font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 14px; line-height: 1.3; }}
                    .content {{ font-size: 15px; color: #475569; line-height: 1.65; margin-bottom: 24px; }}
                    .footer {{ padding: 20px 28px; background: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8; }}
                  </style>
                </head>
                <body>
                  <div class="card-box">
                    <div class="card-header">
                      <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">ajra.tech / shuffle</span>
                    </div>
                    <div class="card-body">
                      <div class="title">{card_title}</div>
                      <div class="content">{card_content}</div>
                    </div>
                    <div class="footer">
                      Email tes dikirim otomatis dari {SENDER_EMAIL} via Shuffle Deck.
                    </div>
                  </div>
                </body>
                </html>
                """

                msg.attach(MIMEText(text_content, "plain"))
                msg.attach(MIMEText(html_content, "html"))

                with smtplib.SMTP("smtp.gmail.com", 587, timeout=15) as server:
                    server.starttls()
                    server.login(SENDER_EMAIL, smtp_password)
                    server.send_message(msg)

                self._send_json({"ok": True, "message": f"Email tes berhasil dikirim ke {recipient}!"})
            except Exception as e:
                self._send_json({"ok": False, "error": f"Gagal mengirim email: {str(e)}"}, status=500)
        else:
            self.send_error(404, "Endpoint not found")

    def _send_json(self, payload, status=200):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

if __name__ == "__main__":
    server = http.server.HTTPServer(("0.0.0.0", PORT), ShuffleHandler)
    print(f"Shuffle Server running on http://localhost:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
