"use strict";
/**************************************************/
/* Autor:  Diro Baloska s0566367                  */
/*                                                */
/* p5.js Template                                 */
/* Stand: 29.11.2020                              */
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

var leftStartY, rightStartY;
var leftControl, rightControl; //POSITION OF DRAG CIRCLE
var rightBallMovement, leftBallMovement; //FOR BALL MOVEMENT
var leftNormalMovement, rightNormalMovement;
var leftSlopeMovement, rightSlopeMovement;
var leftOwnSlopeMovement, rightOwnSlopeMovement;

//=====================PHYSICS VARIABLE=========================//
var gravity;
var leftTotalTime, rightTotalTime;
var leftGravityTime, rightGravityTime;
var maxV0, leftV0, rightV0;
var leftMaxHeight, rightMaxHeight;

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
    
    //THE DEFAULT POSITION OF DRAG CIRCLE, IT TAKES THE ANGLE IN CONSIDERATION FOR THE STARTING POINT
    leftControl = createVector(0, 0);
    rightControl = createVector(0, 0);
    //DEFAULT BALL MOVEMENT IS SET TO 0, THEY ARE NOT MOVING AT ALL IN INITIAL STATE
    leftBallMovement = createVector(0, 0);
    rightBallMovement = createVector(0, 0);    
    leftNormalMovement = createVector(0, 0);
    rightNormalMovement = createVector(0, 0);
    leftSlopeMovement = createVector(0, 0);
    leftOwnSlopeMovement = createVector(0,0);
    rightSlopeMovement = createVector(0, 0);
    rightOwnSlopeMovement = createVector(0,0);

    //=======PHYSICS SETUP========//
    gravity = 9.8 * 20;
    leftTotalTime = 0;
    rightTotalTime = 0;
    leftGravityTime = 0;
    rightGravityTime = 0;
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
    text("Diro Baloska S0566367 29.11.2020", 400, 50);
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
            if(leftState !== 'HOVER' && leftState !== 'PULL') 
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
            if(rightState !== 'HOVER' && rightState !== 'PULL') 
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
    checkLimit();
    isOnFloor();
    isMaxed();
    countTime(frmRate);
    moveSeesaw();
    moveBall();
    horizontalLimit();
    isOnSeesaw();

    console.log(rightOldState, ' => ', rightState);
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
    if(leftState === 'HOVER' || leftState === 'PULL') {
        angleLeft = Math.atan((mouseY - centerY + 16) / seesawHalfLength) / rY;  
        if(leftState !== 'LAUNCH') leftV0 = maxV0 / (2 * maxAlpha) * Math.abs(angleLeft - maxAlpha);
        stateChange('left', 'PULL');
    } 

    if(rightState === 'HOVER' || rightState === 'PULL') {
        angleRight = Math.atan((mouseY - centerY + 16) / seesawHalfLength) / rY;  
        if(rightState !== 'LAUNCH') rightV0 = maxV0 / (2 * maxAlpha) * Math.abs(angleRight - maxAlpha);
        stateChange('right', 'PULL');
    } 
}

function mouseReleased() {
    if(leftState === 'PULL') stateChange('left', 'RELEASE');
    if(rightState === 'PULL') stateChange('right', 'RELEASE');
}

