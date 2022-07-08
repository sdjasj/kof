import { GameObject } from "./GameObject.js";

export class GameMap extends GameObject {
  constructor(root) {
    super();
    this.$canvas = $('<canvas width="1280" height="720" tabindex=0></canvas>');
    this.ctx = this.$canvas[0].getContext('2d');
    this.$div.append(this.$canvas);
    this.$canvas.focus();
    this.keys = new Set();
    this.$hp1 = $('#hp1>.realHp');
    this.$hp2 = $('#hp2>.realHp');
    this.time = 120;
    this.$time = $('#time>.timeNumber');
    this.cnt = 0;
  }

  initPlayer(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
  }

  start() {
    let outer = this;
    this.$canvas.keydown(function (e) {
      outer.keys.add(e.key);

    });

    this.$canvas.keyup(function (e) {
      outer.keys.delete(e.key);
    });
  }

  update() {
    this.updateHealth();
    if (this.time >= 0) {
      this.updateTime();
    } else {
      this.player1.hp = -1;
      this.player2.hp = -1;
    }
    this.clear();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  updateHealth() {
    this.$hp1.css("width", `${this.player1.hp}%`);
    this.$hp2.css("width", `${this.player2.hp}%`);
  }

  updateTime() {
    if (this.cnt === 0) {
      this.$time.text(`${this.time}`);
      this.time--;
      this.cnt = 60;
    }
    this.cnt--;
  }
}