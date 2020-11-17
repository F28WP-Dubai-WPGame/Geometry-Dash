var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(3000, function () {
  console.log("Server started on http://localhost:3000/");
});

var SOCKET_LIST = {};


function Player(id, startIndex) {
  var self = {
    currentIndex: startIndex,
    id: id,
    number: "" + Math.floor(10 * Math.random()),
    pressingRight: false,
    pressingLeft: false,
    pressingUp: false,
    pressingDown: false,
    width: 37,
  }
  self.updatePosition = function () {
    if (self.pressingRight)
      self.currentIndex += 1;
    if (self.pressingLeft)
      self.currentIndex -= 1;
    if (self.pressingUp)
      self.currentIndex -= self.width;
    if (self.pressingDown)
      self.currentIndex += self.width;
  }
  Player.list[id] = self;
  return self;
}

Player.list = {};
Player.onConnect = function(socket){
  var player = Player(socket.id, 429);
	socket.on('keyPress',function(data){
		if(data.inputId === 'left')
			player.pressingLeft = data.state;
		else if(data.inputId === 'right')
			player.pressingRight = data.state;
		else if(data.inputId === 'up')
			player.pressingUp = data.state;
		else if(data.inputId === 'down')
			player.pressingDown = data.state;
	});
}
Player.onDisconnect = function(socket){
	delete Player.list[socket.id];
}
Player.update = function(){
	var pack = [];
	for(var i in Player.list){
		var player = Player.list[i];
		player.update();
		pack.push({
			x:player.x,
			y:player.y,
			number:player.number
		});		
	}
	return pack;
}


class Ghost {
  constructor(className, startIndex, speed) {
    this.className = className
    this.startIndex = startIndex
    this.speed = speed
    this.currentIndex = startIndex
    this.isScared = false
    this.timerId = NaN
  }
}

ghosts = [
  new Ghost('blinky', 378, 250),
  new Ghost('pinky', 380, 250),
  new Ghost('inky', 452, 250),
  new Ghost('clyde', 454, 250),
  new Ghost('blinky2', 470, 250),
  new Ghost('pinky2', 472, 250),
  new Ghost('inky2', 396, 250),
  new Ghost('clyde2', 398, 250)
]


io.sockets.on('connection', function (socket) {
  
  socket.emit('classghost',ghosts);
  socket.emit('moveGhost', ghosts);
  
  

  socket.id = Math.random();
  SOCKET_LIST[socket.id] = socket;

  socket.on('signIn', function (data) {
    if(data.username === 'bob' && data.password === '123'){
      Player.onConnect(socket);
      socket.emit('signInResponse',{success:true});
    }
    else{
      socket.emit('signInResponse',{success:false});
    }
    
  });


 

  socket.on('disconnect', function () {
    delete SOCKET_LIST[socket.id];
    Player.onDisconnect(socket);
  });



  socket.on('sendMsgToServer', function (data) {
    var playerName = ("" + socket.id).slice(2, 7);
    for (var i in SOCKET_LIST) {
      SOCKET_LIST[i].emit('addToChat', playerName + ': ' + data);
    }
  });

});

setInterval(function () {
  var pack = [];

  for (var i in Player.list) {
    var player = Player.list[i];
    player.updatePosition();
    pack.push({
      currentIndex: player.currentIndex
    })
  }
  for (var i in SOCKET_LIST) {
    var socket = SOCKET_LIST[i];
    socket.emit('newPositions', pack)
  }
}, 1000 / 5)
