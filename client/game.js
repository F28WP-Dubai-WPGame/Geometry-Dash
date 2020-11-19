var socket = io();
var signDiv = document.getElementById('signDiv');
var signDivUsername = document.getElementById('signDiv-username');
var signDivSignIn = document.getElementById('signDiv-signIn');
var signDivSignUp = document.getElementById('signDiv-signUp');
var signDivPassword = document.getElementById('signDiv-password');

signDivSignIn.onclick = function(){
  socket.emit('signIn',{username:signDivUsername.value,password:signDivPassword.value});
}

signDivSignUp.onclick = function(){
  socket.emit('signUp',{username:signDivUsername.value,password:signDivPassword.value});
}

socket.on('signInResponse',function(data){
  if(data.success){
    signDiv.style.display = 'none';
    gamestuff.style.display = 'inline-block';
  } else
    alert("Sign in unsuccessful.");
});

socket.on('signUpResponse',function(data){
  if(data.success){
    alert("Sign up successful.");
  } else
    alert("Sign up unsuccessful.");
});

let pacmanCurrentIndex;
const width = 37;
const grid = document.querySelector('.grid')
const layout = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
  1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 2, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1,
  1, 7, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 7, 1,
  1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
  1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 7, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1,
  1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1,
  1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1,
  0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0,
  0, 0, 0, 1, 2, 1, 2, 1, 9, 1, 9, 1, 2, 1, 2, 1, 0, 0, 0, 0, 0, 1, 2, 1, 2, 1, 9, 1, 9, 1, 2, 1, 2, 1, 0, 0, 0,
  1, 1, 1, 1, 2, 1, 2, 9, 9, 9, 9, 9, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 9, 9, 9, 9, 9, 2, 1, 2, 1, 1, 1, 1,
  0, 2, 2, 2, 2, 2, 2, 1, 9, 9, 9, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 9, 9, 9, 1, 2, 2, 2, 2, 2, 2, 0,
  1, 1, 1, 1, 2, 1, 2, 9, 9, 9, 9, 9, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 9, 9, 9, 9, 9, 2, 1, 2, 1, 1, 1, 1,
  0, 0, 0, 1, 2, 1, 2, 1, 9, 1, 9, 1, 2, 1, 2, 1, 0, 0, 0, 0, 0, 1, 2, 1, 2, 1, 9, 1, 9, 1, 2, 1, 2, 1, 0, 0, 0,
  0, 0, 0, 1, 2, 1, 2, 0, 0, 0, 0, 0, 2, 1, 2, 1, 0, 0, 0, 0, 0, 1, 2, 1, 2, 0, 0, 0, 0, 0, 2, 1, 2, 1, 0, 0, 0,
  1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1,
  1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1,
  1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 7, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1,
  1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
  1, 7, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 7, 1,
  1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 2, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1,
  1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,];

let squares = []
function createBoard() {
  for (let i = 0; i < layout.length; i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
    squares.push(square)

    //add layout to the board
    if (layout[i] === 2) {
      squares[i].classList.add('pac-dot')
    } else if (layout[i] === 1) {
      squares[i].classList.add('wall')
    } else if (layout[i] === 9) {
      squares[i].classList.add('ghost-lair')
    } else if (layout[i] === 7) {
      squares[i].classList.add('power-pellet')
    } else {
      squares[i].classList.add('blank')
    }
  }
}
createBoard();

socket.on('classghost', function(ghosts){
  ghosts.forEach(ghost => {
    squares[ghost.currentIndex].classList.add(ghost.className)
    squares[ghost.currentIndex].classList.add('ghost')
  })
});

socket.on('moveGhost', function (ghosts){
  ghosts.forEach(ghost => {
    const directions = [-1, +1, width, -width]
    let direction = directions[Math.floor(Math.random() * directions.length)]
  
    ghost.timerId = setInterval(function () {
      //if the next squre your ghost is going to go to does not have a ghost and does not have a wall
      if (!squares[ghost.currentIndex + direction].classList.contains('ghost') &&
        !squares[ghost.currentIndex + direction].classList.contains('wall')) {
        //remove the ghosts classes
        squares[ghost.currentIndex].classList.remove(ghost.className)
        squares[ghost.currentIndex].classList.remove('ghost', 'scared')
        //move into that space
        ghost.currentIndex += direction
        squares[ghost.currentIndex].classList.add(ghost.className, 'ghost')
        //else find a new random direction ot go in
      } else direction = directions[Math.floor(Math.random() * directions.length)]
     }, ghost.speed)
  })
});
// function moveGhost(ghost) {
//   const directions = [-1, +1, width, -width]
//   let direction = directions[Math.floor(Math.random() * directions.length)]

