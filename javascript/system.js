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
        this.ball.drawBall();
        this.control.drawControl();
    }

    resetSystem() {
        this.state = 'START';
        this.vx = 0;
        this.vy = 0;
        this.ball.reset();
    }
}