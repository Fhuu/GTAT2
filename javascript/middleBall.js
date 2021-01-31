class MiddleBall {

    constructor(d, m) {
        this.x = 0;
        this.y = 0;
        this.d = d;
        this.m = m;
        this.v = 0;
        this.angle = 0;
        this.color = '#ff0000';
        this.state = 'STOP';
    }

    draw() {
        switch(this.state) {
            case 'STOP' :
                this.drawInitial();
                break;
            case 'MOVE' :
                this.drawMove();
                this.stopBall();
                break;
        }

        this.detectScore();
    }

    drawInitial() {
        textSize(32);
        fill(color('#000000'));
        text('Middle VX: ' + Math.round(this.v), 700, 130);
        text('Middle STATE: ' + this.state, 700, 100);
        push();
        translate(centerX , centerY );
        fill(color(this.color));
        circle(this.x * rX, this.y * rY, this.d * rY);
        pop();
    }
    
    drawMove() {
        let vorzeichen = this.v < 0 ? -1 : 1; 
        this.v = this.v - g * vorzeichen * Math.cos(0) * r * 7 * dt;
        this.x += this.v * dt;
        textSize(32);
        fill(color('#000000'));
        text('Middle VX: ' + Math.round(this.v), 700, 130);
        text('Middle STATE: ' + this.state, 700, 100);
        push();
            translate(centerX , centerY );
            fill(color(this.color));
            circle(this.x * rX, this.y * rY, this.d * rY);
        pop();
    }
    

    detectScore() {
        if(this.x > 435) {
            this.reset();
            left.resetSystem();
            right.resetSystem();
            scoreSystem.leftWin();
        }   

        if(this.x < - 435) {
            this.reset();
            left.resetSystem();
            right.resetSystem();
            scoreSystem.rightWin();
        }
    }
    
    moveBall() {
        this.state = 'MOVE';
    }

    stopBall() {
        if(this.state === 'MOVE') {
            if(this.v > -5 && this.v < 5) {
                this.state = 'STOP';
                this.v = 0;
            }
        }
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.v = 0;
    }
}