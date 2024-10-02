const plus = document.getElementById('+')
const minus = document.getElementById('-')
const times = document.getElementById('x')
const divide = document.getElementById('/')
const equals = document.getElementById('=')
const clear = document.getElementById('clear')

let string = ''
let displaystring = ''
let answer = false

// const test = '+23,45'
// const testsliced = test.slice(1)
// const split = testsliced.split(',')
// console.log(typeof(split))
// console.log(split)
// console.log(Number(split[0]))
const placeholder = document.getElementById('placeholder')

for (let i=0;i<10;i++){
    document.getElementById(i).onclick = () =>{
        let input = document.getElementById(i).textContent
        if (answer == false){
            placeholder.style.display = 'none'
            string = string + input
            displaystring = displaystring + input
            console.log(string)
    }
    }
}


plus.onclick = () => {
    if (string[string.length - 1] != ','){
        string = '+' + string + ','
        displaystring = displaystring + ' + '
        console.log(string)
        answer = false
    }
}

minus.onclick = () => {
    if (string[string.length - 1] != ','){
    string = '-' + string + ','
    displaystring = displaystring + ' - '
    answer = false
    }
}

times.onclick = () => {
    if (string[string.length - 1] != ','){
    string = '*' + string + ','
    displaystring = displaystring + ' x '
    answer = false
    }
}

divide.onclick = () => {
    if (string[string.length - 1] != ','){
    string = '/' + string + ','
    displaystring = displaystring + ' / '
    answer = false
    }
}

equals.onclick = () => {
    let result = eval()
    string = result
    displaystring = result
    console.log(displaystring)
    answer = true
    console.log(result)
}

function eval(){
    const numbers = string.slice(1)
    let numobj = numbers.split(',')
    let n1 = Number(numobj[0])
    let n2 = Number(numobj[1])
    if (string[0] == '+'){
        result = n1 + n2
    }else if(string[0] == '-'){
        result = n1 - n2
    }else if(string[0] == '*'){
        result = n1 * n2
    }else if(string[0] == '/'){
        result = n1 / n2
    }
    if (result % 1 != 0){
        return result.toFixed(10)
    }else{
        return result
    }
}

const interval = setInterval(render,100)

const display = document.getElementById('display')

function render(){
    display.textContent=displaystring
}

clear.onclick = () => {
    string = ''
    displaystring = ''
    answer = false
    placeholder.style.display = 'block'
}
