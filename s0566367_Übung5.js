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
var triHeight;
var maxAlpha;
var angleLeft, angleRight; //ANGLE FOR WIPPE

//BALL VARIABLE
var ballPositionToSeesaw;
var leftBallStartPoint, rightBallStartPoint;

var leftIsPulled, rightIsPulled;
var leftVisibility, rightVisibility; //VISIBILITY OF DRAG CIRCLE
var leftStartY, rightStartY;
var leftControl, rightControl; //POSITION OF DRAG CIRCLE
var rightBallMovement, leftBallMovement; //FOR BALL MOVEMENT

//=====================PHYSICS VARIABLE=========================//
var gravity;

var leftChangedTime, rightChangedTime;
var elasticityKonstant;
var leftV0fromEP, rightV0fromEP;
var leftV0, rightV0;
var leftShouldLaunch, rightShouldLaunch;

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
    ballPositionToSeesaw = 6.5 / 10;
    leftBallStartPoint = createVector(-600 - 125 * ballPositionToSeesaw * Math.cos(angleLeft), 30 + Math.sin(angleLeft) * 125 * ballPositionToSeesaw);    
    rightBallStartPoint = createVector(600 + 125 * ballPositionToSeesaw * Math.cos(angleRight), 30 + Math.sin(angleRight) * 125 * ballPositionToSeesaw);
    
    leftIsPulled = false;
    rightIsPulled = false;
    //DEFAULT VISIBILITY OF DRAG CIRCLE ARE TRUE(THEY SHOULD BE VISIBLE)
    leftVisibility = true;
    rightVisibility = true;
    //THE DEFAULT POSITION OF DRAG CIRCLE, IT TAKES THE ANGLE IN CONSIDERATION FOR THE STARTING POINT
    leftControl = createVector(0, 0);
    rightControl = createVector(0, 0);
    //DEFAULT BALL MOVEMENT IS SET TO 0, THEY ARE NOT MOVING AT ALL IN INITIAL STATE
    leftBallMovement = createVector(0, 0);
    rightBallMovement = createVector(0, 0);    


    //=======PHYSICS SETUP========//
    gravity = 9.8;

    leftChangedTime = 1;
    rightChangedTime = 1;
    elasticityKonstant = 0.03;
    //lets say ball's mass is 1
    leftV0fromEP = 0;
    rightV0fromEP = 0;
    leftV0 = createVector(0,0);
    rightV0 = createVector(0,0);

    leftShouldLaunch = true;
    rightShouldLaunch = true;
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
    text("Diro Baloska S0566367 08.11.2020", 400, 50);
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
            triangle(-600 * rX, 30 * rY, -630 * rX, -16 * rY, -570 * rX, -16 * rY);
        pop();

        //SEESAW
        push();
            translate(-600 * rX, 30 * rY);
            rotate(angleLeft);
            line(-125 * rX, 0, 125 * rX, 0);
            fill(color(0,0,0));
            triangle(-60 * rX, 25 * rY, -68 * rX, 0, -52 * rX, 0);
        pop();
        push();
            fill(color('#00000000'));
            if(leftVisibility) 
            stroke(color(0,0,0));
            else
            stroke(color(255,0,0));
            circle((-600 - 125 * Math.cos(angleLeft)) * rX, (30 + 125 * Math.sin(angleLeft)) * rY, 64 * rX);
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
            triangle(600 * rX, 30 * rY, 630 * rX, -16 * rY, 570 * rX, -16 * rY);
        pop();

        //SEESAW
        push();
            translate(600 * rX, 30 * rY);
            rotate(-angleRight);
            line(-125 * rX, 0, 125 * rX, 0);
            fill(color(0,0,0));
            triangle(60 * rX, 25 * rY, 68 * rX, 0, 52 * rX, 0);
        pop();
        push();
            fill(color('#00000000'));
            if(rightVisibility) 
            stroke(color(0,0,0));
            else
            stroke(color(255,0,0));
            circle((600 + 125 * Math.cos(angleRight)) * rX, (30 + 125 * Math.sin(angleRight)) * rY, 64 * rX);
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
    //Potential energie of the spring Ep = (1/2)*elasticityConstant*deltaPosition²
    checkLimit();
    freeFall();
    moveBalls();


    //================================Collision===================================//
    isOnFloor();
    verticalLimit();
    // angleLeft -= 0.01;
}


var changeBallAngle = () => {
    if(leftBallMovement.x < 125 * rX)
    leftBallStartPoint = createVector(-600 - 125 * ballPositionToSeesaw * Math.cos(angleLeft) + 16 * Math.sin(angleLeft), 30 + Math.sin(angleLeft) * 125 * ballPositionToSeesaw + Math.cos(angleLeft) * 16);
    
    if(rightBallMovement.x > -125 * rX)
    rightBallStartPoint = createVector(600 + 125 * ballPositionToSeesaw * Math.cos(angleRight) - 16 * Math.sin(angleRight), 30 + Math.sin(angleRight) * 125 * ballPositionToSeesaw + Math.cos(angleRight) * 16);
    
}

//CHECK IF THE DRAG SHOULD BE VISIBLE,
//IF VISIBILITY IS TRUE, MOUSE IS OVER THE CIRCLE
//WHICH MEANS THE CIRCLE CAN BE DRAGGED
function mouseDragged() {
    if(!leftVisibility) {
        angleLeft = Math.atan((centerY - 30 - mouseY) * rX / 125);
        getVelocity0FromPotentialEnergy(true);
        leftIsPulled = true;
    } 

    if(!rightVisibility) {
        angleRight = Math.atan((centerY - 30 - mouseY) * rX / 125);    
        getVelocity0FromPotentialEnergy(false);
        rightIsPulled = true;
    } 
}

