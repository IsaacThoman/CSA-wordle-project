const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const socket = io();
let titleImage = new Image(); titleImage.src = 'title.png';

let localPlayer = {words:['','','','','',''],keyboardColors:{},playerID:Math.random(),rowChecked: -1,won:false};
let remotePlayer = {words:['','','','','',''],keyboardColors:{},playerID:0,rowChecked: -1,won:false};
let keyCenters = [];
let keyboardDisplayChars = 'qwertyuiop←asdfghjkl⏎zxcvbnm'.split('');
let secretWord = 'shard';
let dictionaryRaw;
let dictionary = [];
let rejected = false;
let utcTime = 0;
let lastUpload = 0;
let keyColors = ["#3f3f3f","#c0c276","#71ad6c","#c94848"];

fetch('dictionary.txt')
    .then(response => response.text())
    .then(text => dictionaryRaw = text.split('\r\n'))
    .then(filterDictionary)

function filterDictionary(){
    for(let i = 0; i<dictionaryRaw.length; i++)
        if(dictionaryRaw[i].length==5)
            dictionary.push(dictionaryRaw[i]);
    //secretWord = dictionary[Math.floor(Math.random()*1000)];
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



    drawLetterBoxes(centerX1,centerY,localPlayer);
    drawLetterBoxes(centerX2,centerY,remotePlayer);

    if(lastUpload+0.1<utcTime){
        socket.emit('playerData',localPlayer);
        lastUpload = utcTime;
    }

    drawKeyboard("#000000",centerX,centerY/1.5-25+225+40,100,window.innerHeight-20-(centerY/1.5-25+225+40)-0);
    utcTime = (new Date()).getTime() / 1000;

    let infoText = '';

    if(remotePlayer.playerID==0)
        infoText = 'Waiting for remote player';

    if(remotePlayer.won)
        infoText = 'Remote player won!'

    if(localPlayer.won)
        infoText = 'You won!'

    for(let i = 0; i<localPlayer.words.length; i++)
        if(localPlayer.words[i] == secretWord && localPlayer.rowChecked+1>i)
            localPlayer.won = true;


    ctx.fillStyle = "#32c3c7";
    ctx.font = '25px Comic Sans MS';
    ctx.fillText(infoText,centerX-ctx.measureText(infoText).width/2,centerY/1.8)

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
            if(player.rowChecked >= Math.floor(yChange/45))
                bgColor = "#707070";
            if(player.words[Math.floor(yChange/45)].charAt(Math.floor(xChange/45+2))==secretWord.charAt(Math.floor(xChange/45+2))  &&  player.rowChecked >= Math.floor(yChange/45))
                bgColor = keyColors[2];
            else if(secretWord.indexOf(player.words[Math.floor(yChange/45)].charAt(Math.floor(xChange/45+2)))>-1 &&  player.rowChecked >= Math.floor(yChange/45))
                bgColor = keyColors[1];
            if(rejected && Math.floor(yChange/45) == player.rowChecked+1)
                bgColor = keyColors[3];
            drawLetterBox("#ffffff",bgColor,x-25+xChange,y/1.5-25+yChange,40,40,player.words[Math.floor(yChange/45)].charAt(Math.floor(xChange/45+2)));
            if(bgColor == "#707070")
                bgColor = keyColors[0];
            if(bgColor == keyColors[0] || bgColor == keyColors[1] || bgColor == keyColors[2] )
                player.keyboardColors[player.words[Math.floor(yChange/45)].charAt(Math.floor(xChange/45+2))] = bgColor;
        }

}

function drawKeyboard(color,x,y,w,h){
    let charOn = 0;
    for(let xChange = -165; xChange<=165; xChange+=33){
        let keyColor = "#909094";

        if(remotePlayer.keyboardColors[keyboardDisplayChars[charOn]]!=null)
            keyColor = remotePlayer.keyboardColors[keyboardDisplayChars[charOn]];

        if(localPlayer.keyboardColors[keyboardDisplayChars[charOn]]!=null)
            keyColor = localPlayer.keyboardColors[keyboardDisplayChars[charOn]];


        drawLetterBox("#ffffff",keyColor,x-25+xChange,y+10,30,40,keyboardDisplayChars[charOn]);
        keyCenters[charOn] = {x:(x-25+xChange)+15,y:y+10+20}
        charOn++;
    }
    y+=45;
    for(let xChange = -155; xChange<=160; xChange+=35) {
        let keyColor = "#909094";
        if(localPlayer.keyboardColors[keyboardDisplayChars[charOn]]!=null)
            keyColor = localPlayer.keyboardColors[keyboardDisplayChars[charOn]];
        if(remotePlayer.keyboardColors[keyboardDisplayChars[charOn]]!=null)
            keyColor = remotePlayer.keyboardColors[keyboardDisplayChars[charOn]];
        drawLetterBox("#ffffff", keyColor, x - 25 + xChange, y + 10, 30, 40,keyboardDisplayChars[charOn]);
        keyCenters[charOn] = {x:(x-25+xChange)+15,y:y+10+10}
        charOn++;
    }
    y+=45;
    for(let xChange = -103; xChange<=110; xChange+=35) {
        let keyColor = "#909094";
        if(localPlayer.keyboardColors[keyboardDisplayChars[charOn]]!=null)
                keyColor = localPlayer.keyboardColors[keyboardDisplayChars[charOn]];
        if(remotePlayer.keyboardColors[keyboardDisplayChars[charOn]]!=null)
                keyColor = remotePlayer.keyboardColors[keyboardDisplayChars[charOn]];


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
        localPlayer.words[localPlayer.rowChecked+1] += keyboardDisplayChars[keyHit];
    else if(keyHit===10) {
        localPlayer.words[localPlayer.rowChecked + 1] = localPlayer.words[localPlayer.rowChecked + 1].substring(0, localPlayer.words[localPlayer.rowChecked + 1].length - 1);
        rejected = false;
    }
    else {
        if(localPlayer.words[localPlayer.rowChecked+1].length==5){
            if(dictionary.indexOf(localPlayer.words[localPlayer.rowChecked+1])>-1)
                localPlayer.rowChecked++;
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

socket.on('playerData', function(msg) {
    if(msg==null) return;
if(msg['playerID']!=localPlayer['playerID']){
    remotePlayer = msg;

}

});