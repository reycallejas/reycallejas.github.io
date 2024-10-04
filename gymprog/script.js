const benchdiv = document.getElementById('benchpress');
const squatdiv = document.getElementById('squats');
const selectdiv = document.getElementById('select');
const formdiv = document.getElementById('form');
const ctx = document.getElementById('chart').getContext('2d');

let chart;

// localStorage.removeItem('squats')

benchdiv.onmouseover = () => {
    benchdiv.style.background = '#e3c428ba';
}
benchdiv.onmouseleave = () => {
    benchdiv.style.background = 'rgba(178, 178, 178, 0.491)';
}

squatdiv.onmouseover = () => {
    squatdiv.style.background = '#e3c428ba';
}
squatdiv.onmouseleave = () => {
    squatdiv.style.background = 'rgba(178, 178, 178, 0.491)';
}

benchdiv.onclick = async() => {
    console.log('Bench Press clicked');
    let data = await loadata('bench');
    console.log(data)
    data = await form(data)
    console.log(data)
    if(data){
        localStorage.setItem('bench',JSON.stringify(data))
    }
}

function loadata(key) {
    try{
        let data = localStorage.getItem(key);
        if (data === null) {
            return {
                weight: [],
                reps: [],
                sets: [],
                day: []
            }
        }
        return(JSON.parse(data));
    } catch (error){
        return {
            weight: [],
            reps: [],
            sets: [],
            day: []
        }
    }
}

function form(data) {
    const title = document.createElement('h1')
    title.textContent = "Track today's workout."
    formdiv.appendChild(title)
    const showdiv = document.getElementById('showdiv')


    selectdiv.style.display = 'none';
    const weightq = document.createElement('p')
    weightq.textContent = 'Weight (kg):'
    const weightform = document.createElement('input');
    weightform.type = 'number';


    formdiv.appendChild(weightq);
    formdiv.appendChild(weightform);

    const repsq = document.createElement('p')
    repsq.textContent = 'Reps:'
    const repsform = document.createElement('input');
    repsform.type = 'number';
    formdiv.appendChild(repsq);
    formdiv.appendChild(repsform);

    const setsq = document.createElement('p')
    setsq.textContent = 'Sets:'
    const setsform = document.createElement('input');
    setsform.type = 'number';
    formdiv.appendChild(setsq);
    formdiv.appendChild(setsform);

    const lb = document.createElement('br')
    formdiv.appendChild(lb)

    const buttondiv = document.getElementById('buttons')
    
    const backbutton = document.createElement('button')
    backbutton.textContent = 'Back'
    backbutton.id = 'backbutton'
    buttondiv.appendChild(backbutton)
    backbutton.onclick = () => {
        selectdiv.style.display = 'block';
        formdiv.innerHTML = '';
        buttondiv.innerHTML = '';
        showdiv.innerHTML = '';
        chart.destroy();
    }

    const showbutton = document.createElement('button')
    showbutton.textContent = 'Show Data'
    showbutton.id = 'showbutton'
    buttondiv.appendChild(showbutton)

    showbutton.onclick = () => {
        console.log(data)
        showdiv.innerHTML = ''
        let weightstring = 'Weight: '
        for (i = 0; i < data.weight.length; i++){
            if (i == (data.weight.length - 1)){
            weightstring += data.weight[i]
            } else {
                weightstring += data.weight[i] + ' - '
            }
        }
        const weightext = document.createElement('p')
        weightext.textContent = weightstring
        showdiv.appendChild(weightext)

        let repstring = 'Reps: '
        for (i = 0; i < data.reps.length; i++){
            if (i == (data.reps.length - 1)){
                repstring += data.reps[i]
            }else{
                repstring += data.reps[i] + ' - '
            }
        }
        const reptext = document.createElement('p')
        reptext.textContent = repstring
        showdiv.appendChild(reptext)

        let setstring = 'Sets: '
        for (i = 0; i < data.sets.length; i++){
            if (i == (data.sets.length - 1)){
                setstring += data.sets[i]
            }else{
                setstring += data.sets[i] + ' - '
            }
        }
        const setext = document.createElement('p')
        setext.textContent = setstring
        showdiv.appendChild(setext)

        const weightGraphButton = document.createElement('button')
        weightGraphButton.textContent = 'Weight Graph'
        weightGraphButton.id = 'weightGraphButton'
        weightGraphButton.onclick = () => {
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.day,
                    datasets: [{
                        label: 'Weight',
                        data: data.weight,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
            });
        }
        showdiv.append(weightGraphButton)

    }

    const submit = document.createElement('button');
    submit.textContent = 'Submit'
    submit.id = 'submitbutton'
    buttondiv.appendChild(submit);



    return new Promise((resolve) => {
        submit.onclick = () => {
            if (weightform.value && repsform.value && setsform.value){
                formdiv.innerHTML = 'Submitted.'
                showdiv.innerHTML = '';
                chart.destroy()
                data.weight.push(weightform.value);
                data.reps.push(repsform.value);
                data.sets.push(setsform.value);

                if (data.day.length == 0){
                    data.day.push(1)
                }else{
                    data.day.push(data.day[data.day.length - 1] + 1)
                }

                weightform.value = '';
                setsform.value = '';
                repsform.value = '';
                resolve(data);
            }else{
                alert('Please fill out all fields')
            }
        }  
    })

}

squatdiv.onclick = async() => {
    let data = await loadata('squats');
    console.log(data)
    data = await form(data)
    console.log(data)
    localStorage.setItem('squats',JSON.stringify(data))
}













testdata = {
    weight: [80,80,85,85,90,95],
    sets: [1,1,1,2,1,2],
    reps: [8,12,8,12,8,8],
    day: [1,2,3,4,5,6]
}

// const chart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         labels: testdata.day,
//         datasets: [{
//             label: 'Weight',
//             data: testdata.weight,
//             backgroundColor: 'rgba(255, 99, 132, 0.2)',
//             borderColor: 'rgba(255, 99, 132, 1)',
//             borderWidth: 1
//         }]
//     }
// });

