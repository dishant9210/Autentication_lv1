import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "9354797837Dd@",
  port: 5432,
});
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  let email = req.body.username;
  let password = req.body.password;
  try {
    const result = await db.query("SELECT * FROM USERS WHERE USERNAME = $1",[email]);
    if (result.rows.length>0) {
      res.send("user already exists")
    }else{
      await db.query("INSERT INTO USERS(USERNAME , PASSWORD) VALUES($1 , $2) " ,[email,password]);
      res.render("secrets.ejs");
    }
  } catch (error) {
    console.log(error);
  }
 
  
});

app.post("/login", async (req, res) => {
  let email = req.body.username;
  let password = req.body.password;
  try {

    const result = await db.query("SELECT password FROM USERS WHERE USERNAME= $1",[email]);
    if (result.rows.length>0) {
      const storedPassword = result.rows[0].password;
      console.log(storedPassword);
      if (password == storedPassword) {
        res.render("secrets.ejs");
      } else{
        res.send("wrong password");
      }
    } else {
      res.send("username does not exists");
    }
  
  } catch (error) {
    console.log(error);
  }
 
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