//WHETHER THE MOUSE IS OVER DRAG CIRCLE OR NOT
var isMouseOver = () => {
    let dLeft = dist(centerX + (-600 - 125 * Math.cos(angleLeft)) * rX, centerY + (30 + 125 * Math.sin(angleLeft))  * rY, mouseX, mouseY);
    if(dLeft < 32) {
        leftVisibility = false;
    } else {
        leftVisibility = true;
        if(angleLeft !== maxAlpha) {
            angleLeft += leftV0fromEP / 125 * rX;
        }
    }

    let dRight = dist(centerX + (600 + 125 * Math.cos(angleRight)) * rX, centerY + (30 + 125 * Math.sin(angleRight))  * rY, mouseX, mouseY);
    if(dRight < 32) {
        rightVisibility = false;
    } else {
        rightVisibility = true;
        if(angleRight !== maxAlpha) {
            angleRight += rightV0fromEP / 125 * rX;
        }
    }
}

var isOnFloor = () => {
    if(leftBallStartPoint.y + leftBallMovement.y < 0) {
        leftBallMovement.y = -leftBallStartPoint.y;    
        leftShouldLaunch = false;
    }
    if(rightBallStartPoint.y + rightBallMovement.y < 0) {
        rightBallMovement.y = -rightBallStartPoint.y;
        rightShouldLaunch = false;
    }
}

var verticalLimit = () => {
    // leftBallMovement.x += 10;
    // rightBallMovement.x -= 10;
    // console.log(centerX + 600);
    // console.log(leftBallStartPoint.x + leftBallMovement.x);
    if(leftBallMovement.x > 2 * centerX - 32 * rX && leftBallMovement.y + centerY - 16 + leftBallMovement.y < centerY + 46) 
        leftBallMovement.x = 2 * centerX - 32 * rX;

    if(rightBallMovement.x < -  2 * centerX + 32 * rX && rightBallMovement.y + centerY - 16 + rightBallMovement.y < centerY + 46) 
        rightBallMovement.x = - 2 * centerX + 32 * rX;
    
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
    leftChangedTime = 1;
    rightChangedTime = 1;
    leftShouldLaunch = true;
    leftIsPulled = false;
    leftV0fromEP = 0;
    leftV0 = 0;
    rightShouldLaunch = true;
    rightIsPulled = false;
    rightV0fromEP = 0;
    rightV0 = 0;
}

//=========================PHYSICS FUNCTION=============================//
var freeFall = () => {
    if(leftBallMovement.x >= 1)
    leftBallMovement.y -= gravity * leftChangedTime * leftChangedTime;
    
    if(rightBallMovement.x <= -1)
    rightBallMovement.y -= gravity * rightChangedTime * rightChangedTime;
}

var getVelocity0FromPotentialEnergy = (leftOrRight) => {
    if(leftOrRight) {
        let leftInitialPosition = createVector((-600 - 125 * Math.cos(maxAlpha)) * rX, (30 + 125 * Math.sin(maxAlpha)) * rY);
        let leftActualPosition = createVector((-600 - 125 * Math.cos(angleLeft)) * rX, (30 + 125 * Math.sin(angleLeft)) * rY);
        let difference = dist(leftInitialPosition.x, leftInitialPosition.y, leftActualPosition.x, leftActualPosition.y);
        let epLeft = elasticityKonstant * Math.pow(difference, 2);
        //If mass of ball is 1, then the starting velocity of the ball is:
        leftV0fromEP = Math.sqrt(epLeft * 2);
        leftV0 = createVector(-leftV0fromEP * Math.sin(angleLeft), -leftV0fromEP * Math.cos(angleLeft));
    } else {
        let rightInitialPosition = createVector((600 + 125 * Math.cos(maxAlpha)) * rX, (30 + 125 * Math.sin(maxAlpha)) * rY);
        let rightActualPosition = createVector((600 + 125 * Math.cos(angleRight)) * rX, (30 + 125 * Math.sin(angleRight)) * rY);
        let difference = dist(rightInitialPosition.x, rightInitialPosition.y, rightActualPosition.x, rightActualPosition.y);
        let epRight = elasticityKonstant * Math.pow(difference, 2);
        //If mass of ball is 1, then the starting velocity of the ball is:
        rightV0fromEP = Math.sqrt(epRight * 2);
        rightV0 = createVector(-rightV0fromEP * Math.sin(angleRight), -rightV0fromEP * Math.cos(angleRight));
    }
}

var moveBalls = () => {
    if(angleLeft == maxAlpha && leftIsPulled && leftShouldLaunch) {
        leftBallMovement.x += leftV0.x * leftChangedTime;
        leftBallMovement.y -= leftV0.y * leftChangedTime;
        leftChangedTime += deltaTime / 1000;
    }
    if(angleRight == maxAlpha && rightIsPulled && rightShouldLaunch) {
        rightBallMovement.x -= rightV0.x * rightChangedTime;
        rightBallMovement.y -= rightV0.y * rightChangedTime;
        rightChangedTime += deltaTime / 1000;
    }
}

var changeBackSeesaw = () => {
    
    
    
}