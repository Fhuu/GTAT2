"use strict";

function setVariable() {
    //Einheit in mm
    g = 9800;
    r = 0.03;
    vMax = 3500;
    d = 32;
    distance = 600;
    seesawHalfLength = 125;
    seesawHeight = 43;
    triangleHalfLength = 25;
    aMax = Math.asin(seesawHeight / seesawHalfLength);
    leftAngle = aMax;
    rightAngle = -aMax;

    left = new System('left');
    right = new System('right');
}