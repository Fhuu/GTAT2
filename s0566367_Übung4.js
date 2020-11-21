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
var ballPositionToSeesaw;
var leftBallStartPoint, rightBallStartPoint;

var leftIsPulled, rightIsPulled;
var leftIsHovering, rightIsHovering; //VISIBILITY OF DRAG CIRCLE
var leftIsOnFloor, rightIsOnFloor;
var leftIsReleased, rightIsReleased;
var leftIsMaxed, rightIsMaxed;
var leftIsLaunched, rightIsLaunched;

var leftStartY, rightStartY;
var leftControl, rightControl; //POSITION OF DRAG CIRCLE
var rightBallMovement, leftBallMovement; //FOR BALL MOVEMENT

//=====================PHYSICS VARIABLE=========================//
var gravity;
var leftTotalTime, rightTotalTime;
var maxV0, leftV0, rightV0;

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
    triCenter = 600;
    triHeight = 46;
    maxAlpha = Math.asin((triHeight * rX) / (-125 * rY));
    angleLeft = maxAlpha;
    angleRight = maxAlpha;

    seesawHalfLength = 125;

    //BALL VARIABLE
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

    //THE DEFAULT POSITION OF DRAG CIRCLE, IT TAKES THE ANGLE IN CONSIDERATION FOR THE STARTING POINT
    leftControl = createVector(0, 0);
    rightControl = createVector(0, 0);
    //DEFAULT BALL MOVEMENT IS SET TO 0, THEY ARE NOT MOVING AT ALL IN INITIAL STATE
    leftBallMovement = createVector(0, 0);
    rightBallMovement = createVector(0, 0);    


    //=======PHYSICS SETUP========//
    gravity = 9.8 * 20;
    leftTotalTime = 0;
    rightTotalTime = 0;

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
    text("Diro Baloska S0566367 21.11.2020", 400, 50);
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
            circle(0, 0, 32 * rX);
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
            circle(0, 0, 32 * rX);
        pop();

        //
    pop();    

    //=================================Physics====================================//
    isMaxed();
    countTime(frmRate, leftIsMaxed, rightIsMaxed);
    checkLimit();
    moveSeesaw();
    moveBall();
    isOnFloor();
    horizontalLimit();
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
    if(dLeft < 32 * rX) {
        leftIsHovering = false;
    } else {
        leftIsHovering = true;
    }

    let dRight = dist(centerX + (triCenter + seesawHalfLength * Math.cos(angleRight)) * rX, centerY + ((triHeight - 16) + seesawHalfLength * Math.sin(angleRight))  * rY, mouseX, mouseY);
    if(dRight < 32 * rX) {
        rightIsHovering = false;
    } else {
        rightIsHovering = true;
    }
}

var isOnFloor = () => {
    if(leftBallStartPoint.y + leftBallMovement.y < 0) {
        leftBallMovement.y = -leftBallStartPoint.y;    
        leftIsOnFloor = true;
    }
    if(rightBallStartPoint.y + rightBallMovement.y < 0) {
        rightBallMovement.y = -rightBallStartPoint.y;
        rightIsOnFloor = true;
    }
}

var horizontalLimit = () => {
    // leftBallMovement.x += 10;
    // rightBallMovement.x -= 10;
    // console.log(centerX + 600);
    // console.log(leftBallStartPoint.x + leftBallMovement.x);
    if(leftBallMovement.x > -leftBallStartPoint.x + centerX / rX - 16) {
        leftBallMovement.x = -leftBallStartPoint.x + centerX / rX - 16;
        if(leftIsOnFloor) leftV0 = 0;
    }

    if(rightBallMovement.x < -rightBallStartPoint.x -centerX / rX + 16) 
        rightBallMovement.x = -rightBallStartPoint.x -centerX / rX + 16;
    
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
}

//=========================PHYSICS FUNCTION=============================//
var moveBall = () => {
    

    if(leftIsMaxed && leftV0 !== 0) {
        leftIsLaunched = true;
        console.log(leftTotalTime);
        leftBallMovement.x = leftV0 * Math.sin(maxAlpha) * leftTotalTime;
        leftBallMovement.y = leftV0 * Math.cos(maxAlpha) * leftTotalTime - (gravity * leftTotalTime * leftTotalTime) / 2;
    }

    if(rightIsMaxed && rightV0 !== 0) {
        rightIsLaunched = true;
        rightBallMovement.x = -rightV0 * Math.sin(maxAlpha) * rightTotalTime;
        rightBallMovement.y = rightV0 * Math.cos(maxAlpha) * rightTotalTime - (gravity * rightTotalTime * rightTotalTime) / 2;
    }
    

}

var countTime = (frameRate, leftIsMaxed, rightIsMaxed) => {
    if(!leftIsPulled && leftV0 !== 0 && leftIsMaxed) leftTotalTime += 1 / frameRate;
    if(!rightIsPulled && rightV0 !== 0 && rightIsMaxed) rightTotalTime += 1 / frameRate;
}

var isMaxed = () => {
    if(angleLeft === maxAlpha) {
        leftIsMaxed = true;
        leftIsReleased = false;
        leftIsPulled = false;
    } else{
        leftIsMaxed = false;

    } 

    if(angleRight === maxAlpha) {
        rightIsMaxed = true;
        rightIsReleased = false;
        rightIsPulled = false;
    }
    else {
        rightIsMaxed = false;

    } 
}

var moveSeesaw = () => {
    if(angleLeft < maxAlpha && leftIsReleased) {
        angleLeft += leftV0 * (1 / 60) / seesawHalfLength * rX;
    }
    if(angleRight < maxAlpha && rightIsReleased) {
        angleRight += rightV0 * (1 / 60) / seesawHalfLength * rX;
    }
}