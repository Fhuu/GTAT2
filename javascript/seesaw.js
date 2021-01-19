"use strict";

class Seesaw {
    constructor(type) {
        this.type = type;
        if(this.type === 'left') {
            this.position = -distance;
            this.oppositeStartingPoint = -this.position - seesawHalfLength * Math.cos(aMax);
        } else {
            this.position = distance;
            this.oppositeStartingPoint = -this.position + seesawHalfLength * Math.cos(aMax);
        }
    }

    drawSeesaw() {
        push();
            translate(centerX, centerY); // translate according to coordinate system
            translate(this.position * rX, (seesawHeight - d / 2) * rY); // translate to placement

            fill(color(0,0,0));
            
            if(this.type === 'left') {
                rotate(leftAngle);
                triangle(-60 * rX, 25 * rY, -68 * rX, 0, -52 * rX, 0);
            } else {
                rotate(rightAngle);
                triangle(60 * rX, 25 * rY, 68 * rX, 0, 52 * rX, 0);
            }
            line(-seesawHalfLength * rX, 0, seesawHalfLength * rX, 0);
        pop();
    }
}