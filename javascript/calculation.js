"use strict";

function checkLimit() {
    angleLimit();
}

function angleLimit() {

    //LEFT
    if(leftAngle > aMax)
        leftAngle = aMax;
    if(leftAngle < -aMax)
        leftAngle = -aMax;
        

    //RIGHT
    if(rightAngle > aMax)
        rightAngle = aMax;
    if(rightAngle < -aMax) 
        rightAngle = -aMax;
}

