"use strict";

class Ball {
    constructor(type) {
        this.ballPosition = 0.65;
        this.type=type;
        this.positionX = this.type === 'left' ? -distance : distance;
        this.positionY = d / 2;
        this.color = this.type === 'left' ? '#00ff00ff' : '#0000ffff';
        this.onFloorPosition = 0;
        this.ballPositionOnSeesawEnd = this.type === 'left' ? -seesawHalfLength * this.ballPosition * Math.cos(aMax) : seesawHalfLength * this.ballPosition * Math.cos(aMax)
        this.seesawPosition = 0;
    }
    
    drawBall() {
        push();
            translate(centerX, centerY);
            translate(this.positionX * rX, (seesawHeight - d / 2) * rY);  
            fill(color(this.color));

            if(this.type === 'left') {
                rotate(leftAngle);
                circle(-seesawHalfLength * this.ballPosition * rX, d / 2 * rY, 32 * rX);
            } else {
                rotate(rightAngle);
                circle(seesawHalfLength * this.ballPosition * rX, d / 2 * rY, 32 * rX);
            }
        pop();
    }

    reset() {
        this.onFloorPosition = 0;
        this.ballPositionOnSeesawEnd = this.type === 'left' ? -seesawHalfLength * this.ballPosition * Math.cos(aMax) : seesawHalfLength * this.ballPosition * Math.cos(aMax)
        this.seesawPosition = 0;
        this.positionX = this.type === 'left' ? -distance : distance;
        this.positionY = d / 2;
    }    
}