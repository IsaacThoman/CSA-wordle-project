const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let titleImage = new Image(); titleImage.src = 'title.png';

let localPlayer = {words:['','','','','','']};
let keyCenters = [];
let keyboardDisplayChars = 'qwertyuiop←asdfghjkl⏎zxcvbnm'.split('');


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
        for(let xChange = -90; xChange<=90; xChange+=45){
            
            drawLetterBox("#ffffff","#6aaa64",x-25+xChange,y/1.5-25+yChange,40,40,localPlayer.words[Math.floor(yChange/45)].charAt(Math.floor(xChange/45+2)));
        }

}

function drawKeyboard(color,x,y,w,h){
    let charOn = 0;
    for(let xChange = -165; xChange<=165; xChange+=33){
        drawLetterBox("#ffffff","#909094",x-25+xChange,y+10,30,40,keyboardDisplayChars[charOn]);
        keyCenters[charOn] = {x:(x-25+xChange)+15,y:y+10+20}
        charOn++;
    }
    y+=45;
    for(let xChange = -155; xChange<=160; xChange+=35) {
        drawLetterBox("#ffffff", "#909094", x - 25 + xChange, y + 10, 30, 40,keyboardDisplayChars[charOn]);
        keyCenters[charOn] = {x:(x-25+xChange)+15,y:y+10+10}
        charOn++;
    }
    y+=45;
    for(let xChange = -103; xChange<=110; xChange+=35) {
        drawLetterBox("#ffffff", "#909094", x - 25 + xChange, y + 10, 30, 40,keyboardDisplayChars[charOn]);
        keyCenters[charOn] = {x:(x-25+xChange)+15,y:y+10+10}
        charOn++;
    }
}



document.addEventListener("mousedown", mouseDownHandler, false);
function mouseDownHandler(e) {
    let relativeX;
    let relativeY;
    let rect = canvas.getBoundingClientRect();
    if('clientX' in e) {
        relativeX = e.clientX - rect.left;
        relativeY = e.clientY - rect.top;
    }
    let keyHit = findClosestKey(relativeX,relativeY);
    if(keyHit!=10&&keyHit!=20)
        localPlayer.words[0] += keyboardDisplayChars[keyHit];
    else if(keyHit==10)
        localPlayer.words[0] = localPlayer.words[0].substring(0,localPlayer.words[0].length-1);

}

function findClosestKey(relativeX,relativeY){
    let minDist = Math.sqrt(Math.pow(relativeX-keyCenters[0].x,2)+Math.pow(relativeY-keyCenters[0].y,2));
    let minIndex = 0;
    for(let i = 0; i<keyCenters.length; i++){
        let thisDist = Math.sqrt(Math.pow(relativeX-keyCenters[i].x,2)+Math.pow(relativeY-keyCenters[i].y,2));
        if(thisDist<minDist){
            minDist = thisDist;
            minIndex = i;
        }
    }
    return minIndex;
}