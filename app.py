from flask import Flask, redirect, render_template, request, url_for    #import flask class (build web app) from flask library

app = Flask(__name__)
#--------------------------------
#__name__ คือ ตัวระบุว่าโค้ดไฟล์นี้ชื่ออะไร / รันจากไหน
#Flask เอาค่านี้ไปใช้หา ตำแหน่งไฟล์ template และ static ที่อยู่ใน project
#--------------------------------=

@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        # ได้ข้อมูลจาก form เช่น username, password
        username = request.form["username"]
        password = request.form["password"]
        #return f"คุณพยายาม login ด้วย {username}"  #response from server to client
        # ทำงานกับข้อมูล เช่นตรวจสอบ login แล้ว redirect ไป /about
        return redirect(url_for("home", user=username)) #แทนที่จะส่งข้อมูลไป /about แล้วเปลี่ยนหน้า ใช้วิธี redirect ดีกว่าป้องกันการ refresh แล้ว resubmit
    return render_template("login.html")
    # else:
    #     # ถ้าเป็น GET แสดงฟอร์มให้กรอก
    #     return '''
    #         <form method="post">
    #             Username: <input type="text" name="username"><br>
    #             Password: <input type="password" name="password"><br>
    #             <button type="submit">Login</button>
    #         </form>
    #     '''
        
        #--------------------------------
        #ส่งข้อมูลด้วย method post ไปยัง about
        #ไม่แนะนำถ้า user refresh หน้าจะเกิดการ resubmit ต้อง login ซ้ำ/สั่งซื้อซ้ำ
        # return '''
        #     <form action="/about" method="post">
        #         Username: <input type="text" name="username"><br>
        #         Password: <input type="password" name="password"><br>
        #         <button type="submit">Login</button>
        #     </form>
        # '''
        #--------------------------------
        

# @app.route("/about", methods=["POST"])
# def about():
#     return "เสร็จสมบูรณ์"
@app.route("/home")
def home():
    username = request.args.get("user", "Guest")
    # return f"ยินดีต้อนรับ {username}!!!!!!!"
    return render_template("home.html", username=username)

if __name__ == "__main__":
    app.run(debug=True)

# from flask import Flask, request

# app = Flask(__name__)

# @app.route("/", methods=["GET", "POST"])
# def login():
#     username = request.form.get("username")
#     password = request.form.get("password")
#     return f"สวัสดี {username}, login สำเร็จ!"


# if __name__ == "__main__":
#     app.run(debug=True)