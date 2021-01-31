"use strict";

class System{
    constructor(type) {
        this.type = type;
        this.seesaw = new Seesaw(this.type);
        this.ball = new Ball(this.type);
        this.control = new Control(this.type);
        this.state = 'START';
        this.aMax = this.type === 'left' ? aMax : -aMax;
        this.vx = 0;
        this.vy = 0;
        this.t = 0;
    }

    drawSystem() {
        this.seesaw.drawSeesaw();
        if(this.state === 'FLY') this.countFlyVelocity();
        this.countFloorVelocity();
        this.ball.drawBall(this.state, this.vx, this.vy, this.t);
        this.control.drawControl();
        this.ballIsOnFloor();
        this.ballIsOnSeesaw();
    }

    releaseAfterPull(angle) {
        if(angle !== this.aMax) {
            this.state = 'FLY';
            this.ball.positionX = this.ball.positionX + this.ball.ballPositionOnSeesawEnd
            let v =  this.type === 'left' ? this.countVelocity(angle) : this.countVelocity(-angle);
            if(v > vMax) v = vMax;
            this.vx = v * Math.sin(aMax);
            this.vy = v * Math.cos(aMax);
        }
    }

    countVelocity(angle) {
        return vMax / (2 * aMax) * Math.abs(angle - aMax);
    }

    ballIsOnFloor() {
        if(this.ball.positionY + seesawHeight + seesawHalfLength * this.ball.ballPosition * Math.sin(aMax)  <= 0 
        && (this.state === 'FLY' || this.state === 'COLLISION')) {
            this.state = 'ONFLOOR';
            this.vy = 0;
            this.ball.positionY = 0;
        }
    }

    ballIsOnSeesaw() {
        let v = this.type === 'left' ? this.vx : -this.vx;
        
        switch(this.type) {
            case 'left' :
                if(this.ball.positionX > distance - seesawHalfLength * Math.cos(aMax) && this.state === 'ONFLOOR') {
                    this.state = 'ONSEESAW';
                }

                if(this.ball.positionX < -distance + seesawHalfLength * Math.cos(aMax) && this.state === 'ONFLOOR') {
                    if(v < 0) this.state = 'ONOWNSEESAW';
                }

                break;

            case 'right' :
                if(this.ball.positionX < -distance + seesawHalfLength * Math.cos(aMax) && this.state === 'ONFLOOR') {
                    this.state = 'ONSEESAW';
                }

                if(this.ball.positionX > distance - seesawHalfLength * Math.cos(aMax) && this.state === 'ONFLOOR') {
                    if(v > 0) this.state = 'ONOWNSEESAW';
                }

                break;
        }

        if(this.ball.seesawPosition < 0 && this.state === 'ONSEESAW') {
            this.ball.resetSeesawPosition();
            this.state = 'ONFLOOR';
        }
        
        if(this.ball.seesawPosition < 0 && this.state === 'ONOWNSEESAW') {
            this.ball.resetSeesawPosition();
            this.state = 'ONFLOOR';
        }
    }

    countFloorVelocity() {
        let vorzeichen = this.vx < 0 ? -1 : 1; 

        if(this.state === 'ONSEESAW') {
            this.vx = this.vx - g * Math.sin(aMax) * dt;
        }

        if(this.state === 'ONOWNSEESAW') {
            this.vx = this.vx + g * Math.sin(aMax) * dt;
        }
    }

    countFlyVelocity() {

        this.vy = this.vy - g * dt / 2;

    }

    resetSystem() {
        this.state = 'START';
        this.vx = 0;
        this.vy = 0;
        this.ball.reset();
    }
}