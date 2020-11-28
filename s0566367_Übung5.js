"use strict";
/**************************************************/
/* Autor:  Diro Baloska s0566367                  */
/*                                                */
/* p5.js Template                                 */
/* Stand: 08.11.2020                              */
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
var triCenter;
var triHeight;
var maxAlpha;
var angleLeft, angleRight; //ANGLE FOR WIPPE

var seesawHalfLength;

//BALL VARIABLE
var ballDiameter;
var ballSlopeDiff;
var ballPositionToSeesaw;
var leftBallStartPoint, rightBallStartPoint;

var leftIsPulled, rightIsPulled;
var leftIsHovering, rightIsHovering; //VISIBILITY OF DRAG CIRCLE
var leftIsOnFloor, rightIsOnFloor;
var leftIsReleased, rightIsReleased;
var leftIsMaxed, rightIsMaxed;
var leftIsLaunched, rightIsLaunched;
var leftIsGettingInSlope, rightIsGettingInSlope;
var leftIsGettingOutSlope, rightIsGettingOutSlope;

var leftStartY, rightStartY;
var leftControl, rightControl; //POSITION OF DRAG CIRCLE
var rightBallMovement, leftBallMovement; //FOR BALL MOVEMENT
var leftNormalMovement, rightNormalMovement;
var leftSlopeMovement, rightSlopeMovement;
var leftSlopeMovementOut, rightSlopeMovementOut;

//=====================PHYSICS VARIABLE=========================//
var gravity;
var leftTotalTime, rightTotalTime;
var leftGravityTime, rightGravityTime;
var leftOutSlopeTime, rightOutSlopeTime;
var maxV0, leftV0, rightV0;
var leftMaxHeight, rightMaxHeight;

