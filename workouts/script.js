let choice = []
const workoutdiv = document.getElementById('workout')


function choose(clicked){
    choice = clicked
    renderexcercises()
}

function renderexcercises() {
    workoutdiv.innerHTML = '';
    let i = 0;

    function rendernextexcercise() {
        
        if (i < choice.length){
            workoutdiv.innerHTML = ''
            const excercisediv = document.createElement('div')
            excercisediv.style.borderRadius = '10px'


            const name = document.createElement('h1')
            name.textContent = choice[i].name
            name.className = 'excercisename'
            

            const sets = document.createElement('p')
            sets.textContent = 'Sets: ' + choice[i].sets
            sets.className = 'excercisetext'

            const reps = document.createElement('p')
            reps.textContent = 'Reps: ' + choice[i].reps
            reps.className = 'excercisetext'

            const rest = document.createElement('p')
            rest.textContent = 'Rest: ' + choice[i].rest
            rest.className = 'excercisetext'

            const button = document.createElement('button')
            button.textContent = 'Set Complete'
            button.id = 'setcomplete'
            excercisediv.appendChild(name)
            excercisediv.appendChild(sets)
            excercisediv.appendChild(reps)
            excercisediv.appendChild(rest)
            excercisediv.appendChild(button)
            

            workoutdiv.appendChild(excercisediv)


            let seconds = 0
            let Sets = choice[i].sets;
            
            function clicked(){
                button.style.display = 'none'
                
                seconds = 0;
                minutes = 0;
                const Timer = document.createElement('p')
                Timer.className = 'excercisetext'
                excercisediv.appendChild(Timer)
                const timerinterval = setInterval(timer, 1000);
                function timer() {
                    if (seconds < 10){
                        Timer.textContent = 'Rest Time: 0' + minutes + ':0' + seconds;
                        
                    }else {
                        Timer.textContent = 'Rest Time: 0' + minutes + ':' + seconds;
                    }
                    seconds++
                    if (seconds == 60 ){minutes++;seconds=0}
                    if (minutes == choice[i].rest){
                        clearInterval(timerinterval)
 
                        if (Sets == 1){
                            i++
                            rendernextexcercise()
                        }else{
                            Sets--
                            sets.textContent = Sets
                            Timer.textContent = ''
                            console.log(Sets)
                            button.style.display = 'block'
                        }
                    }
                }
            } 
            button.onclick = () => clicked();
        }
    }

rendernextexcercise()
}

const inclinedb = {
    name: 'Incline Dumbell Press',
    sets: 2,
    reps: '5-9 + 10-15',
    rest: 2
}

const benchpress = {
    name: 'Bench Press',
    sets: 3,
    reps: '10-15',
    rest: 3
}

const cablefly = {
    name: 'Cable Fly',
    sets: 3,
    reps: '10-12',
    rest: 2
}

const pushups = {
    name: 'Push Ups',
    sets: 1,
    reps: 'Failure',
    rest: 2
}

const cablelatraise = {
    name: 'Cable Lat Raise',
    sets: 4,
    reps: 'Failure',
    rest: 2
}

const overheadtricep = {
    name: 'Overhead Tricep Extension',
    sets: 3,
    reps: '8-15',
    rest: 2
}

const tricepushdown = {
    name: 'Tricep Pushdown',
    sets: 2,
    reps: '8-15',
    rest: 2
}

const pusha = [inclinedb,benchpress,cablefly,pushups,cablelatraise,overheadtricep,tricepushdown]

const barbellrow = {
    name: 'Barbell Row',
    sets: 2,
    reps: '5-9 + 10-15',
    rest: 3
}
const latpulldown = {
    name: 'Lat Pulldown',
    sets: 3,
    reps: '10-15',
    rest: 2
}
const seatedrow = {
    name: 'Seated Row',
    sets: 3,
    reps: '8-12',
    rest: 2
}
const cablepullover = {
    name: 'Cable Pullover',
    sets: 2,
    reps: '10-15',
    rest: 2
}
const reardeltflys = {
    name: 'Rear Delt Flys',
    sets: 2,
    reps: '12-15',
    rest: 2
}
const straightbarcurl = {
    name: 'Straight Bar Cable Curl',
    sets: 3,
    reps: '10-15',
    rest: 2
}
const hammercurl = {
    name: 'Hammer Curl',
    sets: 3,
    reps: '8-15',
    rest: 2
}
pulla = [barbellrow,latpulldown,seatedrow,cablepullover,reardeltflys,straightbarcurl,hammercurl]

const squats = {
    name: 'Squats',
    sets: 3,
    reps: '8-12',
    rest: 3
}
const legpress = {
    name: 'Leg Press',
    sets: 3,
    reps: '10-15',
    rest: 3
}
const lunges = {
    name: 'Lunges',
    sets: 4,
    reps: '10-12',
    rest: 2
}
const hamstringcurl = {
    name: 'Hamstring Curl',
    sets: 3,
    reps: '10-15',
    rest: 2
}
const quadextension = {
    name: 'Quad Extension',
    sets: 2,
    reps: '10-15',
    rest: 2
}
const calfraises = {
    name: 'Calf Raises',
    sets: 2,
    reps: 'Failure',
    rest: 2
}
legsa = [squats,legpress,lunges,hamstringcurl,quadextension,calfraises]
