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
    
    drawBall(state, vx, vy, t) {
        switch(state) {
            case 'START' : 
                this.drawNormalBall();
                break;
            case 'FLY' :
                this.drawFlyingBall(vx, vy);
                break;
            case 'ONFLOOR' :
                this.drawOnFloorBall(vx);
                break;
            case 'ONSEESAW' :
                this.drawOnSlopeBall(vx);
                break;
            case 'ONOWNSEESAW' : 
                this.drawOnOwnSlopeBall(vx);
                break;
            case 'COLLISION' :
                this.drawFlyingBall(vx, vy);
                break;
        }
    }
    
    drawNormalBall() {
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
    

    drawFlyingBall(vx, vy) {
        
        this.positionX += this.type === 'left' ?  vx * dt : -vx * dt;
        this.positionY += vy * dt; 

        push();

            translate(centerX, centerY);
            translate(this.positionX * rX, (this.positionY + seesawHeight + seesawHalfLength * this.ballPosition * Math.sin(aMax)) * rY);
            
            fill(color(this.color));
            circle(0, 0, 32 * rX);

        pop();
    }

    drawOnFloorBall(v) {

        this.positionX += this.type === 'left' ? this.countFloorVector(v) : -this.countFloorVector(v);
        
        push();
            translate(centerX, centerY);
            translate(this.positionX * rX, this.positionY * rY);
                
            fill(color(this.color));
            circle(0, 0, d * rX);

        pop();
    }

    countFloorVector(v) {
        return v * dt;
    }

    drawOnSlopeBall(v) {

        this.seesawPosition += this.countSeesawVector(v);

        push();
            translate(centerX, centerY);
            translate(this.positionX * rX, 0);
            
            fill(color(this.color));
            if(this.type === 'left') {
                translate(this.onFloorPosition * rX, 0);
                rotate(rightAngle);
                circle(this.seesawPosition * rX, 0, 32 * rX);
            } else {
                translate(-this.onFloorPosition * rX, 0);
                rotate(leftAngle);
                circle(-this.seesawPosition * rX, 0, 32 * rX);
            }
        pop();
    }

    drawOnOwnSlopeBall(v) {

        this.seesawPosition -= this.countSeesawVector(v);
        console.log(this.seesawPosition);

        push();
            translate(centerX, centerY);
            translate(this.positionX * rX, 0);
            
            fill(color(this.color));
            if(this.type === 'left') {
                translate(this.onFloorPosition * rX, 0);
                rotate(leftAngle);
                circle(-this.seesawPosition * rX, 0, 32 * rX);
            } else {
                translate(-this.onFloorPosition * rX, 0);
                rotate(rightAngle);
                circle(this.seesawPosition * rX, 0, 32 * rX);
            }
        pop();
    }

    countSeesawVector(v) {
        return v * dt;
    }

    resetSeesawPosition() {
        this.seesawPosition = 0;
    }

    reset() {
        this.onFloorPosition = 0;
        this.ballPositionOnSeesawEnd = this.type === 'left' ? -seesawHalfLength * this.ballPosition * Math.cos(aMax) : seesawHalfLength * this.ballPosition * Math.cos(aMax)
        this.seesawPosition = 0;
        this.positionX = this.type === 'left' ? -distance : distance;
        this.positionY = d / 2;
    }    
}