var movingAngle;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent(canvasID);
    
    rX = windowWidth / 2000;
    rY = -rX;  //To invert the - to bottom and + to top need to add - for the ratio

    centerX = windowWidth / 2;
    centerY = windowHeight - (0.05 * windowHeight);

    frmRate = 60;
    frameRate(frmRate);
    dt = 1.0 / frmRate;
    
    startButton = createButton('Start/Reset');
    startButton.position(100, 30);
    startButton.size(200);

    //HEIGHT OF SUPPORT TRIANGLE IS 50
    //ANGLE CALCULATION
    triCenter = 600;
    triHeight = 46;
    maxAlpha = Math.asin((triHeight * rX) / (-125 * rY));
    angleLeft = maxAlpha;
    angleRight = maxAlpha;

    seesawHalfLength = 125;

    //BALL VARIABLE
    ballDiameter = 32;
    ballSlopeDiff = ballDiameter * Math.sin(maxAlpha / 2);
    ballPositionToSeesaw = 6.5 / 10;
    leftBallStartPoint = createVector(-triCenter - seesawHalfLength * ballPositionToSeesaw * Math.cos(angleLeft), (triHeight - 16) + Math.sin(angleLeft) * seesawHalfLength * ballPositionToSeesaw);    
    rightBallStartPoint = createVector(triCenter + seesawHalfLength * ballPositionToSeesaw * Math.cos(angleRight), (triHeight - 16) + Math.sin(angleRight) * seesawHalfLength * ballPositionToSeesaw);
    
    //STATES
    leftIsPulled = false;
    rightIsPulled = false;
    leftIsHovering = true;
    rightIsHovering = true;
    leftIsOnFloor = false;
    rightIsOnFloor = false;
    leftIsReleased = false;
    rightIsReleased = false;
    leftIsMaxed = false;
    rightIsMaxed = false;
    leftIsLaunched = false;
    rightIsLaunched = false;
    leftIsGettingOutSlope = false;
    leftIsGettingInSlope = false;
    rightIsGettingOutSlope = false;
    rightIsGettingInSlope = false;

    //THE DEFAULT POSITION OF DRAG CIRCLE, IT TAKES THE ANGLE IN CONSIDERATION FOR THE STARTING POINT
    leftControl = createVector(0, 0);
    rightControl = createVector(0, 0);
    //DEFAULT BALL MOVEMENT IS SET TO 0, THEY ARE NOT MOVING AT ALL IN INITIAL STATE
    leftBallMovement = createVector(0, 0);
    rightBallMovement = createVector(0, 0);    
    leftNormalMovement = createVector(0, 0);
    rightNormalMovement = createVector(0, 0);
    leftSlopeMovement = createVector(0, 0);
    rightSlopeMovement = createVector(0, 0);
    leftSlopeMovementOut = createVector(0, 0);
    rightSlopeMovementOut = createVector(0, 0);


    //=======PHYSICS SETUP========//
    gravity = 9.8 * 20;
    leftTotalTime = 0;
    rightTotalTime = 0;
    leftGravityTime = 0;
    rightGravityTime = 0;
    leftOutSlopeTime = 0;
    rightOutSlopeTime = 0;
    leftMaxHeight = 0;
    rightMaxHeight = 0;

    maxV0 = 35 * 20;
    leftV0 = 0;
    rightV0 = 0;

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

    
    //BALL VARIABLE
    // leftBallStartPoint = createVector(-725 * Math.cos(angleLeft) + 16 * Math.cos(90 * Math.PI/180 - angleLeft), Math.sin(angleLeft) * 16);

    //****************************************** Administration ********************************************
    //WHEN START BUTTON IS PRESSED, RESET()
    startButton.mousePressed(() => reset());
    isMouseOver();
    changeBallAngle();
    // mouseDragged();

    
    
    
    push();
    fill(0);
    textSize(40);
    text("Diro Baloska S0566367 23.11.2020", 400, 50);
    pop();


    //==========================================GRAPHIC===============================================//
    
    /**
     * Create self defined (0,0) coordinate system, this is where the middle ball is positioned
     */
    push();

        translate(centerX, centerY);
        fill(color(255,0,0));
        circle(0,0, ballDiameter * rY);

        //FLOOR
        line(-centerX, -16 * rY, centerX, -16 * rY);

        //==================================LEFT SYSTEM===========================//
        push();
            fill(color(0,0,0));
            triangle(-triCenter * rX, (triHeight - 16) * rY, -630 * rX, -16 * rY, -570 * rX, -16 * rY);
        pop();

        //SEESAW
        push();
            translate(-triCenter * rX, (triHeight - 16) * rY);
            rotate(angleLeft);
            line(-seesawHalfLength * rX, 0, seesawHalfLength * rX, 0);
            fill(color(0,0,0));
            triangle(-60 * rX, 25 * rY, -68 * rX, 0, -52 * rX, 0);
        pop();
        push();
            fill(color('#00000000'));
            if(leftIsHovering) 
            stroke(color(0,0,0));
            else
            stroke(color(0,0,0,0));
            circle((-triCenter - seesawHalfLength * Math.cos(angleLeft)) * rX, ((triHeight - 16) + seesawHalfLength * Math.sin(angleLeft)) * rY, 64 * rX);
        pop();

        //LEFT BALL
        push();
            fill(color(0,255,0));
            translate((leftBallStartPoint.x + leftBallMovement.x) * rX, (leftBallStartPoint.y + leftBallMovement.y) * rY);
            circle(0, 0, ballDiameter * rX);
        pop();

        //==================================RIGHT SYSTEM===========================//
        push();
            fill(color(0,0,0));
            triangle(triCenter * rX, (triHeight - 16) * rY, 630 * rX, -16 * rY, 570 * rX, -16 * rY);
        pop();

        //SEESAW
        push();
            translate(triCenter * rX, (triHeight - 16) * rY);
            rotate(-angleRight);
            line(-seesawHalfLength * rX, 0, seesawHalfLength * rX, 0);
            fill(color(0,0,0));
            triangle(60 * rX, 25 * rY, 68 * rX, 0, 52 * rX, 0);
        pop();
        push();
            fill(color('#00000000'));
            if(rightIsHovering) 
            stroke(color(0,0,0));
            else
            stroke(color(0,0,0,0));
            circle((triCenter + seesawHalfLength * Math.cos(angleRight)) * rX, ((triHeight - 16) + seesawHalfLength * Math.sin(angleRight)) * rY, 64 * rX);
        pop();

        //RIGHT BALL
        push();
            fill(color(0,0,255));
            translate((rightBallStartPoint.x + rightBallMovement.x) * rX, (rightBallStartPoint.y + rightBallMovement.y) * rY);
            circle(0, 0, ballDiameter * rX);
        pop();

        //
    pop();    

    //=================================Physics====================================//
    isMaxed();
    countTime(frmRate, leftIsMaxed, rightIsMaxed);
    checkLimit();
    moveSeesaw();
    moveBall();
    horizontalLimit();
    isOnSeesaw();
}


