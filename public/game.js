const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let titleImage = new Image(); titleImage.src = 'title.png';

let localPlayer = {words:['whale','monks','seams','shard','solid','water']};
let keyCenters = [];


function doFrame(){
    ctx.canvas.width = window.innerWidth-15;
    ctx.canvas.height = window.innerHeight-20;
    let centerX = window.innerWidth/2;
    let centerX1 = window.innerWidth/4;
    let centerX2 = window.innerWidth*3/4-3;
    let centerY = window.innerHeight/2;


    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.rect(0,0,10000,10000);
    ctx.fill();
    ctx.closePath();
    ctx.drawImage(titleImage,centerX-125, centerY/3-50,250,100)



    drawLetterBoxes(centerX1,centerY,1);
    drawLetterBoxes(centerX2,centerY,1);

//drawRect("#000000",centerX-55,centerY/1.5-25+225+40,100,window.innerHeight-20-(centerY/1.5-25+225+40)-0)
    drawKeyboard("#000000",centerX,centerY/1.5-25+225+40,100,window.innerHeight-20-(centerY/1.5-25+225+40)-0);
    requestAnimationFrame(doFrame)
}
requestAnimationFrame(doFrame)

function drawRect(color,x,y,width,height){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x,y,width,height);
    ctx.fill();
    ctx.closePath();
}
function drawLetterBox(textColor, bgColor, x,y,width,height,char){
    drawRect(bgColor,x,y,width,height);
    ctx.fillStyle = textColor;
    ctx.font = height+'px Comic Sans MS';
    ctx.fillText(char,x+width/4,y+height/1.4,width-(width/4))
}


function drawLetterBoxes(x,y,player){
    for(let yChange = 0; yChange<=225; yChange+=45)
        for(let xChange = -90; xChange<=90; xChange+=45)
            drawLetterBox("#ffffff","#6aaa64",x-25+xChange,y/1.5-25+yChange,40,40,localPlayer.words[Math.floor(yChange/45)].charAt(Math.floor(xChange/45+2)));
}

function drawKeyboard(color,x,y,w,h){
    let keyboardDisplayChars = 'qwertyuiopasdfghjklzxcvbnm'.split('');
    let charOn = 0;
    for(let xChange = -145; xChange<=155; xChange+=33){
        drawLetterBox("#ffffff","#afb0b4",x-25+xChange,y+10,30,40,keyboardDisplayChars[charOn]);
        charOn++;
    }
    y+=45;
    for(let xChange = -140; xChange<=140; xChange+=35) {
        drawLetterBox("#ffffff", "#afb0b4", x - 25 + xChange, y + 10, 30, 40,keyboardDisplayChars[charOn]);
        charOn++;
    }
    y+=45;
    for(let xChange = -103; xChange<=110; xChange+=35) {
        drawLetterBox("#ffffff", "#afb0b4", x - 25 + xChange, y + 10, 30, 40,keyboardDisplayChars[charOn]);
        charOn++;
    }
}