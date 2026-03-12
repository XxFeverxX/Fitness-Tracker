
const API=""

async function login(){
let username=u.value
let password=p.value
let r=await fetch(API+'/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})})
let d=await r.json()
if(d.role=='admin') location='admin.html'
else location='dashboard.html'
localStorage.user=d.id
}

async function register(){
await fetch(API+'/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u.value,password:p.value})})
alert('registered')
}

async function loadWorkouts(){
let r=await fetch(API+'/workouts')
let w=await r.json()
let div=document.getElementById('workouts')
w.forEach(x=>{
div.innerHTML+=`
<div>
<b>${x.workout} ${x.superset}</b> - ${x.exercise} (${x.sets}x${x.reps})
<input id='r${x.id}' placeholder='reps'>
<input id='w${x.id}' placeholder='weight'>
<button onclick="log('${x.exercise}',${x.id})">save</button>
</div>`
})
}

async function log(ex,id){
await fetch(API+'/log',{method:'POST',headers:{'Content-Type':'application/json'},
body:JSON.stringify({user_id:localStorage.user,exercise:ex,reps_done:document.getElementById('r'+id).value,weight:document.getElementById('w'+id).value})})
}

async function addExercise(){
await fetch(API+'/admin/exercise',{method:'POST',headers:{'Content-Type':'application/json'},
body:JSON.stringify({name:name.value,image:img.value})})
}

async function addWorkout(){
await fetch(API+'/admin/workout',{method:'POST',headers:{'Content-Type':'application/json'},
body:JSON.stringify({workout:workout.value,superset:superset.value,exercise:exercise.value,sets:sets.value,reps:reps.value,rest:rest.value})})
}

if(document.getElementById('workouts')) loadWorkouts()
