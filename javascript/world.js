"use strict";

function initiateWorld() {
    drawFloor();
    drawTriangle();
    makeText();
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

function sliders () {
    velocitySlider = createSlider(0, 1, 1, 0.01);
    velocitySlider.position(500, 150);
    angleSlider = createSlider(-Math.PI, Math.PI, 0, 0.05);
    angleSlider.position(500,200);
}

function sliderText() {
    push();
        textSize(20);
        text('Velocity: ' + velocitySlider.value() + ' * 3500', 500, 140);
        text('Angle: ' + Math.round(angleSlider.value() * 180 / Math.PI), 500, 190);
    pop();
}

function directionText() {
    push();
        textSize(15);
        fill(color('#000000'));
        text('Press ENTER key to go through the states. Initial State: "OFF"', 25, 130);
        text('- OFF > not showing the test ball', 25, 150);
        text('- POSITION > position the ball with mouse click', 25, 170);
        text('- SET > set the velocity and angle', 25, 190);
        text('- MOVE > start the ball movement with given velocity and angle', 25, 210);
    pop();
}