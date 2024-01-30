const canv= document.querySelector("#canv");
const ctx= canv.getContext("2d");
window.onload=()=>{
  canv.height=window.innerHeight;
  canv.width=window.innerWidth;
  const carF = new Car(100,200,canv.width,canv.height,"white",100,100,ctx);
} 

class Car{
  #carWidth;
  #carHeight;
  #canvasWidth;
  #canvasHeight;
  #carColor;
  #carStartPosX;
  #carStartPosY;
  #ctx;
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
    this.#draw();
  }
  #draw(){
    this.#ctx.beginPath();
    this.#ctx.moveTo(this.#carStartPosX,this.#carStartPosY);
    this.#ctx.lineTo(this.#carStartPosX+this.#carWidth,this.#carStartPosY);
    this.#ctx.lineTo(this.#carStartPosX+this.#carWidth,this.#carStartPosY+this.#carHeight);
    this.#ctx.lineTo(this.#carStartPosX,this.#carStartPosY+this.#carHeight);
    this.#ctx.lineTo(this.#carStartPosX,this.#carStartPosY);
    this.#ctx.closePath();
    this.#ctx.fill();
  }

}