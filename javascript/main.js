"use strict";
/**************************************************/
/* Autor:  Diro Baloska s0566367                  */
/*                                                */
/* p5.js Template                                 */
/* Stand: 31.12.2020                              */
/*                                                */
/**************************************************/
/* Variablendeklaration */
var dt;                           // Zeitquant - wird auf die Bildwechselrate bezogen 
var frmRate;                      // Fliesskommadarstellung für Kehrwertbildung notwendig!
var rX;     //ratio von Pixel pro 2mm in X
var rY;     //ratio von Pixel pro 2mm in Y
var centerX;    //0 Punkt des Kartesisches Systems in X Achse
var centerY;    //0 Punk des Kartesisches Systems in Y Achse

//*********** die folgenden Variablen sind Pflicht! *********************/
var canvas;
var canvasID = 'pTest'; // ist eine Variable!!!
var resetButton;
var windToggle;
var toggle;
var velocitySlider;
var angleSlider;
var pos;
var vz;
var move;

//==VARIABLES==
var gameState;
var g;
var luftDichte;
var m;
var cw;
var air;
var vMax;
var d;
var r;
var distance;
var seesawHalfLength;
var seesawHeight;
var triangleHalfLength;
var aMax;
var leftAngle;
var rightAngle;

//Objects
var left, right;
var testBall;
var middleBall;
var scoreSystem;
//=============


function setup() {
    
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent(canvasID);

    frmRate = 60;
    frameRate(frmRate);
    dt = 1.0 / frmRate / 4;
    centerX = windowWidth / 2;
    centerY = windowHeight - (0.05 * windowHeight);
    rX = windowWidth / 2000;
    rY = -rX;  //To invert the - to bottom and + to top need to add - for the ratio
    
    setVariable();

    resetButton = createButton('Start/Stop Game');
    resetButton.position(100, 30);

    toggle = false;

    windToggle = createButton('Wind On/Off');
    windToggle.position(100, 60);
    windToggle.mousePressed(toggleWind);
}

function draw() {

    background('#aaaaff');
    
    //******* Darstellung **** Hier wird in Pixeln gerechnet! **********************
    fill('#ff0000');
    
    //******* Berechnung der Bewegung und der Maßstäbe **** Hier wird in Metern gerechnet! **************************		  
    
    

    testBall.draw();

    switch(gameState) {
        case 'START':
            startGame();
            break;
        case 'PLAY' :
            playGame();
            break;
    }
        
   
}

function mouseDragged() {
    if(left.control.isHovering(leftAngle) && move === 'l') 
        left.control.mouseControl();
    if(right.control.isHovering(rightAngle) && move === 'r')
        right.control.mouseControl();

    
}

function mousePressed() {
    if(testBall.state === 'POSITION') {
        testBall.x = (mouseX - centerX) / rX;
        testBall.y = (mouseY - centerY) / rY;
    }
}

function mouseReleased() {
    left.releaseAfterPull(leftAngle);
    right.releaseAfterPull(rightAngle);

    leftAngle = aMax;
    rightAngle = -aMax;

    
}

function toggleWind() {
    toggle = !toggle;
    if(toggle) {
        let vorzeichen = Math.random() < 0.5 ? -1 : 1;
        air = Math.round(Math.random() * 21 * vorzeichen);
    } else {
        air = 0;
    }
}

function keyTyped() {
    if(keyCode === ENTER) {
        testBall.stateChange();
    }
}