var changeBallAngle = () => {
    if(leftBallMovement.x < seesawHalfLength * rX)
    leftBallStartPoint = createVector(-triCenter - seesawHalfLength * ballPositionToSeesaw * Math.cos(angleLeft) + 16 * Math.sin(angleLeft), (triHeight - 16) + Math.sin(angleLeft) * seesawHalfLength * ballPositionToSeesaw + Math.cos(angleLeft) * 16);
    
    if(rightBallMovement.x > -seesawHalfLength * rX)
    rightBallStartPoint = createVector(triCenter + seesawHalfLength * ballPositionToSeesaw * Math.cos(angleRight) - 16 * Math.sin(angleRight), (triHeight - 16) + Math.sin(angleRight) * seesawHalfLength * ballPositionToSeesaw + Math.cos(angleRight) * 16);
    
}

//CHECK IF THE DRAG SHOULD BE VISIBLE,
//IF VISIBILITY IS TRUE, MOUSE IS OVER THE CIRCLE
//WHICH MEANS THE CIRCLE CAN BE DRAGGED
function mouseDragged() {
    if(!leftIsHovering) {
        angleLeft = Math.atan((mouseY - centerY + 16) / seesawHalfLength) / rY;  
        if(!leftIsLaunched) leftV0 = maxV0 / (2 * maxAlpha) * Math.abs(angleLeft - maxAlpha);
        leftIsPulled = true;
    } 

    if(!rightIsHovering) {
        angleRight = Math.atan((mouseY - centerY + 16) / seesawHalfLength) / rY;  
        if(!rightIsLaunched) rightV0 = maxV0 / (2 * maxAlpha) * Math.abs(angleRight - maxAlpha);
        rightIsPulled = true;
    } 
}

function mouseReleased() {
    if(!leftIsHovering) leftIsReleased = true;
    if(!rightIsHovering) rightIsReleased = true;
}

//WHETHER THE MOUSE IS OVER DRAG CIRCLE OR NOT
var isMouseOver = () => {
    let dLeft = dist(centerX + (-triCenter - seesawHalfLength * Math.cos(angleLeft)) * rX, centerY + ((triHeight - 16) + seesawHalfLength * Math.sin(angleLeft))  * rY, mouseX, mouseY);
    if(dLeft < ballDiameter * rX) {
        leftIsHovering = false;
    } else {
        leftIsHovering = true;
    }

    let dRight = dist(centerX + (triCenter + seesawHalfLength * Math.cos(angleRight)) * rX, centerY + ((triHeight - 16) + seesawHalfLength * Math.sin(angleRight))  * rY, mouseX, mouseY);
    if(dRight < ballDiameter * rX) {
        rightIsHovering = false;
    } else {
        rightIsHovering = true;
    }
}

var horizontalLimit = () => {
    // leftBallMovement.x += 10;
    // rightBallMovement.x -= 10;
    if(leftBallMovement.x > -leftBallStartPoint.x + centerX / rX - 16) {
        leftBallMovement.x = -leftBallStartPoint.x + centerX / rX - 16;
        if(leftIsOnFloor) leftV0 = 0;
    }

    if(leftBallMovement.x < -leftBallStartPoint.x - centerX / rX + 16) {
        leftBallMovement.x = -leftBallStartPoint.x - centerX / rX + 16;
        if(leftIsOnFloor) leftV0 = 0;
    }

    if(rightBallMovement.x < -rightBallStartPoint.x -centerX / rX + 16) {
        rightBallMovement.x = -rightBallStartPoint.x -centerX / rX + 16;
        if(rightIsOnFloor) rightV0 = 0;
    }

    if(rightBallMovement.x > - rightBallStartPoint.x + centerX / rX - 16) {
        rightBallMovement.x = - rightBallStartPoint.x + centerX / rX - 16;
        if(rightIsOnFloor) rightV0 = 0;
    }
    
}

var checkLimit = () => {
    //LEFT
    if(angleLeft > maxAlpha) {
        angleLeft = maxAlpha;
    }
    if(angleLeft < -maxAlpha) {
        angleLeft = -maxAlpha;
    }

    //RIGHT
    if(angleRight > maxAlpha) {
        angleRight = maxAlpha;
    }
    if(angleRight < -maxAlpha) {
        angleRight = -maxAlpha;
    }
}

