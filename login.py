from flask import Flask, render_template, request, redirect, session, flash, url_for
import sqlite3, hashlib

app = Flask(__name__)
app.secret_key = "mysecretkey"   # ใช้สำหรับ session (ควรเปลี่ยนเป็นค่าอื่น)

# ฟังก์ชัน hash password
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# ฟังก์ชันเชื่อมต่อ DB
def get_db():
    conn = sqlite3.connect("users.db")
    conn.row_factory = sqlite3.Row
    return conn

# สร้างตารางถ้ายังไม่มี
with get_db() as conn:
    conn.execute("""CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )""")
    conn.commit()

# หน้าแรก
@app.route("/")
def index():
    if "user" in session:
        return f"สวัสดี {session['user']} <br><a href='/logout'>Logout</a>"
    return "<a href='/login'>Login</a> | <a href='/register'>Register</a>"

# Register
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = hash_password(request.form["password"])
        try:
            with get_db() as conn:
                conn.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
                conn.commit()
            flash("✅ สมัครสมาชิกสำเร็จ", "success")
            return redirect(url_for("login"))
        except sqlite3.IntegrityError:
            flash("❌ ชื่อผู้ใช้นี้มีอยู่แล้ว", "danger")
    return '''
        <h2>Register</h2>
        <form method="post">
            Username: <input type="text" name="username" required><br>
            Password: <input type="password" name="password" required><br>
            <button type="submit">Register</button>
        </form>
    '''

# Login
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = hash_password(request.form["password"])
        with get_db() as conn:
            user = conn.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password)).fetchone()
        if user:
            session["user"] = username
            flash("✅ เข้าสู่ระบบสำเร็จ", "success")
            return redirect(url_for("index"))
        else:
            flash("❌ username หรือ password ไม่ถูกต้อง", "danger")
    return '''
        <h2>Login</h2>
        <form method="post">
            Username: <input type="text" name="username" required><br>
            Password: <input type="password" name="password" required><br>
            <button type="submit">Login</button>
        </form>
    '''

# Logout
@app.route("/logout")
def logout():
    session.pop("user", None)
    flash("🚪 ออกจากระบบแล้ว", "info")
    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(debug=True)
