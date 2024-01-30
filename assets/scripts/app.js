const canv= document.querySelector("#canv");
const ctx= canv.getContext("2d");
let latestAnimationRequest;
window.onload=()=>{
  canv.height=window.innerHeight;
  canv.width=window.innerWidth;
  const carF = new Car(100,200,canv.width,canv.height,"white",500,500,ctx);
  carF.animate();
} 
window.addEventListener("resize",()=>{
  cancelAnimationFrame(latestAnimationRequest);
  canv.height=window.innerHeight;
  canv.width=window.innerWidth;
  const carF = new Car(100,200,canv.width,canv.height,"white",500,500,ctx);
  carF.animate();
});

class Car{
  #carWidth;
  #carHeight;
  #canvasWidth;
  #canvasHeight;
  #carColor;
  #carStartPosX;
  #carStartPosY;
  #ctx;
  keyControls
  constructor(crWidth,crHeight,caWidth,caHeight,carColor,carPosX,carPosY,ctx){
    this.#ctx=ctx;
    this.#carWidth=crWidth;
    this.#carHeight=crHeight;
    this.#canvasWidth=caWidth;
    this.#canvasHeight=caHeight;
    this.#carStartPosX=carPosX;
    this.#carStartPosY=carPosY;
    this.#ctx.fillStyle=carColor;
    this.#ctx.strokeStyle=carColor;
    this.keyControls = new keyControlHandler();

    this.speed=0;
    this.acceleration=2;
    this.friction = 0.5;
    this.maxSpeed=30;
    this.angle=0;
    }
  
  #draw(){
    this.#ctx.save();
    this.#ctx.translate(this.#carStartPosX+this.#carWidth/2,this.#carStartPosY-this.#carHeight/2);
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
  animate(){
    this.#ctx.clearRect(0,0,this.#canvasWidth,this.#canvasHeight);
    if(this.keyControls.forward){
      this.speed+=this.acceleration;
    }
    if(this.keyControls.reverse){
      this.speed-=this.acceleration;
    }
  
    if(this.speed > this.maxSpeed){
      this.speed=this.maxSpeed;
    }
    if(this.speed < -this.maxSpeed/3){
      this.speed=-this.maxSpeed/3
    }
    if(this.speed>0){
      this.speed-=this.friction;
    }
    else if(this.speed<0){
      this.speed += this.friction;
    }
    if(this.speed!=0){
      if(this.keyControls.right){
        this.angle+=0.1*(this.speed/30);
      }
      if(this.keyControls.left){
        this.angle-=0.1*(this.speed/30);
      }
    }
    this.#carStartPosY-=this.speed*Math.cos(this.angle);
    this.#carStartPosX+=this.speed*Math.sin(this.angle);
    this.#draw();
    latestAnimationRequest=requestAnimationFrame(this.animate.bind(this));
  }
}


class keyControlHandler{
  constructor(){
    this.forward=false;
    this.reverse=false;
    this.right=false;
    this.left=false;
    this.#keyListener();
  }
  #keyListener(){
    window.addEventListener("keydown",(eventName)=>{
      switch (eventName.key) {
        case "ArrowUp":
        case "w":
        case "W":
          this.forward = true;
          break;
        case "ArrowDown":
        case "s":
        case "S":
          this.reverse = true;
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          this.left = true;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          this.right = true;
          break;
      }
    });
    window.addEventListener("keyup",(eventName)=>{
      switch (eventName.key) {
        case "ArrowUp":
        case "w":
        case "W":
          this.forward = false;
          break;
        case "ArrowDown":
        case "s":
        case "S":
          this.reverse = false;
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          this.left = false;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          this.right = false;
          break;
      }      
    });
  }
}