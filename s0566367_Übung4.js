"use strict";
/**************************************************/
/* Autor:  Diro Baloska s0566367                  */
/*                                                */
/* p5.js Template                                 */
/* Stand: 24.10.2020                              */
/*                                                */
/**************************************************/

/**
 * TABLE OF CONTENT
 * 1. Variables
 * 2. setup()
 * 3. draw()
 * 4. mouseDragged()
 * 5. isMouseOver()
 * 5. reset()
 */

/* Variablendeklaration */
var t = 0;                        // Zeit
var dt;                           // Zeitquant - wird auf die Bildwechselrate bezogen 
var frmRate;                      // Fliesskommadarstellung für Kehrwertbildung notwendig!
var rX;     //ratio von Pixel pro 2mm in X
var rY;     //ratio von Pixel pro 2mm in Y
var centerX;    //0 Punkt des Kartesisches Systems in X Achse
var centerY;    //0 Punk des Kartesisches Systems in Y Achse

//*********** die folgenden Variablen sind Pflicht! *********************/
var canvas;
var canvasID = 'pTest'; // ist eine Variable!!!
var startButton;

//VARIABLE NEEDED FOR DYNAMIC MOVEMENT
var triHeight;
var maxAlpha;
var angleLeft, angleRight; //ANGLE FOR WIPPE

//BALL VARIABLE
var leftBallStartPoint;

var leftVisibility, rightVisibility; //VISIBILITY OF DRAG CIRCLE
var leftStartY, rightStartY;
var leftControl, rightControl; //POSITION OF DRAG CIRCLE
var rightBallMovement, leftBallMovement; //FOR BALL MOVEMENT

//=====================PHYSICS VARIABLE=========================//
var gravity;

var changedTime;
var elasticityKonstant;
var leftV0, rightV0;

var movingAngle;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent(canvasID);
    
    rX = windowWidth / 2000;
    rY = -rX;  //To invert the - to bottom and + to top need to add - for the ratio

    centerX = windowWidth / 2;
    centerY = windowHeight - (0.2 * windowHeight);

    frmRate = 60;
    frameRate(frmRate);
    dt = 1.0 / frmRate;
    
    startButton = createButton('Start/Reset');
    startButton.position(100, 30);
    startButton.size(200);

    //HEIGHT OF SUPPORT TRIANGLE IS 50
    //ANGLE CALCULATION
    triHeight = 46;
    maxAlpha = Math.asin((triHeight * rX) / (-125 * rY));
    angleLeft = maxAlpha;
    angleRight = maxAlpha;

    //BALL VARIABLE
    leftBallStartPoint = createVector(-725 * Math.cos(angleLeft) + 16 * Math.cos(90 * Math.PI/180 - angleLeft), Math.sin(angleLeft) * 250);

    //DEFAULT VISIBILITY OF DRAG CIRCLE ARE TRUE(THEY SHOULD BE VISIBLE)
    leftVisibility = true;
    rightVisibility = true;
    //THE DEFAULT POSITION OF DRAG CIRCLE, IT TAKES THE ANGLE IN CONSIDERATION FOR THE STARTING POINT
    leftControl = createVector(-125, leftStartY);
    rightControl = createVector(125, rightStartY);
    //DEFAULT BALL MOVEMENT IS SET TO 0, THEY ARE NOT MOVING AT ALL IN INITIAL STATE
    leftBallMovement = createVector(0, 0);
    rightBallMovement = createVector(0, 0);    


    //=======PHYSICS SETUP========//
    gravity = 9.8;

    changedTime = 0;
    elasticityKonstant = 1;
    //lets say ball's mass is 1
    leftV0 = 0;
    rightV0 = 0;
    movingAngle = 0;
}


/**
 * First draw the floor and relative to it, 
 * score box, middle ball and the seesaw bundles
 * 
 * Second seesaw bundles has:
 * 1. support triangle relative to floor
 * 2. the seesaw rect relative to support triangle
 * 3. top triangle for ball support relative to seesaw rect
 * 4. playable ball relative to top triangle
 * 5. drag circle relative to seesaw rect
 */
function draw() {

    background('#aaaaff');
    
    //******* Darstellung **** Hier wird in Pixeln gerechnet! **********************
    fill('#ff0000');
    
    //******* Berechnung der Bewegung und der Maßstäbe **** Hier wird in Metern gerechnet! **************************		

        
    //****************************************** Administration ********************************************
    //WHEN START BUTTON IS PRESSED, RESET()
    startButton.mousePressed(() => reset());
    

    
    
    
    push();
    fill(0);
    textSize(40);
    text("Diro Baloska S0566367 24.10.2020", 400, 50);
    pop();


    //==========================================GRAPHIC===============================================//
    
    /**
     * Create self defined (0,0) coordinate system, this is where the middle ball is positioned
     */
    push();

        translate(centerX, centerY);
        fill(color(255,0,0));
        circle(0,0, 32 * rY);

        //FLOOR
        line(-centerX, -16 * rY, centerX, -16 * rY);

        //LEFT SYSTEM
        push();
            fill(color(0,0,0));
            triangle(-600 * rX, 30 * rY, -630 * rX, -16 * rY, -570 * rX, -16 * rY);
        pop();

        push();
            translate(-600 * rX, 30 * rY);
            rotate(angleLeft);
            line(-125 * rX, 0, 125 * rX, 0);
            fill(color(0,0,0));
            triangle(-60 * rX, 25 * rY, -68 * rX, 0, -52 * rX, 0);
        pop();

        //LEFT BALL
        push();
            fill(color(0,255,0));
            translate((leftBallStartPoint.x + leftBallMovement.x) * rX, (leftBallStartPoint.y + centerY - 16 + leftBallMovement.y) * rY);
            circle(0, 0, 32 * rX);
        pop();

        // line(
        //     (-600 - 125 + Math.cos(angleLeft) * 16) * rX, 
        //     (ballStartPoint - 16) * rY, 
        //     Math.cos(angleLeft) * 16 * rX, 
        //     0
        // );
    pop();    

    //=================================Physics====================================//
    //Potential energie of the spring Ep = (1/2)*elasticityConstant*deltaPosition²
    checkLimit();
    freeFall();

    //================================Collision==================================//
    isOnFloor();
    changedTime += deltaTime / 1000;
}

