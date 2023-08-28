let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let img = new Image();
img.src = 'yidui.jpeg';
let particleArray = [];//存储生成的粒子

img.addEventListener('load',()=>{
    console.log('size: ',img.height,",",img.width);
    let ic = document.createElement("canvas");
    let ictx = ic.getContext("2d");
    ic.width = img.width;
    ic.height = img.height;
    ictx.drawImage(img, 0, 0, img.width, img.height);
    console.log('ictx,',ictx.width,ictx.height);
    let imgdata = ictx.getImageData(0,0,img.width,img.height);
    let imgArr = [];
    for(let i = 0; i < imgdata.data.length / 4;i++){
        imgArr.push(i);
    }

    let newparticle = ()=>{
        for(let c = 0; c<100; c++){
            let ind = (Math.random() * imgArr.length) | 0;
            let ci = imgArr[ind];
            let cx = ci%img.width;
            let cy = (ci/img.width) | 0;
            let r = imgdata.data[ci * 4 + 0];
            let g = imgdata.data[ci * 4 + 1];
            let b = imgdata.data[ci * 4 + 2];
            let color = `rgb(${r},${g},${b})`;
            particleArray.push(new Particle(
                cx + (canvas.width - img.width) / 2,
                cy + (canvas.height - img.height) / 2,
                color
            ));
            ictx.clearRect(cx, cy, 1, 1);
            imgArr.splice(ind, 1);
            for(let i =0; i < 10; i++){
                let ind = (Math.random() * imgArr.length) | 0;
                let ci = imgArr[ind];
                let cx = ci%img.width;
                let cy = (ci/img.width) | 0;
                ictx.clearRect(cx, cy, 1, 1);
                imgArr.splice(ind, 1);
            }
        }
    }
    let p_draw = ()=>{
        ctx.fillStyle = "rgba(0,0,0)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(
            ic,
            (canvas.width - ic.width) / 2,
            (canvas.height - ic.height) / 2,
            ic.width,
            ic.height
        );
        newparticle();
        for(let i = 0; i < particleArray.length; i++){
            particleArray[i].update();
            particleArray[i].draw();
            if(particleArray[i].t > 50){
                particleArray.splice(i, 1);
            }
        }
        requestAnimationFrame(p_draw);
    }
    p_draw();
})

class Particle {
    constructor(x,y,c){
        this.x = x;
        this.y = y;//位置
        this.color = c;
        this.vy = -Math.random();
        this.vx = Math.random();//位置变化
        this.t = 0;
    }
    update(){
        this.y += this.vy;
        this.x += this.vx;
        this.vy *= 1.05;
        this.vx *= 1.05;//速度系数
        this.t++;
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.vx/3, 0, Math.PI*2, 0);
        // ctx.fillRect(this.x, this.y,this.vx,this.vy); //矩形
        ctx.fill();
    }
}