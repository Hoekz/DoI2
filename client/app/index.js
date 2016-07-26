import SCENE from 'scene';
import Players from 'characters/players';
import socket from 'helpers/socket';
import lag from 'helpers/lag';
import Clock from 'helpers/clock';
const clock = new Clock();
const user = Players.user;

const tick = () => {
  // Get time delta
  let delta = clock.getDelta();
  let time = new Date().getTime();

  // Handle Input
  Players.user.handleInput(delta);

  // Update User Positions

  // Update Player Positions
  Players.forEach(player => player.ship.extrapPosition(delta, time));

  // Update the Scene
  SCENE.update();

  // Loop
  requestAnimationFrame(tick);
};


socket.on('init', (data) => {
  Players.addUser(data.user.id, data.user.name, data.user.ship);
  SCENE.target = Players.user.ship.sceneObject;
  for (let player of data.players) {
    Players.addPlayer(player.id, player.name, player.ship);
  }

  tick();

  socket.on('addPlayer', (player) => {
    console.log('adding');
    if (Players.getPlayer(player.id) !== undefined) {
      Players.remove(player.id);
    }
    Players.addPlayer(player.id, player.name, player.ship, false);
  });

  socket.on('removePlayer', (id) => {
    Players.remove(id);
  });

  socket.on('gameUpdate', update => {
    let time = update.time + lag.offset;
    for (let player of update.players) {
      if (player.id === Players.user.id) {
        Players.user.handleUpdate(player);
        continue;
      }
      if (Players.getPlayer(player.id) === undefined) {
        console.log('adding');
        Players.addPlayer(player.id, player.name, player.ship, false);
        continue;
      }
      Players.getPlayer(player.id).pushUpdate(player.ship.state, time);
    }
  });
});
