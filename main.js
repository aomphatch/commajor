/*
const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");

const mysql = require("mysql2");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();
const bcrypt = require("bcryptjs");
//const bcrypt = require("bcrypt");   //เพิ่ม bcrypt
const nodemailer = require("nodemailer");

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       
  password: "Aom10902", 
  database: "nodejs"
});

//connect to the database
db.connect(function(error){
  if(error) throw error
  else console.log("connect to the database successfully!")
});

const transporter = nodemailer.createTransport({ // ✅ เพิ่มใหม่
  service: "Gmail",
  auth: {
    user: "youremail@gmail.com",          // เปลี่ยนเป็นเมลจริงของคุณ
    pass: "your_app_password"             // ใช้ App Password ของ Gmail
  }
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, "public")));


// express จะทำให้เอาไฟล์ในโฟลเดอร์ static ไปใช้ได้
app.use(express.static(path.join(__dirname, "static")));

// db.connect((err) => {
//   if (err) throw err;
//   console.log("Connected to MySQL");
// });

//เรียก html มาแสดง
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,"index.html"));
})
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname,"pages","login.html"));
})
app.get("/regist", (req, res) => {
  res.sendFile(path.join(__dirname,"pages","regist.html"));
})
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname,"pages","home.html"));
})
app.get("/account", (req, res) => {
  res.sendFile(path.join(__dirname,"pages","account.html"));
})

*/

/*------- ตรวจสอบการล็อกอิน -------*/
/*
app.post("/login", encoder, function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.query("SELECT * FROM loginuser WHERE user_name = ?", [username], async function (error, results, fields) {
    if (error) throw error;

    if (results.length > 0) {
      const match = await bcrypt.compare(password, results[0].user_pass);   // ตรวจ hash
      if (match) {
        res.redirect("/account");
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  });
});
// app.post("/login",encoder, function(req,res){
//   var username = req.body.username;
//   var password = req.body.password;

//   db.query("select * from loginuser where user_name = ? and user_pass = ?",[username,password],function(error,results,fields){
//     if(results.length > 0){
//       res.redirect("/account")
//     }else{
//       res.redirect("/login");
//     }
//     //res.end();
//   })
// })

*/

/*------- ลงทะเบียน-------*/
/*
app.post("/regist", encoder, async function (req, res) {
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;

  db.query("SELECT * FROM loginuser WHERE user_email = ? OR user_name = ?", [email, username], async function (error, results, fields) {
    if (error) throw error;

    if (results.length > 0) {
      res.redirect("/regist");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10); // ✅ เข้ารหัสรหัสผ่าน
      db.query("INSERT INTO loginuser (user_email, user_name, user_pass) VALUES (?,?,?)", [email, username, hashedPassword], function (error, results) {
        if (error) throw error;
        res.redirect("/login");
      });
    }
  });
});
// app.post("/regist",encoder, function(req,res){
//   var email = req.body.email;
//   var username = req.body.username;
//   var password = req.body.password;

//   db.query("select * from loginuser where user_email = ? or user_name = ? ",[email,username],function(error,results,fields){
//     if(results.length > 0){  
//       res.redirect("/regist")
//     }else{
//       db.query("insert into loginuser (user_email, user_name, user_pass) values (?,?,?)",[email,username,password],function(error,results){
//         res.redirect("/login"); 
//       });
//     }
//   });
// })

//when login is success
// app.get("/account",function(req,res){
//   res.sendFile(__dirname + "/account.html")
// })

//ใช้งาน server
app.listen(PORT, ()=> {
  console.log(`Server is running on "http://localhost:${PORT}"`);
});

*/

const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");

//  เพิ่ม dotenv เพื่ออ่านไฟล์ .env
require('dotenv').config();

const mysql = require("mysql2");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();
const bcrypt = require("bcryptjs");

// เปลี่ยนจาก nodemailer เป็น SendGrid Web API
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// เช็คว่ามี API Key หรือไม่
if (!process.env.SENDGRID_API_KEY) {
  console.error('❌ ERROR: SENDGRID_API_KEY not found in .env file');
  process.exit(1);
}

// -------------------- MySQL connection --------------------
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Aom10902",
  database: "nodejs"
});