//CHECK IF THE DRAG SHOULD BE VISIBLE,
//IF VISIBILITY IS TRUE, MOUSE IS OVER THE CIRCLE
//WHICH MEANS THE CIRCLE CAN BE DRAGGED
function mouseDragged() {
    if(!leftVisibility) {
        leftControl.y = (mouseY - centerY) / rY * rX + 125 - 75;
        angleLeft = -Math.atan((leftControl.y * rY) / (125 * rX)) * (180/Math.PI);
        let epLeft = elasticityKonstant * Math.pow(dist(0, leftControl.y, 0, leftStartY), 2);
        //If mass of ball is 1, then the starting velocity of the ball is:
        leftV0 = Math.sqrt(epLeft * 2);        
    }

    if(!rightVisibility) {
        rightControl.y = (mouseY - centerY) / rY * rX + 125 - 75;
        angleRight = -Math.atan((rightControl.y * rY) / (125 * rX)) * (180/Math.PI);    
        let epRight = elasticityKonstant * Math.pow(dist(0, rightControl.y, 0, rightStartY), 2);
        rightV0 = Math.sqrt(epRight * 2);
    }
}

//WHETHER THE MOUSE IS OVER DRAG CIRCLE OR NOT
var isMouseOver = () => {
    let dLeft = dist((-600 + leftControl.x) * rX, centerY + (75 - 125 + leftControl.y) * rY, (mouseX - centerX), mouseY);
    let dRight = dist((600 + rightControl.x) * rX, centerY + (75 - 125 + rightControl.y) * rY, (mouseX - centerX), mouseY);
    if(dLeft < 32) {
        leftVisibility = false;
    } else {
        leftVisibility = true;
    }
    if(dRight < 32) {
        rightVisibility = false;
    } else {
        rightVisibility = true;
    }
}

var isOnFloor = () => {
    if(leftBallStartPoint.y + centerY - 16 + leftBallMovement.y < 0) {
        leftBallMovement.y = -leftBallStartPoint.y - centerY + 16;    
        changedTime = 0;
    }
}

var leftSeesawCollision = () => {

}

var freeFall = () => {
    leftBallMovement.y -= gravity * changedTime * changedTime;
}

var physicsMovement = () => {
    let time = deltaTime / 1000;
    if(leftVisibility) {
        leftControl.y -= (leftV0 * Math.sin(20 * Math.PI / 180) * time);
        angleLeft = -Math.atan((leftControl.y * rY) / (125 * rX)) * (180/Math.PI);
        leftV0 -= 9.8 * time * time;
        leftBallMovement.y += leftV0 * Math.sin(20 * Math.PI / 180) * time;
        console.log(leftV0)
    }    
    if(rightVisibility) {
        rightControl.y -= (rightV0 * Math.sin(20 * Math.PI / 180) * time);
        angleRight = -Math.atan((rightControl.y * rY) / (125 * rX)) * (180/Math.PI);
    }
}

var checkLimit = () => {
    //LEFT
    if(angleLeft > maxAlpha) {
        angleLeft = maxAlpha;
        leftControl.y = Math.tan(-angleLeft * Math.PI / 180) * 125 / rY * rX;
    }
    if(angleLeft < -maxAlpha) {
        angleLeft = -maxAlpha;
        leftControl.y = Math.tan(-angleLeft * Math.PI / 180) * 125 / rY * rX;
    }
    leftControl.x = -Math.sqrt(Math.pow(125, 2) - Math.pow(leftControl.y * rY, 2));

    //RIGHT
    if(angleRight > maxAlpha) {
        angleRight = maxAlpha;
        rightControl.y = Math.tan(-angleRight * Math.PI / 180) * 125 / rY * rX;
    }
    if(angleRight < -maxAlpha) {
        angleRight = -maxAlpha;
        rightControl.y = Math.tan(-angleRight * Math.PI / 180) * 125 / rY * rX;
    }
    rightControl.x = Math.sqrt(Math.pow(125, 2) - Math.pow(rightControl.y * rY, 2));
}

//RESET THE SCENE BACK TO DEFAULT
var reset = () => {
    angleLeft = 20;
    angleRight = 20;
    leftControl = createVector(-125,Math.tan(-angleLeft * Math.PI / 180) * 125 / rY * rX);
    rightControl = createVector(125,Math.tan(-angleRight * Math.PI / 180) * 125 / rY * rX);
    leftBallMovement = createVector(0,0);
    rightBallMovement = createVector(0,0);
}