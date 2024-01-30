const canvas = document.querySelector("#canv");
const ctx = canvas.getContext("2d");
let latestAnimFrameReq;

const mouse={
  x:0,
  y:0
}
window.addEventListener("mousemove",(tickObj)=>{
  mouse.x=tickObj.x;
  mouse.y=tickObj.y;
});

window.onload = () => {
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  const effectHandObject = new EffectHandler(ctx,canvas.width,canvas.height); 
  effectHandObject.animate();
}

window.addEventListener("resize", ()=>{
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  const effectHandObject = new EffectHandler(ctx,canvas.width,canvas.height); 
  cancelAnimationFrame(latestAnimFrameReq);
  effectHandObject.animate();
})


class EffectHandler{
  #ctx;
  #width;
  #height;
  constructor(ctx,width,height){
    this.#ctx = ctx;
    this.#ctx.lineWidth=2;
    this.#ctx.strokeStyle = "white";
    this.#height=height;
    this.#width=width;
    this.x=500;
    this.y=0;
  }
  #draw(x,y){
    const carWidth = 100;
    const carHeight = 200;
    this.#ctx.beginPath();
    this.#ctx.moveTo(x,y);
    this.#ctx.lineTo(x+carWidth,y);
    this.#ctx.stroke();
    this.#ctx.lineTo(x+carWidth, y+carHeight);
    this.#ctx.stroke();
    this.#ctx.lineTo(x, y+carHeight);
    this.#ctx.stroke();
    this.#ctx.lineTo(x, y);
    this.#ctx.stroke();
  }
  animate(){
    this.#ctx.clearRect(0,0, this.#width,this.#height);
    this.y+=2;
    this.#draw(mouse.x,mouse.y);
    console.log("Animating");
    latestAnimFrameReq= requestAnimationFrame(this.animate.bind(this));
  }

}