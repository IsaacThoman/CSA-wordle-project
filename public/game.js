const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let titleImage = new Image(); titleImage.src = 'title.png';

let localPlayer = {words:['','','','','','']};
let keyCenters = [];
let keyboardDisplayChars = 'qwertyuiop←asdfghjkl⏎zxcvbnm'.split('');
let keyboardColors = {};
let secretWord = 'shard';
let rowChecked = -1;
let dictionaryRaw;
let dictionary = [];
let rejected = false;
fetch('dictionary.txt')
    .then(response => response.text())
    .then(text => dictionaryRaw = text.split('\r\n'))
    .then(filterDictionary)

function filterDictionary(){
    for(let i = 0; i<dictionaryRaw.length; i++)
        if(dictionaryRaw[i].length==5)
            dictionary.push(dictionaryRaw[i]);
}

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
            let bgColor = "#a6a6a6";
            if(rowChecked >= Math.floor(yChange/45))
                bgColor = "#707070";
            if(localPlayer.words[Math.floor(yChange/45)].charAt(Math.floor(xChange/45+2))==secretWord.charAt(Math.floor(xChange/45+2))  &&  rowChecked >= Math.floor(yChange/45))
                bgColor = "#71ad6c";
            else if(secretWord.indexOf(localPlayer.words[Math.floor(yChange/45)].charAt(Math.floor(xChange/45+2)))>-1 &&  rowChecked >= Math.floor(yChange/45))
                bgColor = "#c0c276";
            if(rejected && Math.floor(yChange/45) == rowChecked+1)
                bgColor = "#c94848";
            drawLetterBox("#ffffff",bgColor,x-25+xChange,y/1.5-25+yChange,40,40,localPlayer.words[Math.floor(yChange/45)].charAt(Math.floor(xChange/45+2)));
            if(bgColor == "#707070")
                bgColor = "#3f3f3f";
            if(bgColor == "#3f3f3f" || bgColor == "#71ad6c" || bgColor == "#c0c276" )
            keyboardColors[localPlayer.words[Math.floor(yChange/45)].charAt(Math.floor(xChange/45+2))] = bgColor;
        }

}

function drawKeyboard(color,x,y,w,h){
    let charOn = 0;
    for(let xChange = -165; xChange<=165; xChange+=33){
        let keyColor = "#909094";
        if(keyboardColors[keyboardDisplayChars[charOn]]!=null)
            keyColor = keyboardColors[keyboardDisplayChars[charOn]];
        drawLetterBox("#ffffff",keyColor,x-25+xChange,y+10,30,40,keyboardDisplayChars[charOn]);
        keyCenters[charOn] = {x:(x-25+xChange)+15,y:y+10+20}
        charOn++;
    }
    y+=45;
    for(let xChange = -155; xChange<=160; xChange+=35) {
        let keyColor = "#909094";
        if(keyboardColors[keyboardDisplayChars[charOn]]!=null)
            keyColor = keyboardColors[keyboardDisplayChars[charOn]];
        drawLetterBox("#ffffff", keyColor, x - 25 + xChange, y + 10, 30, 40,keyboardDisplayChars[charOn]);
        keyCenters[charOn] = {x:(x-25+xChange)+15,y:y+10+10}
        charOn++;
    }
    y+=45;
    for(let xChange = -103; xChange<=110; xChange+=35) {
        let keyColor = "#909094";
        if(keyboardColors[keyboardDisplayChars[charOn]]!=null)
            keyColor = keyboardColors[keyboardDisplayChars[charOn]];
        drawLetterBox("#ffffff", keyColor, x - 25 + xChange, y + 10, 30, 40,keyboardDisplayChars[charOn]);
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
    if(keyHit!==10&&keyHit!==20)
        localPlayer.words[rowChecked+1] += keyboardDisplayChars[keyHit];
    else if(keyHit===10) {
        localPlayer.words[rowChecked + 1] = localPlayer.words[rowChecked + 1].substring(0, localPlayer.words[rowChecked + 1].length - 1);
        rejected = false;
    }
    else {
        if(localPlayer.words[rowChecked+1].length==5){
            if(dictionary.indexOf(localPlayer.words[rowChecked+1])>-1)
                rowChecked++;
            else
                rejected = true;
        }

    }
    for(let i = 0; i<localPlayer.words.length; i++)
        if(localPlayer.words[i].length>5)
            localPlayer.words[i] = localPlayer.words[i].substring(0,5);

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