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
var ratioX;     //ratio von Pixel pro 2mm in X
var ratioY;     //ratio von Pixel pro 2mm in Y
var centerX;    //0 Punkt des Kartesisches Systems in X Achse
var centerY;    //0 Punk des Kartesisches Systems in Y Achse

//*********** die folgenden Variablen sind Pflicht! *********************/
var canvas;
var canvasID = 'pTest'; // ist eine Variable!!!
var startButton;

//VARIABLE NEEDED FOR DYNAMIC MOVEMENT
var angleLeft, angleRight; //ANGLE FOR WIPPE
var leftVisibility, rightVisibility; //VISIBILITY OF DRAG CIRCLE
var leftStartY, rightStartY;
var leftControl, rightControl; //POSITION OF DRAG CIRCLE
var rightBallMovement, leftBallMovement; //FOR BALL MOVEMENT

//=====================PHYSICS VARIABLE=========================//
var changedTime;
var elasticityKonstant;


function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent(canvasID);
    
    ratioX = windowWidth / 2000;
    ratioY = windowHeight / 2000;

    centerX = windowWidth / 2;
    centerY = windowHeight - (0.2 * windowHeight);

    frmRate = 60;
    frameRate(frmRate);
    dt = 1.0 / frmRate;
    
    startButton = createButton('Start/Reset');
    startButton.position(100, 30);
    startButton.size(200);

    //DEFAULT, ANGLE ARE 20
    angleLeft = 20;
    angleRight = 20;
    //DEFAULT VISIBILITY OF DRAG CIRCLE ARE TRUE(THEY SHOULD BE VISIBLE)
    leftVisibility = true;
    rightVisibility = true;
    leftStartY = Math.tan(-angleLeft * Math.PI / 180) * 125/ ratioY * ratioX;
    rightStartY = Math.tan(-angleRight * Math.PI / 180) * 125/ ratioY * ratioX;
    //THE DEFAULT POSITION OF DRAG CIRCLE, IT TAKES THE ANGLE IN CONSIDERATION FOR THE STARTING POINT
    leftControl = createVector(-125, leftStartY);
    rightControl = createVector(125, rightStartY);
    //DEFAULT BALL MOVEMENT IS SET TO 0, THEY ARE NOT MOVING AT ALL IN INITIAL STATE
    leftBallMovement = createVector(0, 0);
    rightBallMovement = createVector(0, 0);    


    //=======PHYSICS SETUP========//
    changedTime = 0;
    elasticityKonstant = 2;
    //lets say ball's mass is 1
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
    

    //=================================Physics====================================//
    //Potential energie of the spring Ep = (1/2)*elasticityConstant*deltaPosition²
    
    checkLimit();
    let ep = elasticityKonstant * Math.pow(dist(0, leftControl.y, 0, leftStartY), 2);
    //If mass of ball is 1, then the starting velocity of the ball is:
    let leftV0 = Math.sqrt(ep * 2);
    // leftControl.y -= leftV0 * Math.cos(20 * Math.PI / 180) * deltaTime / 1000; 
    console.log(Math.atan(leftControl.y / 125) * 180/Math.PI);
    changedTime += deltaTime;
    if(changedTime >= 1000) {
        console.log(changedTime);
        changedTime = 0;
    }
    
    
    push();
    fill(0);
    textSize(40);
    text("Diro Baloska S0566367 24.10.2020", 400, 50);
    pop();

    push();

        //=================FLOOR===============//
        rectMode(CENTER);
        fill(color('#000000'));
        translate(centerX, centerY + 75 * ratioY);
        rect(0,0,windowWidth, 50 * ratioY);
        noStroke();
        //===============SCORE BOX============//
        //#region (scorebox) RELATIVE TO FLOOR
        push();
            rectMode(CENTER);
            fill(color('#ff0000'));
            translate(-450 * ratioX, -15 * ratioY);
            rect(0,0,50  * ratioX, 25 * ratioY);
        pop();

        push();
            rectMode(CENTER);
            fill(color('#ff0000'));
            translate(450 * ratioX, -15 * ratioY);
            rect(0,0,50  * ratioX, 25 * ratioY);
        pop();
        //#endregion
        //====================================//

        //===============MIDDLE BALL=================//
        //RELATIVE TO FLOOR
        push();
        fill(color('#ff0000'));
        stroke(color('#000000'));
        circle(0, -25 * ratioY - 16 * ratioX, 32 * ratioX);
        pop();
        //==========================================//
        
        //===============RIGHT SEESAW BUNDLE=================//
        push();
        
            //#region (RIGHT SUPPORT TRIANGLE) RELATIVE TO FLOOR
            fill(color(100,180,255));
            translate(600 * ratioX, -125 * ratioY);
            triangle(0, 0, -50 * ratioX, 100 * ratioY, 50 * ratioX, 100 * ratioY);
            //#endregion

            //#region (RIGHT SEESAW) RELATIVE TO FLOOR AND RIGHT SUPPORT TRIANGLE
            push();
                rectMode(CENTER);
                angleMode(DEGREES);
                rotate(-angleRight);
                fill(color(100,180,255));
                rect(0,0,250 * ratioX, 20 * ratioY);

                //#region (RIGHT TOP TRIANGLE) 
                push();
                    
                    //RIGHT TOP TRIANGLE RELATIVE TO FLOOR -> RIGHT SUPPORT TRIANGLE -> RIGHT SEESAW
                    push(); 
                        translate(90 * ratioX, -70 * ratioY);
                        triangle(0,0, 20 * ratioX, 70 * ratioY, -20 * ratioX, 70 * ratioY);

                        //PLAYABLE BALL RELATIVE TO TOP RIGHT TRIANGLE
                        push();
                            fill(color(0,255,0));
                            stroke(color(0,0,0));
                            translate(-rightBallMovement.x * ratioX, -rightBallMovement.y * ratioY);
                            circle(28 * ratioX, 28 * ratioY, 32 * ratioX);
                        pop();
                    pop();
                    
                    //DRAG CIRCLE RELATIVE TO FLOOR -> RIGHT SUPPORT TRIANGLE -> RIGTH SEESAW
                    fill(color('#00000000'));
                    if(rightVisibility)
                        stroke(color(0, 0, 0));
                    else 
                        noStroke();
                    rotate(angleRight);
                    circle(rightControl.x * ratioX, rightControl.y * ratioY, 64 * ratioX);

                pop();
                //#endregion

            pop();
            //#endregion

        pop();
        //#endregion
        //============================================//

        //===============LEFT SEESAW BUNDLE=================//
        //#region (WIPPE BUNDLE LINKS) 
        push();

            //#region (LEFT SUPPORT TRIANGLE) RELATIVE TO FLOOR
            fill(color(100,180,255));
            translate(-600 * ratioX, -125 * ratioY);
            triangle(0, 0, -50 * ratioX, 100 * ratioY, 50 * ratioX, 100 * ratioY);
            //#endregion

            //#region (LEFT SEESAW) RELATIVE TO FLOOR AND LINKS DREIECK SUPPORT
            push();
                rectMode(CENTER);
                angleMode(DEGREES);
                rotate(angleLeft);
                fill(color(100,180,255));
                rect(0,0,250 * ratioX, 20 * ratioY);

                //#region (LEFT TOP TRIANGLE) 
                push();

                    //LEFT TOP TRIANGLE RELATIVE TO FLOOR -> LEFT SUPPORT TRIANGLE -> LEFT SEESAW
                    push(); 
                        translate(-90 * ratioX, -70 * ratioY);
                        triangle(0,0, 20 * ratioX, 70 * ratioY, -20 * ratioX, 70 * ratioY);

                        //PLAYABLE BALL RELATIVE TO LEFT TOP TRIANGLE
                        push();
                            fill(color(0,0,255));
                            stroke(color(0,0,0));
                            translate(leftBallMovement.x * ratioX, -leftBallMovement.y * ratioY);
                            circle(-28 * ratioX, 28 * ratioY, 32 * ratioX);
                        pop();
                    pop();

                    //DRAG CIRCLE RELATIVE TO FLOOR -> LEFT SUPPORT TRIANGLE -> LEFT SEESAW
                    fill(color('#00000000'));
                    if(leftVisibility)
                        stroke(color(0, 0, 0));
                    else 
                        noStroke();
                    rotate(-angleLeft);
                    circle(leftControl.x * ratioX, leftControl.y * ratioY, 64 * ratioX);

                pop(); 
                //#endregion

            pop();
            //#endregion

        pop();
        //#endregion
    pop();

    //IS MOUSE OVER DRAG CIRCLE OBJECT
    isMouseOver();
}

