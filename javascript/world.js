"use strict";

function initiateWorld() {
    drawFloor();
    drawTriangle();
    makeText();
    scoreDetector();
    drawMovingTriangle();
    promptPlayer();
}

function drawFloor() {
    push();
        translate(centerX, centerY);
        line(-centerX, -16 * rY, centerX, -16 * rY);
    pop();
}

function drawTriangle() {
    push();
        fill(color(0,0,0));
    
        //LEFT
        push();
            translate(centerX, centerY);
            translate(-distance * rX, (-d / 2) * rY);
            triangle(0, seesawHeight * rY, triangleHalfLength * rX, 0, -triangleHalfLength * rX, 0);
        pop();


        //RIGHT
        push();
            translate(centerX, centerY);
            translate(distance * rX, (-d / 2) * rY);
            triangle(0, seesawHeight * rY, triangleHalfLength * rX, 0, -triangleHalfLength * rX, 0);
        pop();

    pop();
}

function makeText() {
    push();
        fill(0);
        textSize(40 * rX);
        text("Diro Baloska S0566367 31.12.2020", 400, 50);
        if(toggle) {
            if(air < 0) {
                text("Wind: <<< " + Math.abs(air) + "km/h", 400, 100);
            } else {
                text("Wind: >>> " + Math.abs(air) + "km/h", 400, 100);
            }
        } else {
            text("Wind aus", 400, 100);
        }
    pop();
}

function scoreDetector() {
    push();
        stroke(color('#ffffff'));
        translate(centerX, centerY);
        line(-470 * rX, -15 * rY, -420 * rX, -15 * rY);
        line(-470 * rX, -16 * rY, -420 * rX, -16 * rY);
        line(470 * rX, -15 * rY, 420 * rX, -15 * rY);
        line(470 * rX, -16 * rY, 420 * rX, -16 * rY);
    pop();
}

function drawMovingTriangle() {
    if(pos > 15) vz = -250;
    else if(pos < 0) vz = 250;
    pos = pos + dt * vz;
    push();
        textAlign(CENTER);
        noStroke();
        textSize(14);
        translate(centerX, centerY);
        fill(color('#0000ff'));
        text('target', -445 * rX, (pos + 45) * rY);
        triangle(-445 * rX, (pos + 20) * rY, -460 * rX, (pos + 40) * rY, -430 * rX, (pos + 40) * rY);
        fill(color('#00ff00'));
        text('target', 445 * rX, (-pos + 60) * rY);
        triangle(445 * rX, (-pos + 35) * rY, 460 * rX, (-pos + 55) * rY, 430 * rX, (-pos + 55) * rY);
    pop();
}

function promptPlayer(){
    push();
        translate(centerX, centerY);
        textAlign(CENTER);
        fill(color('#ffffff'));
        textSize(24);
        move === 'l' ? text('PLAYING', -445 * rX, (pos + 100) * rY) : text('PLAYING', 445 * rX, (-pos + 115) * rY);
    pop();
}