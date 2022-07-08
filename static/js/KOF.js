import { GameMap } from "./GameMap.js";
import { kyo } from "./kyo.js";

export class KOF {
  constructor() {
    this.gameMap = new GameMap(this);
    this.player1 = new kyo(this, {
      x: 200,
      y: 0,
      direction: 1,
      id: 0
    });
    this.player2 = new kyo(this, {
      x: 900,
      y: 0,
      direction: 1,
      id: 1
    });
    this.player1.initOtherPlayer();
    this.player2.initOtherPlayer();
    this.gameMap.initPlayer(this.player1, this.player2);
  }

  addPlayers(arr) {
    arr.push(this.player1, this.player2);
  }

  addMap(arr) {
    arr.push(this.gameMap);
  }

}