import { KOF } from "./KOF.js";

let updateList = [];

let kof = new KOF();

kof.addMap(updateList);
kof.addPlayers(updateList);

let lastTime = 0;
let step = (timestape) => {
  let timeDelta = timestape - lastTime;
  for (let ele of updateList) {
    if (!ele.hasStarted) {
      ele.hasStarted = true;
      ele.start();
    } else {
      ele.setTimeDelta(timeDelta);
      ele.update();
    }
  }
  lastTime = timestape;
  requestAnimationFrame(step);
}

requestAnimationFrame(step);