db.connect(function(error){
  if(error) throw error;
  else console.log("Connect to the database successfully!");
});

// -------------------- Middleware --------------------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "static")));

// -------------------- Routes HTML --------------------
app.get("/", (req, res) => { res.sendFile(path.join(__dirname,"index.html")); });
app.get("/login", (req, res) => { res.sendFile(path.join(__dirname,"pages","login.html")); });
app.get("/regist", (req, res) => { res.sendFile(path.join(__dirname,"pages","regist.html")); });
app.get("/home", (req, res) => { res.sendFile(path.join(__dirname,"pages","home.html")); });
app.get("/account", (req, res) => { res.sendFile(path.join(__dirname,"pages","account.html")); });

// -------------------- Login --------------------
app.post("/login", encoder, async function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.query("SELECT * FROM loginuser WHERE user_name = ?", [username], async function (error, results) {
    if (error) throw error;

    if (results.length > 0) {
      const match = await bcrypt.compare(password, results[0].user_pass);
      if (match) {
        res.redirect("/account");
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  });
});

// -------------------- Register + ส่ง OTP ด้วย SendGrid Web API --------------------
app.post("/regist", encoder, async function (req, res) {
  const { email, username, password } = req.body;

  db.query(
    "SELECT * FROM loginuser WHERE user_email = ? OR user_name = ?",
    [email, username],
    async function (error, results) {
      if (error) throw error;

      if (results.length > 0) {
        res.json({ success: false, message: "Email หรือ Username มีอยู่แล้ว" });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const expireTime = new Date(Date.now() + 5 * 60 * 1000);

        db.query(
          "INSERT INTO otp_verify (email, username, hashed_pass, otp, expire_time) VALUES (?, ?, ?, ?, ?)",
          [email, username, hashedPassword, otp, expireTime],
          async function (err2) {
            if (err2) throw err2;

            // เปลี่ยนจาก nodemailer.sendMail เป็น sgMail.send
            const msg = {
              to: email,
              from: process.env.SENDER_EMAIL, // ✅ ใช้อีเมลจาก .env
              subject: 'OTP สำหรับสมัครสมาชิก',
              text: `รหัส OTP ของคุณคือ: ${otp} (หมดอายุ 5 นาที)`,
              html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                  <h2>ยืนยันการสมัครสมาชิก</h2>
                  <p>รหัส OTP ของคุณคือ:</p>
                  <h1 style="color: #4CAF50; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
                  <p style="color: #666;">รหัสนี้จะหมดอายุภายใน 5 นาที</p>
                </div>
              `
            };

            //  เปลี่ยนจาก callback เป็น async/await
            try {
              await sgMail.send(msg);
              console.log(`✅ ส่ง OTP ไปยัง ${email} สำเร็จ`);
              res.json({ success: true, message: "ส่ง OTP ไปยังอีเมลเรียบร้อยแล้ว" });
            } catch (mailErr) {
              console.error('❌ SendGrid Error:', mailErr.response?.body || mailErr);
              res.json({ 
                success: false, 
                message: "ส่ง OTP ไม่สำเร็จ กรุณาตรวจสอบ API Key และ Sender Email" 
              });
            }
          }
        );
      }
    }
  );
});

// -------------------- Verify OTP --------------------
app.post("/verify", encoder, (req, res) => {
  const { email, otp } = req.body;

  db.query(
    "SELECT * FROM otp_verify WHERE email = ? AND otp = ? AND expire_time > NOW()",
    [email, otp],
    (err, results) => {
      if (err) throw err;

      if (results.length === 0) {
        res.json({ success: false, message: "OTP ไม่ถูกต้องหรือหมดอายุ" });
      } else {
        const { username, hashed_pass } = results[0];

        db.query(
          "INSERT INTO loginuser (user_email, user_name, user_pass) VALUES (?, ?, ?)",
          [email, username, hashed_pass],
          (err2) => {
            if (err2) throw err2;
            db.query("DELETE FROM otp_verify WHERE email = ?", [email]);
            res.json({ success: true, message: "สมัครสมาชิกสำเร็จ" });
          }
        );
      }
    }
  );
});

// -------------------- ใช้งาน server --------------------
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});