'use strict';

let express = require('express');
let app = express();
let server = require('http').Server(app);
let sockets = require('socket.io')(server);
let Clock = require('./clock');
let gameClock = new Clock();
let raf = require('raf');


server.listen(8000);

app.use(express.static(`${__dirname}/dist`));

console.log('kicking off app at: 8000');

let Players = require('./players');

sockets.on('connection', (socket) => {
  // Setup
  let player = Players.addPlayer('Player');
  let otherPlayers = [];
  let playerClock = new Clock();

  Players.forEach(otherPlayer => {
    console.log(player.id !== otherPlayer.id);
    if (otherPlayer.id !== player.id) {
      otherPlayers.push(otherPlayer.toEmit);
    }
  });
  socket.emit('init', { user: player.toEmit, players: otherPlayers });
  socket.broadcast.emit('addPlayer', player.toEmit);

  socket.on('PING', ping => {
    socket.emit('PONG', {
      clientSentTime: ping.time,
      serverSentTime: new Date().getTime(),
    });
  });

  socket.on('inputSeq', inputSeq => {
    let input = inputSeq.input;
    player.input = input;
    player.ship.clientState = inputSeq.state;
    player.handleUpdate(inputSeq);
  });

  socket.on('disconnect', () => {
    sockets.emit('removePlayer', player.id);
    Players.remove(player.id);
  });
});

const tick = () => {
  let update = {
    time: new Date().getTime(),
    players: []
  };
  let delta = gameClock.getDelta();
  Players.forEach(player => {
    player.updatePosition(delta);
    update.players.push(player.toEmit);
  });
  sockets.emit('gameUpdate', update);

  raf(tick);
};
tick();
