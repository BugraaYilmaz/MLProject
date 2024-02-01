const canv = document.querySelector('#canv');
const ctx = canv.getContext('2d');
let latestAnimationRequest;
let newRoad;
window.onload = () => {
  canv.height = window.innerHeight;
  canv.width = window.innerWidth;
  newRoad = new Road(300, 5, canv.width / 3, ctx);
  const carF = new Car(
    80,
    160,
    canv.width,
    canv.height,
    'white',
    canv.width / 3 - 80 / 2,
    canv.height / 1.2,
    ctx
  );
  carF.animate();
};
window.addEventListener('resize', () => {
  cancelAnimationFrame(latestAnimationRequest);
  canv.height = window.innerHeight;
  canv.width = window.innerWidth;
  newRoad = new Road(300, 5, canv.width / 3, ctx);
  const carF = new Car(
    80,
    160,
    canv.width,
    canv.height,
    'white',
    canv.width / 3,
    canv.height / 1.2,
    ctx
  );
  carF.animate();
});

class Car {
  #carWidth;
  #carHeight;
  #canvasWidth;
  #canvasHeight;
  #carColor;
  #carStartPosX;
  #carStartPosY;
  #ctx;
  keyControls;
  constructor(
    crWidth,
    crHeight,
    caWidth,
    caHeight,
    carColor,
    carPosX,
    carPosY,
    ctx
  ) {
    this.#ctx = ctx;
    this.#carWidth = crWidth;
    this.#carHeight = crHeight;
    this.#canvasWidth = caWidth;
    this.#canvasHeight = caHeight;
    this.#carStartPosX = carPosX;
    this.#carStartPosY = carPosY;
    this.#carColor = carColor;
    this.#ctx.fillStyle = carColor;
    this.#ctx.strokeStyle = carColor;
    this.keyControls = new keyControlHandler();

    this.speed = 0;
    this.acceleration = 1;
    this.friction = 0.25;
    this.maxSpeed = 20;
    this.angle = 0;
  }

  #draw() {
    this.#ctx.fillStyle = this.#carColor;
    this.#ctx.save();
    this.#ctx.translate(
      this.#carStartPosX + this.#carWidth / 2,
      this.#carStartPosY - this.#carHeight / 2
    );
    this.#ctx.rotate(this.angle);
    this.#ctx.beginPath();
    this.#ctx.moveTo(-this.#carWidth / 2, -this.#carHeight / 2);
    this.#ctx.lineTo(this.#carWidth / 2, -this.#carHeight / 2);
    this.#ctx.lineTo(this.#carWidth / 2, this.#carHeight / 2);
    this.#ctx.lineTo(-this.#carWidth / 2, this.#carHeight / 2);
    this.#ctx.lineTo(-this.#carWidth / 2, -this.#carHeight / 2);
    this.#ctx.closePath();
    this.#ctx.fill();
    this.#ctx.restore();
  }
  animate() {
    this.#ctx.clearRect(0, 0, this.#canvasWidth, this.#canvasHeight);
    this.#ctx.save();
    this.#ctx.translate(0,-this.#carStartPosY+this.#canvasHeight*0.9);
    newRoad.drawRoad();
    this.#carMovement();
    this.#draw();
    this.#ctx.restore();
    latestAnimationRequest = requestAnimationFrame(this.animate.bind(this));
  }
  #carMovement() {
    if (this.keyControls.forward) {
      this.speed += this.acceleration;
    }
    if (this.keyControls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 3) {
      this.speed = -this.maxSpeed / 3;
    }
    if (this.speed > 0) {
      this.speed -= this.friction;
    } else if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (this.speed != 0) {
      if (this.keyControls.right) {
        this.angle += 0.08 * (this.speed / 20);
      }
      if (this.keyControls.left) {
        this.angle -= 0.08 * (this.speed / 20);
      }
    }
    this.#carStartPosY -= this.speed * Math.cos(this.angle);
    this.#carStartPosX += this.speed * Math.sin(this.angle);
  }
}

class keyControlHandler {
  constructor() {
    this.forward = false;
    this.reverse = false;
    this.right = false;
    this.left = false;
    this.#keyListener();
  }
  #keyListener() {
    window.addEventListener('keydown', (eventName) => {
      switch (eventName.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          this.forward = true;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          this.reverse = true;
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          this.left = true;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          this.right = true;
          break;
      }
    });
    window.addEventListener('keyup', (eventName) => {
      switch (eventName.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          this.forward = false;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          this.reverse = false;
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          this.left = false;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          this.right = false;
          break;
      }
    });
  }
}

class Road {
  #laneWidth;
  #laneNumber;
  #centerPoint;
  #ctx;
  constructor(laneWid, laneNum, centerPoint, ctx) {
    this.#laneWidth = laneWid;
    this.#laneNumber = laneNum;
    this.#centerPoint = centerPoint;
    this.#ctx = ctx;

    this.totalRoadWidth = this.#laneNumber * this.#laneWidth;
    this.maxRoadLen = 10000000;
    this.left = this.#centerPoint - this.totalRoadWidth / 2;
    this.right = this.#centerPoint + this.totalRoadWidth / 2;
    this.topLeft = { x: this.left, y: -this.maxRoadLen };
    this.bottomLeft = { x: this.left, y: this.maxRoadLen };
    this.topRight = { x: this.right, y: -this.maxRoadLen };
    this.bottomRight = { x: this.right, y: this.maxRoadLen };
    this.borders = [
      [this.topLeft, this.bottomLeft],
      [this.topRight, this.bottomRight],
    ];
  }
  drawRoad() {
    this.#ctx.lineWidth = 20;
    this.#ctx.strokeStyle = 'black';
    this.#ctx.fillStyle = 'gray';
    this.borders.forEach((eachElem)=>{
      this.#ctx.beginPath();
      this.#ctx.moveTo(eachElem[0].x,eachElem[0].y);
      this.#ctx.lineTo(eachElem[1].x,eachElem[1].y);
      this.#ctx.stroke();
      this.#ctx.closePath;
    })
    this.#ctx.beginPath();
    this.#ctx.moveTo(this.left, -this.maxRoadLen);
    this.#ctx.lineTo(this.left, this.maxRoadLen);
    this.#ctx.lineTo(this.right, this.maxRoadLen);
    this.#ctx.lineTo(this.right, -this.maxRoadLen);
    this.#ctx.fill();
    this.#ctx.closePath();
    for (let i = 0; i < this.#laneNumber - 1; i++) {
      const rightSideXCoords =
        this.left + (i + 1) * parseFloat(this.#laneWidth);
      this.#ctx.strokeStyle = 'lightgray';
      this.#ctx.setLineDash([80, 80]);
      this.#ctx.beginPath();
      this.#ctx.moveTo(rightSideXCoords, -this.maxRoadLen);
      this.#ctx.lineTo(rightSideXCoords, this.maxRoadLen);
      this.#ctx.stroke();
      this.#ctx.closePath();
      this.#ctx.setLineDash([]);
    }
  }
}
