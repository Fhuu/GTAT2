"use strict";

function initiateWorld() {
    drawFloor();
    drawMiddleBall();
    drawTriangle();
    makeText();
}

function drawFloor() {
    push();
        translate(centerX, centerY);
        line(-centerX, -16 * rY, centerX, -16 * rY);
    pop();
}


function drawMiddleBall() {
    push();
        translate(centerX, centerY);
        fill(color(255,0,0));
        circle(0,0, d * rY);
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
        textSize(40);
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