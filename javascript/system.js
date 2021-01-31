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
            case 'COLLISION' :
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
        this.detectCollision(this.state);
    }

    releaseAfterPull(angle) {
        if(angle !== this.aMax) {
            this.state = 'FLY';
            this.ball.positionX = this.ball.positionX + this.ball.ballPositionOnSeesawEnd
            let v =  this.type === 'left' ? this.countVelocity(angle) : this.countVelocity(-angle);
            if(v > vMax) v = vMax;
            this.vx = v * Math.sin(aMax);
            this.vy = v * Math.cos(aMax);
            this.type === 'left' ? right.resetSystem() : left.resetSystem();
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
            if(this.state === 'FLY' || this.state === 'COLLISION') {
                let vx_ = this.vx + air;
                let tau = m / (luftDichte * cw * Math.PI * sq(d / 2));
                this.vx = this.vx + air - ((this.vx + air) * Math.sqrt(sq(this.vx) + sq(this.vy)) / (2 * tau)) * dt;
                this.vy = this.vy - (this.vy * Math.sqrt(sq(vx_) + sq(this.vy)) / (2 * tau) + g) * dt;
            }
        }
        if(this.type === 'right') {
            if(this.state === 'FLY' || this.state === 'COLLISION') {
                let vx_ = this.vx - air;
                let tau = m / (luftDichte * cw * Math.PI * sq(d / 2));
                this.vx = this.vx - air - ((this.vx - air) * Math.sqrt(sq(this.vx) + sq(this.vy)) / (2 * tau)) * dt;
                this.vy = this.vy - (this.vy * Math.sqrt(sq(vx_) + sq(this.vy)) / (2 * tau) + g) * dt;
            }
        }
    }

    detectCollision() {
        let distance = 10000000;
        switch(this.state) {
            case 'FLY' :
                distance = dist(this.ball.positionX, this.ball.positionY + seesawHeight + seesawHalfLength * this.ball.ballPosition * Math.sin(aMax), middleBall.x, middleBall.y);
                break;
            case 'ONFLOOR' :
                distance = dist(this.ball.positionX, this.ball.positionY, middleBall.x, middleBall.y);
                break;
        }
        if(distance < d / 2 + middleBall.d / 2 && this.state !== 'START') {
            if(this.state !== 'COLLISION')  {
                this.countCollideVelocity();
                this.state = 'COLLISION';
                middleBall.moveBall();
                if(Math.round(this.vy) === 0) this.state = 'ONFLOOR';
            }
        }
    }

    countCollideVelocity() {
        let vx = this.type === 'left' ? this.vx : -this.vx;
        let alpha = this.countAlpha();
        
        let newCoor = this.countZT(vx, this.vy, alpha - HALF_PI);
        let v1T = newCoor[0];
        let v1Z = newCoor[1];
        
        newCoor = this.countZT(middleBall.v, 0, alpha - HALF_PI );
        let v2T = newCoor[0];
        let v2Z = newCoor[1];
        
        let v1Z_ = ((m - middleBall.m) * v1Z + 2 * middleBall.m * v2Z) / (m + middleBall.m);
        
        newCoor = this.countZT(v1T, v1Z_, -alpha + HALF_PI);
        this.vx = this.type === 'left' ? newCoor[0] : -newCoor[0];
        this.vy = newCoor[1];
        
        let v2Z_ = ((middleBall.m - m) * v2Z + 2 * m * v1Z) / (m + middleBall.m);
        
        newCoor = this.countZT(v2T, v2Z_, -alpha + HALF_PI);
        middleBall.v = newCoor[0];
        
        this.vy = this.vy - newCoor[1];
    } 

    countAlpha() {
        switch(this.state) {
            case 'FLY' :
                return atan2(this.ball.positionY + seesawHeight + seesawHalfLength * this.ball.ballPosition * Math.sin(aMax) - middleBall.y, this.ball.positionX - middleBall.x);
            case 'ONFLOOR' :
                return atan2(this.ball.positionY - middleBall.y, this.ball.positionX  - middleBall.x);
            default :
                return null;
        }
    }

    countZT(x, y, phi) {
        var u = x * Math.cos(phi) + y * Math.sin(phi);
        var v = -x * Math.sin(phi) + y * Math.cos(phi);
        return [u, v];
    }

    resetSystem() {
        this.state = 'START';
        this.vx = 0;
        this.vy = 0;
        this.ball.reset();
    }
}