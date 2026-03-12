
const express=require('express')
const sqlite3=require('sqlite3').verbose()
const bodyParser=require('body-parser')
const app=express()

app.use(bodyParser.json())
app.use(express.static('public'))

const db=new sqlite3.Database('database.db')

db.serialize(()=>{

db.run(`CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT,
password TEXT,
role TEXT)`)

db.run(`CREATE TABLE IF NOT EXISTS exercises(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
image TEXT)`)

db.run(`CREATE TABLE IF NOT EXISTS workouts(
id INTEGER PRIMARY KEY AUTOINCREMENT,
workout TEXT,
superset TEXT,
exercise TEXT,
sets INTEGER,
reps INTEGER,
rest TEXT)`)

db.run(`CREATE TABLE IF NOT EXISTS logs(
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER,
exercise TEXT,
reps_done INTEGER,
weight REAL,
date TEXT)`)

db.run(`INSERT OR IGNORE INTO users(username,password,role) VALUES('Fever','2619','admin')`)

})

app.post('/register',(req,res)=>{
const {username,password}=req.body
db.run("INSERT INTO users(username,password,role) VALUES(?,?,?)",[username,password,'client'])
res.send({status:'ok'})
})

app.post('/login',(req,res)=>{
const {username,password}=req.body
db.get("SELECT * FROM users WHERE username=? AND password=?",[username,password],(e,row)=>{
if(!row) return res.send({error:true})
res.send(row)
})
})

app.get('/workouts',(req,res)=>{
db.all("SELECT * FROM workouts",(e,r)=>res.send(r))
})

app.get('/users',(req,res)=>{
db.all("SELECT * FROM users WHERE role='client'",(e,r)=>res.send(r))
})

app.post('/log',(req,res)=>{
const {user_id,exercise,reps_done,weight}=req.body
db.run("INSERT INTO logs(user_id,exercise,reps_done,weight,date) VALUES(?,?,?,?,datetime('now'))",
[user_id,exercise,reps_done,weight])
res.send({status:'saved'})
})

app.get('/progress/:user',(req,res)=>{
db.all("SELECT * FROM logs WHERE user_id=?",[req.params.user],(e,r)=>res.send(r))
})

app.post('/admin/exercise',(req,res)=>{
const {name,image}=req.body
db.run("INSERT INTO exercises(name,image) VALUES(?,?)",[name,image])
res.send({status:'added'})
})

app.post('/admin/workout',(req,res)=>{
const {workout,superset,exercise,sets,reps,rest}=req.body
db.run("INSERT INTO workouts(workout,superset,exercise,sets,reps,rest) VALUES(?,?,?,?,?,?)",
[workout,superset,exercise,sets,reps,rest])
res.send({status:'added'})
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
