const blankspace = document.getElementById('1').src 
let i = 1
let gameended = false

function textboard(){
    const board = []
    for(let square = 1;square<10;square++){
        if (document.getElementById(square).src == blankspace){
            board.push('b')
        }else if(document.getElementById(square).src == x){
            board.push('x')
        }else if(document.getElementById(square).src == o){
            board.push('o')
        }
    }
    return(board)
}

function winconx(board){
    if(board[0] == 'x' & board[1] == 'x' & board[2] == 'x'){
        return true
    }else if(board[3] == 'x' & board[4] == 'x' & board[5] == 'x'){
        return true
    }else if(board[6] == 'x' & board[7] == 'x' & board[8] == 'x'){
        return true
    }else if(board[0] == 'x' & board[3] == 'x' & board[6] == 'x'){
        return true
    }else if(board[1] == 'x' & board[4] == 'x' & board[7] == 'x'){
        return true
    }else if(board[2] == 'x' & board[5] == 'x' & board[8] == 'x'){
        return true
    }else if(board[0] == 'x' & board[4] == 'x' & board[8] == 'x'){
        return true
    }else if(board[2] == 'x' & board[4] == 'x' & board[6] == 'x'){
        return true
    }else{
        return false
    }
}

function wincono(board){
    if(board[0] == 'o' & board[1] == 'o' & board[2] == 'o'){
        return true
    }else if(board[3] == 'o' & board[4] == 'o' & board[5] == 'o'){
        return true
    }else if(board[6] == 'o' & board[7] == 'o' & board[8] == 'o'){
        return true
    }else if(board[0] == 'o' & board[3] == 'o' & board[6] == 'o'){
        return true
    }else if(board[1] == 'o' & board[4] == 'o' & board[7] == 'o'){
        return true
    }else if(board[2] == 'o' & board[5] == 'o' & board[8] == 'o'){
        return true
    }else if(board[0] == 'o' & board[4] == 'o' & board[8] == 'o'){
        return true
    }else if(board[2] == 'o' & board[4] == 'o' & board[6] == 'o'){
        return true
    }else{
        return false
    }
}

function myFunction(value, index, array) {
    return value == 'b';
}

function tiecon(board){
    if(board.find(myFunction) === undefined){
        return true
    }else{
        return false
    }
}

function place(element){
    if(gameended == false){
        if(element.src == blankspace){
            if((i%2) != 0){
                element.src='ex.jpg'
                x = element.src
                if(winconx(textboard())==true){alert('X has won!');gameended=true}else if(tiecon(textboard())==true){alert('The game is a tie...')}
            }else{
                element.src='oh.jpg'
                o = element.src
                if(wincono(textboard())==true){alert('O has won!');gameended=true}else if(tiecon(textboard())==true){alert('The game is a tie...')}
            }
            i++
            console.log(i)

        }else{
            alert('You can only place a blank space')
        }

    }else{
        alert('Game already ended')
    }
}

function restart(){
    gameended = false
    for(p=1;p<10;p++){
        document.getElementById(p).src = blankspace
    }
}