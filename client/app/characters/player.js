import Ship from 'sceneObjects/ship';

export default class Player {
  constructor(id, name, ship = {}) {
    this.id = id;
    this.name = name;
    this.kills = 0;
    this.deaths = 0;
    this.ship = new Ship(ship);
    this.target = null;
  }
  pushUpdate(state, time) {
    let history = this.ship.history;

    history.x.push([time, state.pos[0]]);
    history.y.push([time, state.pos[1]]);

    if (history.x.length > 4) history.x.shift();
    if (history.y.length > 4) history.y.shift();

    history.dir = state.angPos[2];

    this.ship.state = Object.assign({}, this.state, state);
  }
}
