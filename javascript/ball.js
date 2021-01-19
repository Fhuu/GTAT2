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
    
    drawBall(state, v, t) {
        switch(state) {
            case 'START' : 
                this.drawNormalBall();
                break;
            case 'FLY' :
                this.drawFlyingBall(v, t);
                break;
            case 'ONFLOOR' :
                this.drawOnFloorBall(v, t);
                break;
            case 'ONSEESAW' :
                this.drawOnSlopeBall(v, t);
                break;
            case 'ONFLOORREVERSE' :
                this.drawOnFloorBall(-v, t);
                break;
            case 'ONOWNSEESAW' : 
                this.drawOnOwnSlopeBall(v, t);
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

    drawFlyingBall(vin, t) {
        
        let vout = this.countFlyingVector(vin, t);
        this.flyingPosition.x += vout.x;
        this.flyingPosition.y += vout.y; 

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

    drawOnFloorBall(v) {

        this.onFloorPosition += v * dt;

        push();
            translate(centerX, centerY);
            translate(this.positionX * rX, 0);

            translate(this.ballPositionOnSeesawEnd * rX, 0);
            
            translate(this.onFloorPosition * rX, 0);

            // this.type === 'left' ? 
            //      :
            //     translate(-this.onFloorPosition * rX, 0);
                
            fill(color(this.color));
            circle(0, 0, d * rX);

        pop();
    }

    drawOnSlopeBall(v) {

        this.seesawPosition += v * dt;

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

    drawOnOwnSlopeBall(v, t) {

        this.seesawPosition -= v * dt;

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

    countVelocity(state, v) {
        switch(state) {
            case 'ONFLOOR' :
                return this.countFloorVelocity(v);
            case 'ONSEESAW' :
                return this.countSeesawVelocity(v);
            case 'ONFLOORREVERSE' :
                return this.countFloorVelocity(v);
            case 'ONOWNSEESAW' :
                return this.countSeesawVelocity(v);
            default : 
                return v;
        }
    }

    countFlyingVector(v, t) {
        return createVector(v * Math.sin(aMax) * dt, (v * Math.cos(aMax) - (g * t)) * dt);
    }

    countFloorVelocity(v) {
        return v - (g * r * dt);
    }

    transferPosFlyToFloor() {
        this.onFloorPosition = this.flyingPosition.x;
        this.flyingPosition = createVector(0,0);
    }

    countSeesawVelocity(v) {
        return v - ((g * Math.sin(aMax) - g * Math.cos(aMax) * r) * dt);
    }

    resetSeesawPosition() {
        this.seesawPosition = 0;
    }
}