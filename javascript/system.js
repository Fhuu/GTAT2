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
        switch (this.state) {
            case 'FLY' :
                this.countFlyVelocity();
                break;
            case 'ONFLOOR' :
                this.countFloorVelocity();
                break;
        }
        this.countFloorVelocity();
        this.ball.drawBall(this.state, this.vx, this.vy, this.t);
        this.control.drawControl();
        this.startCountTime();
        this.ballIsOnFloor();
        this.ballIsOnSeesaw();
        // this.detectCollision(this.state);
    }

    releaseAfterPull(angle) {
        if(angle !== this.aMax) {
            this.state = 'FLY';
            this.ball.positionX = this.ball.positionX + this.ball.ballPositionOnSeesawEnd
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
        console.log(this.ball.positionY)
        if(this.ball.positionY + seesawHeight + seesawHalfLength * this.ball.ballPosition * Math.sin(aMax)  <= 0 
        && this.state === 'FLY') {
            this.state = 'ONFLOOR';
            // this.ball.transferPosFlyToFloor();
            this.vy = 0;
        }
    }

    ballIsOnSeesaw() {
        if(Math.abs(this.ball.positionX  - this.seesaw.oppositeStartingPoint) < Math.abs(this.ball.onFloorPosition) && this.state === 'ONFLOOR') {
            this.state = 'ONSEESAW';
        }

        if(this.ball.seesawPosition < 0 && this.state === 'ONSEESAW') {
            this.ball.resetSeesawPosition();
            this.state = 'ONFLOOR';
        }

        if(Math.abs(this.ball.onFloorPosition) <= Math.abs(this.ball.positionX + this.seesaw.oppositeStartingPoint) && this.state === 'ONFLOOR') {
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
        if(this.type === 'left') {
            if(this.state === 'FLY') {
                // console.log(this.type, this.vx);
                let vx_ = this.vx + air;
                let tau = m / (luftDichte * cw * Math.PI * sq(d / 2));
                this.vx = this.vx + air + ((this.vx + air) * Math.sqrt(sq(this.vx) + sq(this.vy)) / (2 * tau)) * dt;
                this.vy = this.vy - (this.vy * Math.sqrt(sq(vx_) + sq(this.vy)) / (2 * tau) + g) * dt;
            }
        }
        if(this.type === 'right') {
            if(this.state === 'FLY') {
                // console.log(this.type, this.vx);
                let vx_ = this.vx - air;
                let tau = m / (luftDichte * cw * Math.PI * sq(d / 2));
                this.vx = this.vx - air - ((this.vx - air) * Math.sqrt(sq(this.vx) + sq(this.vy)) / (2 * tau)) * dt;
                this.vy = this.vy - (this.vy * Math.sqrt(sq(vx_) + sq(this.vy)) / (2 * tau) + g) * dt;
            }
        }
    }

    detectCollision() {
        let x = 10000; 
        let y = 10000;
        let alpha = atan(1,0);
        switch(this.state) {
            case 'ONFLOOR' :
                x = Math.abs(this.ball.positionX) + Math.abs(this.ball.ballPositionOnSeesawEnd) - Math.abs(this.ball.onFloorPosition);
                y = 0;
                break;  
        }
        let distance = dist(x, y, middleBall.x, middleBall.y);
        // console.log(distance);
        if(distance < 16 + middleBall.d / 2) {
            this.state = 'COLLISION';
            this.countCollideVelocity(alpha);
        }
    }

    countCollideVelocity(alpha) {
        let newCoor = this.countZT(this.vx, this.vy, alpha - HALF_PI);
        let v1T = newCoor[0];
        let v1Z = newCoor[1];

        newCoor = this.countZT(middleBall.v, 0, alpha - HALF_PI );
        let v2T = newCoor[0];
        let v2Z = newCoor[1];
        console.log(v1T, v1Z);

        let v1Z_ = ((m - middleBall.m) * v1Z + 2 * middleBall.m * v2Z) / (m + middleBall.m);
        
        newCoor = this.countZT(v1T, v1Z_, -alpha + HALF_PI);
        this.vx = newCoor[0];
        this.vy = newCoor[1];

        let v2Z_ = ((middleBall.m - m) * v2Z + 2 * m * v1Z) / (m + middleBall.m);

        newCoor = this.countZT(v2T, v2Z_, -alpha + HALF_PI);
        middleBall.v = newCoor[0];

        this.vy = this.vy - newCoor[1];
    }

    countAlpha() {
        return atan2(this.y - middleBall.y, this.x - middleBall.x);
    }

    countZT(x, y, phi) {
        var u = x * Math.cos(phi) + y * Math.sin(phi);
        var v = -x * Math.sin(phi) + y * Math.cos(phi);
        return [u, v];
    }
}