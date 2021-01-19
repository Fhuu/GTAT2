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
        this.countFlyVelocity();
        this.countFloorVelocity();
        this.ball.drawBall(this.state, this.vx, this.vy, this.t);
        this.control.drawControl();
        this.startCountTime();
        this.ballIsOnFloor();
        this.ballIsOnSeesaw();
    }

    releaseAfterPull(angle) {
        if(angle !== this.aMax) {
            this.state = 'FLY';
            let v =  this.type === 'left' ? this.countVelocity(angle) : this.countVelocity(-angle);
            this.vx = v * Math.sin(aMax);
            this.vy = v * Math.cos(aMax);
        }
    }

    countVelocity(angle) {
        return vMax / (2 * aMax) * Math.abs(angle - aMax);
    }

    startCountTime() {
        if(this.state === 'FLY' || this.state === 'ONSEESAW' || this.state === 'ONOWNSEESAW')
            this.t = this.t + dt;
    }

    ballIsOnFloor() {
        if(this.ball.flyingPosition.y + (seesawHeight + seesawHalfLength * this.ball.ballPosition * Math.sin(aMax)) <= 0 
        && this.state === 'FLY') {
            this.state = 'ONFLOOR';
            this.ball.transferPosFlyToFloor();
        }
    }

    ballIsOnSeesaw() {
        if(Math.abs(this.ball.ballPositionOnSeesawEnd + this.ball.positionX  - this.seesaw.oppositeStartingPoint) < Math.abs(this.ball.onFloorPosition) && this.state === 'ONFLOOR') {
            this.state = 'ONSEESAW';
        }

        if(this.ball.seesawPosition < 0 && this.state === 'ONSEESAW') {
            this.ball.resetSeesawPosition();
            this.state = 'ONFLOOR';
        }

        if(Math.abs(this.ball.onFloorPosition) <= Math.abs(this.ball.ballPositionOnSeesawEnd + this.ball.positionX + this.seesaw.oppositeStartingPoint) && this.state === 'ONFLOOR') {
            this.state = 'ONOWNSEESAW';
        }

        if(this.ball.seesawPosition < 0 && this.state === 'ONOWNSEESAW') {
            this.ball.resetSeesawPosition();
            this.state = 'ONFLOOR';
        }
    }

    countFloorVelocity() {
        let vorzeichen = this.vx < 0 ? -1 : 1; 

        if(this.state === 'ONSEESAW') {
            this.vx = this.vx - g * (Math.sin(aMax) - vorzeichen * Math.cos(aMax) * r) * dt;
        }

        if(this.state === 'ONOWNSEESAW') {
            this.vx = this.vx + g * (Math.sin(aMax) - vorzeichen * Math.cos(aMax) * r) * dt;
        }
        
        if(this.state === 'ONFLOOR') {
            this.vx = this.vx - g * vorzeichen * Math.cos(0) * r * dt;
        }
    }

    countFlyVelocity() {
        if(this.state === 'FLY') {
            let vx_ = this.vx - air;
            let tau = m / (luftDichte * cw * Math.PI * sq(d / 2));
            this.vx = this.vx - air - ((this.vx - air) * Math.sqrt(sq(this.vx) + sq(this.vy)) / (2 * tau)) * dt;
            this.vy = this.vy - (this.vy * Math.sqrt(sq(vx_) + sq(this.vy)) / (2 * tau) + g) * dt;
        }
    }
}