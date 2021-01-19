"use strict";

class Ball {
    constructor(type) {
        this.ballPosition = 0.65;
        this.type=type;
        this.positionX = this.type === 'left' ? -distance : distance;
        this.positionY = d / 2;
        this.color = this.type === 'left' ? '#00ff00ff' : '#0000ffff';
        this.flyingPosition = createVector(0,0);
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
                this.drawOnSlopeBall(vx, t);
                break;
            case 'ONOWNSEESAW' : 
                this.drawOnOwnSlopeBall(vx, t);
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
        
        this.flyingPosition.x += vx * dt;
        this.flyingPosition.y += vy * dt; 

        push();

            translate(centerX, centerY);
            translate(this.positionX * rX, (seesawHeight - d / 2) * rY);
            
            fill(color(this.color));

            if(this.type === 'left') {
                translate(this.ballPositionOnSeesawEnd * rX, (d / 2 + seesawHalfLength * this.ballPosition * Math.sin(aMax)) * rY); 
                circle(this.flyingPosition.x * rX, this.flyingPosition.y * rY, 32 * rX);
            } else {
                translate(this.ballPositionOnSeesawEnd * rX, (d / 2 + seesawHalfLength * this.ballPosition * Math.sin(aMax)) * rY);
                circle(-this.flyingPosition.x * rX, this.flyingPosition.y * rY, 32 * rX);
            }

        pop();
    }

    countXDrag(v, t) {
        return (0.5 * Math.PI * Math.pow(d / 2, 2) * luftDichte * Math.pow(v * Math.sin(aMax) + air * 1000000 / 3600, 2)) / m;
    }

    drawOnFloorBall(v) {

        this.onFloorPosition += this.countFloorVector(v);

        push();
            translate(centerX, centerY);
            translate(this.positionX * rX, 0);

            translate(this.ballPositionOnSeesawEnd * rX, 0);
            
            this.type === 'left' ? 
                translate(this.onFloorPosition * rX, 0) :
                translate(-this.onFloorPosition * rX, 0);
                
            fill(color(this.color));
            circle(0, 0, d * rX);

        pop();
    }

    countFloorVector(v) {
        return v * dt;
    }

    transferPosFlyToFloor() {
        this.onFloorPosition = this.flyingPosition.x;
        this.flyingPosition = createVector(0,0);
    }

    drawOnSlopeBall(v) {

        this.seesawPosition += this.countSeesawVector(v);

        push();
            translate(centerX, centerY);
            translate(this.positionX * rX, 0);
            translate(this.ballPositionOnSeesawEnd * rX, 0);
            
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
            translate(this.ballPositionOnSeesawEnd * rX, 0);
            
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
}