//CHECK IF THE DRAG SHOULD BE VISIBLE,
//IF VISIBILITY IS TRUE, MOUSE IS OVER THE CIRCLE
//WHICH MEANS THE CIRCLE CAN BE DRAGGED
function mouseDragged() {
    if(!leftVisibility) {
        leftControl.y = (mouseY - centerY) / ratioY * ratioX + 125 - 75;
        angleLeft = -Math.atan((leftControl.y * ratioY) / (125 * ratioX)) * (180/Math.PI);        
    }

    if(!rightVisibility) {
        rightControl.y = (mouseY - centerY) / ratioY * ratioX + 125 - 75;
        angleRight = -Math.atan((rightControl.y * ratioY) / (125 * ratioX)) * (180/Math.PI);    
    }
}

//WHETHER THE MOUSE IS OVER DRAG CIRCLE OR NOT
var isMouseOver = () => {
    let dLeft = dist((-600 + leftControl.x) * ratioX, centerY + (75 - 125 + leftControl.y) * ratioY, (mouseX - centerX), mouseY);
    let dRight = dist((600 + rightControl.x) * ratioX, centerY + (75 - 125 + rightControl.y) * ratioY, (mouseX - centerX), mouseY);
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

var checkLimit = () => {
    //LEFT
    if(angleLeft > 20) {
        angleLeft = 20;
        leftControl.y = Math.tan(-angleLeft * Math.PI / 180) * 125 / ratioY * ratioX;
    }
    if(angleLeft < -20) {
        angleLeft = -20;
        leftControl.y = Math.tan(-angleLeft * Math.PI / 180) * 125 / ratioY * ratioX;
    }
    leftControl.x = -Math.sqrt(Math.pow(125, 2) - Math.pow(leftControl.y * ratioY, 2));

    //RIGHT
    if(angleRight > 20) {
        angleRight = 20;
        rightControl.y = Math.tan(-angleRight * Math.PI / 180) * 125 / ratioY * ratioX;
    }
    if(angleRight < -20) {
        angleRight = -20;
        rightControl.y = Math.tan(-angleRight * Math.PI / 180) * 125 / ratioY * ratioX;
    }
    rightControl.x = Math.sqrt(Math.pow(125, 2) - Math.pow(rightControl.y * ratioY, 2));
}

//RESET THE SCENE BACK TO DEFAULT
var reset = () => {
    angleLeft = 20;
    angleRight = 20;
    leftControl = createVector(-125,Math.tan(-angleLeft * Math.PI / 180) * 125 / ratioY * ratioX);
    rightControl = createVector(125,Math.tan(-angleRight * Math.PI / 180) * 125 / ratioY * ratioX);
    leftBallMovement = createVector(0,0);
    rightBallMovement = createVector(0,0);
}