import { GameObject } from "./GameObject.js";

export class Player extends GameObject {
  constructor(root, info) {
    super();
    this.x = info.x;
    this.y = info.y;
    this.id = info.id;
    this.ctx = root.gameMap.ctx;
    this.keys = root.gameMap.keys;
    this.$canvas = root.gameMap.$canvas;
    this.root = root;
    this.animations = new Map();
    this.status = 3; // 0: idle, 1: 向前，2：向后，3：跳跃，4：攻击，5：被打，6：死亡
    this.direction = info.direction;
    this.frame_current_cnt = 0;
    this.vx = 0;
    this.vy = 0;
    this.width = 120;
    this.speedx = 400;  // 水平速度
    this.speedy = -1000;  // 跳起的初始速度
    this.gravity = 4000;

    this.hp = 100;
    this.died = false;
  }

  initOtherPlayer() {
    if (this.id === 0) {
      this.otherPlayer = this.root.player2;
    } else {
      this.otherPlayer = this.root.player1;
    }
  }

  start() {

  }

  updateHealth() {
    if (this.hp <= 0 && !this.died) {
      this.status = 6;
      this.frame_current_cnt = 0;
      this.vx = 0;
      this.died = true;
    }
  }

  update_direction() {
    if (this.status === 6) return;

    let me = this, you = this.otherPlayer;
    if (me.x < you.x) me.direction = 1;
    else me.direction = -1;
  }

  is_attack() {
    if (this.status === 6) return;

    this.status = 5;
    this.frame_current_cnt = 0;

    this.hp = Math.max(this.hp - 10, 0);

    // this.$hp_div.animate({
    //   width: this.$hp.parent().width() * this.hp / 100
    // }, 300);
    // this.$hp.animate({
    //   width: this.$hp.parent().width() * this.hp / 100
    // }, 600);

    if (this.hp <= 0) {
      this.status = 6;
      this.frame_current_cnt = 0;
      this.vx = 0;
    }
  }

  is_collision(r1, r2) {
    if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2))
      return false;
    if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2))
      return false;
    return true;
  }

  updateAttack() {
    if (this.status === 4 && this.frame_current_cnt === 18) {
      let me = this, you = this.otherPlayer;
      let r1;
      if (this.direction > 0) {
        r1 = {
          x1: me.x + 120,
          y1: me.y + 40,
          x2: me.x + 120 + 100,
          y2: me.y + 40 + 20,
        };
      } else {
        r1 = {
          x1: me.x + me.width - 120 - 100,
          y1: me.y + 40,
          x2: me.x + me.width - 120 - 100 + 100,
          y2: me.y + 40 + 20,
        };
      }

      let r2 = {
        x1: you.x,
        y1: you.y,
        x2: you.x + you.width,
        y2: you.y + you.height
      };

      if (this.is_collision(r1, r2)) {
        you.is_attack();
      }
    }
  }

  updateMove() {
    this.vy += this.gravity * this.timeDelta / 1000;

    this.x += this.vx * this.timeDelta / 1000;
    this.y += this.vy * this.timeDelta / 1000;
    if (this.y > 450) {
      this.y = 450;
      if (this.status === 3) {
        this.status = 0;
      }
    }

    if (this.x + this.width > this.$canvas.width()) {
      this.x = this.$canvas.width() - this.width;
    } else if (this.x < 0) {
      this.x = 0;
    }
  }

  updateState() {
    let w, d, s, a, space;
    if (this.id === 0) {
      w = this.keys.has('w');
      d = this.keys.has('d');
      a = this.keys.has('a');
      space = this.keys.has(' ');
    } else {
      w = this.keys.has('ArrowUp');
      a = this.keys.has('ArrowLeft');
      d = this.keys.has('ArrowRight');
      space = this.keys.has('Enter');
    }
    if (this.status === 0 || this.status === 1) {
      if (space) {
        this.status = 4;
        this.vx = 0;
        this.frame_current_cnt = 0;
      } else if (w) {
        if (d) {
          this.vx = this.speedx;
        } else if (a) {
          this.vx = -this.speedx;
        } else {
          this.vx = 0;
        }
        this.vy = this.speedy;
        this.status = 3;
        this.frame_current_cnt = 0;
      } else if (d) {
        this.vx = this.speedx;
        this.status = 1;
      } else if (a) {
        this.vx = -this.speedx;
        this.status = 1;
      } else {
        this.vx = 0;
        this.status = 0;
      }
    }
  }

  update() {
    this.updateHealth();
    this.updateState();
    this.updateMove();
    this.updateAttack();
    this.update_direction();
    this.move();
  }

  move() {
    let status = this.status;
    if (this.status === 1 && this.direction * this.vx < 0) status = 2;
    let obj = this.animations.get(status);

    if (obj && obj.loaded) {
      if (this.direction > 0) {
        let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
        let image = obj.gif.frames[k].image;
        this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);

      } else {
        this.ctx.save();
        this.ctx.scale(-1, 1);
        this.ctx.translate(-this.$canvas.width(), 0);
        let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
        let image = obj.gif.frames[k].image;
        // this.width = image.width;
        this.ctx.drawImage(image, this.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);

        this.ctx.restore();
      }
    }

    if (this.status === 4 || this.status === 5 || this.status === 6) {
      if (this.frame_current_cnt == obj.frame_rate * (obj.frame_cnt - 1)) {
        if (this.status === 6) {
          this.frame_current_cnt--;
        } else {
          this.status = 0;
        }
      }
    }
    this.frame_current_cnt++;
  }
}