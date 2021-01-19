"use strict";

class System{
    constructor(type) {
        this.type = type;
        this.seesaw = new Seesaw(this.type);
        this.ball = new Ball(this.type);
        this.control = new Control(this.type);
        this.state = 'START';
        this.aMax = this.type === 'left' ? aMax : -aMax;
        this.v = 0;
        this.t = 0;
    }

    drawSystem() {
        this.seesaw.drawSeesaw();
        this.v = this.ball.countVelocity(this.state, this.v);
        this.ball.drawBall(this.state, this.v, this.t);
        this.control.drawControl();
        this.startCountTime();
        this.ballIsOnFloor();
        this.ballIsOnSeesaw();
    }

    releaseAfterPull(angle) {
        if(angle !== this.aMax) {
            this.state = 'FLY';
            this.v =  this.type === 'left' ? this.countVelocity(angle) : this.countVelocity(-angle);
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
            this.v = this.v * Math.sin(this.aMax);
        }
    }

    ballIsOnSeesaw() {
        if(Math.abs(this.ball.ballPositionOnSeesawEnd + this.ball.positionX  - this.seesaw.oppositeStartingPoint) < Math.abs(this.ball.onFloorPosition) && this.state === 'ONFLOOR') {
            this.state = 'ONSEESAW';
        }

        if(this.ball.seesawPosition < 0 && this.state === 'ONSEESAW') {
            this.ball.resetSeesawPosition();
            this.state = 'ONFLOORREVERSE';
        }

        if(Math.abs(this.ball.onFloorPosition) <= Math.abs(this.ball.ballPositionOnSeesawEnd + this.ball.positionX + this.seesaw.oppositeStartingPoint) && this.state === 'ONFLOORREVERSE') {
            this.state = 'ONOWNSEESAW';
        }

        if(this.ball.seesawPosition < 0 && this.state === 'ONOWNSEESAW') {
            this.ball.resetSeesawPosition();
            this.state = 'ONFLOOR';
        }
    }
}