//RESET THE SCENE BACK TO DEFAULT
var reset = () => {
    angleLeft = maxAlpha;
    angleRight = maxAlpha;
    leftBallMovement = createVector(0,0);
    rightBallMovement = createVector(0,0);
    leftTotalTime = 0;
    rightTotalTime = 0;
    //STATES
    leftIsPulled = false;
    rightIsPulled = false;
    leftIsHovering = true;
    rightIsHovering = true;
    leftIsOnFloor = false;
    rightIsOnFloor = false;
    leftIsReleased = false;
    rightIsReleased = false;
    leftIsMaxed = false;
    rightIsMaxed = false;
    leftIsLaunched = false;
    rightIsLaunched = false;
    leftV0 = 0;
    rightV0 = 0;
    leftIsGettingInSlope = false;
    rightIsGettingInSlope = false;
    leftIsGettingOutSlope = false;
    rightIsGettingOutSlope = false;
    leftNormalMovement = createVector(0,0);
    rightNormalMovement = createVector(0,0);
    leftSlopeMovement = createVector(0, 0);
    rightSlopeMovement = createVector(0,0);
    leftSlopeMovementOut = createVector(0,0);
    rightSlopeMovementOut = createVector(0,0);
    leftTotalTime = 0;
    rightTotalTime = 0;
    leftGravityTime = 0;
    rightGravityTime = 0;
    leftOutSlopeTime = 0;
    rightOutSlopeTime = 0;
    leftMaxHeight = 0;
    rightMaxHeight = 0;
}

//=========================PHYSICS FUNCTION=============================//
var moveBall = () => {

}

var isOnFloor = () => {
    if(leftBallMovement.y + leftBallStartPoint.y < 0) {
        leftBallMovement.y = -leftBallStartPoint.y;
        stateChange('left', 'ONFLOOR');
    }

    if(leftBallMovement.y + leftBallStartPoint.y < 0) {
        leftBallMovement.y = -leftBallStartPoint.y;
        stateChange('left', 'ONFLOOR');
    }
}

var countTime = (frameRate, leftIsMaxed, rightIsMaxed) => {
    if(leftOldState === 'PRELAUNCH' && leftState === 'LAUNCH') {
        if(leftIsGettingInSlope && !leftIsGettingOutSlope) leftGravityTime += 1/frameRate;
        if(!leftIsGettingInSlope) leftTotalTime += 1 / frameRate;
        if(leftIsGettingOutSlope) leftOutSlopeTime += 1/frameRate; 
    }

    if(rightOldState === 'RELEASE' && rightState === 'PRELAUNCH') {
        if(rightIsGettingInSlope && !rightIsGettingOutSlope) rightGravityTime += 1/frameRate;
        if(!rightIsGettingInSlope) rightTotalTime += 1 / frameRate;
        if(rightIsGettingOutSlope) rightOutSlopeTime += 1/frameRate;
    }
}

var isMaxed = () => {
    if(angleLeft === maxAlpha && leftOldState === 'RELEASE' && leftState === 'PRELAUNCH') {
        stateChange('left', 'LAUNCH');
    }

    if(angleRight === maxAlpha && rightOldState === 'RELEASE' && rightState === 'PRELAUNCH') {
        stateChange('right', 'LAUNCH');
    }
}

var moveSeesaw = () => {
    if(leftState === 'PRELAUNCH' && leftOldState === 'RELEASE') {
        angleLeft += leftV0 * (1 / 60) / seesawHalfLength * rX;
    }
    if(rightState === 'PRELAUNCH' && rightOldState === 'RELEASE') {
        angleRight += rightV0 * (1 / 60) / seesawHalfLength * rX;
    }
}

var isOnSeesaw = () => {
    let seesawArea = Math.cos(maxAlpha) * seesawHalfLength;

    if(leftBallStartPoint.x + leftBallMovement.x > 600 - seesawArea - ballSlopeDiff && leftBallStartPoint.x + leftBallMovement.x < 600 + seesawArea) {
        stateChange('left', 'ONSLOPE');
    }

    if(rightBallStartPoint.x + rightBallMovement.x < -600 + seesawArea + ballSlopeDiff && rightBallStartPoint.x + rightBallMovement.x > -600 - seesawArea) {
        stateChange('right', 'ONSLOPE')
    }
}


// var states = [
//     'BEGIN',
//     'START',
//     'HOVER',
//     'PULL',
//     'RELEASE',
//     'PRELAUNCH',
//     'LAUNCH',
//     'ONFLOOR',
//     'ONSLOPE',
// ]

var leftState = 'BEGIN';
var leftOldState = 'BEGIN'

var rightState = 'BEGIN';
var rightOldState = 'BEGIN'

var stateChange = (side, newState) => {
    if(side === 'left') {
        leftOldState = state;
        leftState = newState;
    }
    
    if(side === 'right') {
        rightOldState = state;
        rightState = newState;
    }
}