//   ghost.timerId = setInterval(function () {
//     //if the next squre your ghost is going to go to does not have a ghost and does not have a wall
//     if (!squares[ghost.currentIndex + direction].classList.contains('ghost') &&
//       !squares[ghost.currentIndex + direction].classList.contains('wall')) {
//       //remove the ghosts classes
//       squares[ghost.currentIndex].classList.remove(ghost.className)
//       squares[ghost.currentIndex].classList.remove('ghost', 'scared')
//       //move into that space
//       ghost.currentIndex += direction
//       squares[ghost.currentIndex].classList.add(ghost.className, 'ghost')
//       //else find a new random direction ot go in
//     } else direction = directions[Math.floor(Math.random() * directions.length)]
//   }, ghost.speed)
// }

socket.on('newPositions', function (data) {
  for (var i = 0; i < data.length; i++) {
    for (let j = 0; j < layout.length; j++) {
      if (squares[j].classList.contains('pacman')) {
        squares[j].classList.remove('pacman')
      }
    }
    squares[data[i].currentIndex].classList.add('pacman')
    pacmanCurrentIndex = data[i].currentIndex;
  }
});

document.onkeydown = function (event) {
   squares[pacmanCurrentIndex].classList.remove('pacman')

  //left
  if (event.keyCode === 37){
    if(layout[pacmanCurrentIndex - 1]===2 || layout[pacmanCurrentIndex - 1]===7){
      socket.emit('keyPress', { inputId: 'right', state: false });
      socket.emit('keyPress', { inputId: 'left', state: false });
      socket.emit('keyPress', { inputId: 'down', state: false });
      socket.emit('keyPress', { inputId: 'left', state: true });
    }
    else{
      socket.emit('keyPress', { inputId: 'left', state: false });
    }
  }
  //up
  else if (event.keyCode === 38){
    if(layout[pacmanCurrentIndex - width]===2 || layout[pacmanCurrentIndex - width]===7){
      socket.emit('keyPress', { inputId: 'right', state: false });
      socket.emit('keyPress', { inputId: 'left', state: false });
      socket.emit('keyPress', { inputId: 'down', state: false });
      socket.emit('keyPress', { inputId: 'up', state: true });
    }
    else{
      socket.emit('keyPress', { inputId: 'up', state: false });
    }
  }

    
  //right
  else if (event.keyCode === 39){
    if(layout[pacmanCurrentIndex + 1]===2 || layout[pacmanCurrentIndex + 1]===7){
      socket.emit('keyPress', { inputId: 'up', state: false });
      socket.emit('keyPress', { inputId: 'left', state: false });
      socket.emit('keyPress', { inputId: 'down', state: false });
      socket.emit('keyPress', { inputId: 'right', state: true });
      if (squares[pacmanCurrentIndex - 1] === squares[443]) {
        pacmanCurrentIndex = 406
      }
    }
    else{
      socket.emit('keyPress', { inputId: 'right', state: false });
    }

  }
  //down
  else if (event.keyCode === 40){
    if(layout[pacmanCurrentIndex + width]===2 || layout[pacmanCurrentIndex + width]===7){
      socket.emit('keyPress', { inputId: 'up', state: false });
      socket.emit('keyPress', { inputId: 'left', state: false });
      socket.emit('keyPress', { inputId: 'right', state: false });
      socket.emit('keyPress', { inputId: 'down', state: true });
    }
    else{
      socket.emit('keyPress', { inputId: 'down', state: false });
    }
  }


    

}
document.onkeyup = function (event) {
  //left
  if (event.keyCode === 37){
    socket.emit('keyPress', { inputId: 'left', state: false });
  }
  //up
  else if (event.keyCode === 38)
    socket.emit('keyPress', { inputId: 'up', state: false });
  //right
  else if (event.keyCode === 39)
    socket.emit('keyPress', { inputId: 'right', state: false });
  //down
  else if (event.keyCode === 40)
    socket.emit('keyPress', { inputId: 'down', state: false });

}