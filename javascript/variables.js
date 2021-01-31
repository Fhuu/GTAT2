"use strict";

function setVariable() {
    //Einheit in mm
    g = 9800;
    luftDichte = 1.2041 / 1000000; //g/mm³ in 20°
    m = 2.5;
    cw = 0.45;
    let vorzeichen = Math.random() < 0.5 ? -1 : 1;
    air = 0;
    r = 0.03;
    vMax = 3350;
    d = 32;
    distance = 600;
    seesawHalfLength = 125;
    seesawHeight = 43;
    triangleHalfLength = 25;
    aMax = Math.asin(seesawHeight / seesawHalfLength);
    leftAngle = aMax;
    rightAngle = -aMax;

    testBall = new TestBall(0,centerY / 2 / rX, d, m, vMax, 0);
    middleBall = new MiddleBall(d, m);

    left = new System('left');
    right = new System('right');

    scoreSystem = new ScoreSystem();
}