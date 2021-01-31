"use strict";

function setVariable() {
    //Einheit in mm

    d = 32;
    distance = 600;
    seesawHalfLength = 125;
    seesawHeight = 43;
    triangleHalfLength = 25;
    aMax = Math.asin(seesawHeight / seesawHalfLength);
    leftAngle = aMax;
    rightAngle = -aMax;

    middleBall = new MiddleBall(d);

    left = new System('left');
    right = new System('right');

}

function resetAll() {
    middleBall.reset();
    left.resetSystem();
    right.resetSystem();
}