//WHETHER THE MOUSE IS OVER DRAG CIRCLE OR NOT
var isMouseOver = () => {
    let dLeft = dist(centerX + (-triCenter - seesawHalfLength * Math.cos(angleLeft)) * rX, centerY + ((triHeight - 16) + seesawHalfLength * Math.sin(angleLeft))  * rY, mouseX, mouseY);
    if(dLeft < ballDiameter * rX && (leftState === 'START' || leftState === 'BEGIN' || leftState === 'HOVER')) {
        stateChange('left', 'HOVER');
    } else {
        if(leftState === 'HOVER') {
            stateChange('left', 'BEGIN');
        }
    }

    let dRight = dist(centerX + (triCenter + seesawHalfLength * Math.cos(angleRight)) * rX, centerY + ((triHeight - 16) + seesawHalfLength * Math.sin(angleRight))  * rY, mouseX, mouseY);
    if(dRight < ballDiameter * rX && (rightState === 'START' || rightState === 'BEGIN' || rightState === 'HOVER')) {
        stateChange('right', 'HOVER');
    } else {
        if(rightState === 'HOVER') stateChange('right', 'BEGIN');
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


    let leftV0Sin = leftV0 * Math.sin(maxAlpha);    
    if(leftState === 'LAUNCH' || leftState === 'ONAIR') {
        leftBallMovement.x += leftV0Sin / 60;
        leftBallMovement.y += (leftV0 * Math.cos(maxAlpha) - (gravity * leftTotalTime)) / 60;
        stateChange('left', 'ONAIR');
    }

    if(leftState === 'ONFLOOR') {
        // if(leftOldState === 'ONSLOPE') console.log('This should run');
        if(leftV0 !== 0) console.log(leftV0);
        leftBallMovement.x += leftV0Sin / 60;

        
        leftSlopeMovement.x = 0;
        leftSlopeMovement.y = 0;
        
        leftOwnSlopeMovement.x = 0;
        leftOwnSlopeMovement.y = 0;

        leftGravityTime = 0;
        leftMaxHeight = 0;
    }

    if(leftState === 'ONSLOPE') {
        leftBallMovement.x -= leftSlopeMovement.x;
        leftBallMovement.y -= leftSlopeMovement.y;
        
        leftSlopeMovement.x += (leftV0Sin * Math.cos(maxAlpha) - (gravity * Math.cos(maxAlpha) * leftGravityTime)) / 60;
        leftSlopeMovement.y += (leftV0Sin * Math.sin(maxAlpha) - (gravity * Math.sin(maxAlpha) * leftGravityTime)) / 60;

        leftBallMovement.x += leftSlopeMovement.x;
        leftBallMovement.y += leftSlopeMovement.y;
  
        if(leftSlopeMovement.y > leftMaxHeight) leftMaxHeight = leftSlopeMovement.y;
        if(leftSlopeMovement.y <= 0) {
            stateChange('left', 'ONFLOOR');
        }
    }

    if(leftState === 'ONOWNSLOPE' && leftOldState === 'ONFLOOR') {
        leftBallMovement.x -= leftOwnSlopeMovement.x;
        leftBallMovement.y -= leftOwnSlopeMovement.y;
        
        leftOwnSlopeMovement.x += (leftV0Sin * Math.cos(maxAlpha) + (gravity * Math.cos(maxAlpha) * leftGravityTime)) / 60;
        leftOwnSlopeMovement.y += (-leftV0Sin * Math.sin(maxAlpha) - (gravity * Math.sin(maxAlpha) * leftGravityTime)) / 60;

        leftBallMovement.x += leftOwnSlopeMovement.x;
        leftBallMovement.y += leftOwnSlopeMovement.y;
        
        if(leftOwnSlopeMovement.y > leftMaxHeight) leftMaxHeight = leftOwnSlopeMovement.y;
        if(leftOwnSlopeMovement.y  <= 0) {
            stateChange('left', 'ONFLOOR');
        }
    }


    let rightV0Sin = -rightV0 * Math.sin(maxAlpha);
    if(rightState === 'LAUNCH' || rightState === 'ONAIR') {
        rightBallMovement.x += rightV0Sin / 60;
        rightBallMovement.y += (rightV0 * Math.cos(maxAlpha) - (gravity * rightTotalTime)) / 60;
        stateChange('right', 'ONAIR');
    }

    if(rightState === 'ONFLOOR') {
        // if(rightOldState === 'ONSLOPE') console.log('This should run');
        if(rightV0 !== 0) console.log(rightV0);
        rightBallMovement.x += rightV0Sin / 60;

        
        rightSlopeMovement.x = 0;
        rightSlopeMovement.y = 0;
        
        rightOwnSlopeMovement.x = 0;
        rightOwnSlopeMovement.y = 0;

        rightGravityTime = 0;
        rightMaxHeight = 0;
    }

    if(rightState === 'ONSLOPE') {
        rightBallMovement.x -= rightSlopeMovement.x;
        rightBallMovement.y -= rightSlopeMovement.y;

        rightSlopeMovement.x += (rightV0Sin * Math.cos(maxAlpha) + (gravity * Math.cos(maxAlpha) * rightGravityTime)) / 60;
        rightSlopeMovement.y += (-rightV0Sin * Math.sin(maxAlpha) - (gravity * Math.sin(maxAlpha) * rightGravityTime)) / 60;
        
        rightBallMovement.x += rightSlopeMovement.x;
        rightBallMovement.y += rightSlopeMovement.y;

        if(rightSlopeMovement.y > rightMaxHeight) rightMaxHeight = rightSlopeMovement.y;
        if(rightSlopeMovement.y <= 0) {
            stateChange('right', 'ONFLOOR');
        }
    }

    if(rightState === 'ONOWNSLOPE' && rightOldState === 'ONFLOOR') {
        rightBallMovement.x -= rightOwnSlopeMovement.x;
        rightBallMovement.y -= rightOwnSlopeMovement.y;

        rightOwnSlopeMovement.x += (rightV0Sin * Math.cos(maxAlpha) - (gravity * Math.cos(maxAlpha) * rightGravityTime)) / 60;
        rightOwnSlopeMovement.y += (rightV0Sin * Math.sin(maxAlpha) - (gravity * Math.sin(maxAlpha) * rightGravityTime)) / 60;
        
        rightBallMovement.x += rightOwnSlopeMovement.x;
        rightBallMovement.y += rightOwnSlopeMovement.y;

        if(rightOwnSlopeMovement.y > rightMaxHeight) rightMaxHeight = rightOwnSlopeMovement.y;
        if(rightOwnSlopeMovement.y  <= 0) {
            stateChange('right', 'ONFLOOR');
        }
    }
}

var isOnFloor = () => {
    if(leftBallMovement.y + leftBallStartPoint.y < 0) {
        leftBallMovement.y = -leftBallStartPoint.y;
        stateChange('left', 'ONFLOOR');
    }

    if(rightBallMovement.y + rightBallStartPoint.y < 0) {
        rightBallMovement.y = -rightBallStartPoint.y;
        stateChange('right', 'ONFLOOR');
    }
}

var countTime = (frameRate) => {
    if(leftState === 'LAUNCH' || leftState === 'ONAIR' || (leftState === 'ONFLOOR' && leftOldState !== 'ONSLOPE')) {
        leftTotalTime += 1 / frameRate;
    }

    if(leftState === 'ONSLOPE' || leftState === 'ONOWNSLOPE') leftGravityTime += 1 / 60;

    if(rightState === 'LAUNCH' || rightState === 'ONAIR' || (rightState === 'ONFLOOR' && rightOldState !== 'ONOWNSLOPE')) rightTotalTime += 1 / frameRate;

    if(rightState === 'ONSLOPE' || rightState === 'ONOWNSLOPE') {
        console.log('this should run');
        rightGravityTime += 1 / 60;
    }
}

var isMaxed = () => {
    if(angleLeft === maxAlpha && leftOldState === 'PULL' && leftState === 'RELEASE') {
        stateChange('left', 'LAUNCH');
    }

    if(angleRight === maxAlpha && rightOldState === 'PULL' && rightState === 'RELEASE') {
        stateChange('right', 'LAUNCH');
    }
}

var moveSeesaw = () => {
    if(leftState === 'RELEASE' && leftOldState === 'PULL') {
        angleLeft += leftV0 * (1 / 60) / seesawHalfLength * rX;
    }
    if(rightState === 'RELEASE' && rightOldState === 'PULL') {
        angleRight += rightV0 * (1 / 60) / seesawHalfLength * rX;
    }
}

var isOnSeesaw = () => {
    let seesawArea = Math.cos(maxAlpha) * seesawHalfLength;

    if(leftBallStartPoint.x + leftBallMovement.x > 600 - seesawArea - ballSlopeDiff && leftBallStartPoint.x + leftBallMovement.x < 600 + seesawArea) {
        stateChange('left', 'ONSLOPE');
    }

    if(leftBallMovement.x < Math.cos(maxAlpha) * (seesawHalfLength + (6.5 / 10) * seesawHalfLength) - ballSlopeDiff && leftState === 'ONFLOOR') {
        stateChange('left', 'ONOWNSLOPE')
    }

    if(rightBallStartPoint.x + rightBallMovement.x < -600 + seesawArea + ballSlopeDiff && rightBallStartPoint.x + rightBallMovement.x > -600 - seesawArea) {
        stateChange('right', 'ONSLOPE')
    }

    if(Math.abs(rightBallMovement.x) <= Math.cos(maxAlpha) * (seesawHalfLength + (6.5 / 10) * seesawHalfLength) - ballSlopeDiff && rightState === 'ONFLOOR') stateChange('right', 'ONOWNSLOPE');
}


// var states = [
//     'BEGIN',
//     'START',
//     'HOVER',
//     'PULL',
//     'RELEASE',
//     'PRELAUNCH',
//     'LAUNCH',
//     'ONAIR',
//     'ONFLOOR',
//     'ONSLOPE',
//     'ONOWNSLOPE'
// ]

var leftState = 'START';
var leftOldState = 'START'

var rightState = 'START';
var rightOldState = 'START'

var stateChange = (side, newState) => {

    

    if(side === 'left') {
        leftOldState = leftState;
        leftState = newState;

        if(leftState === 'ONFLOOR' && leftOldState === 'ONSLOPE') {
            leftV0 = -1 * Math.sqrt(Math.abs(2 * gravity * leftMaxHeight)) / Math.sin(maxAlpha);
            console.log(leftV0)
        }
    
        if(leftState === 'ONFLOOR' && leftOldState === 'ONOWNSLOPE') {
            leftV0 = Math.sqrt(Math.abs(2 * gravity * leftMaxHeight)) / Math.sin(maxAlpha);
            console.log(leftV0);
        }
    }

    
    if(side === 'right') {
        rightOldState = rightState;
        rightState = newState;

        if(rightState === 'ONFLOOR' && rightOldState === 'ONSLOPE') {
            rightV0 = -1 * Math.sqrt(Math.abs(2 * gravity * rightMaxHeight)) / Math.sin(maxAlpha);
        }

        if(rightState === 'ONFLOOR' && rightOldState === 'ONOWNSLOPE') {
            rightV0 = Math.sqrt(Math.abs(2 * gravity * rightMaxHeight)) / Math.sin(maxAlpha);
        }
    }
}
