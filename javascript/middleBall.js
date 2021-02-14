class MiddleBall {

    constructor(d, m) {
        this.x = 0;
        this.y = 0;
        this.d = d;
        this.m = m;
        this.v = 0;
        this.angle = 0;
        this.color = color('#ff0000');
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
        push();
        translate(centerX , centerY );
        fill(this.color);
        circle(this.x * rX, this.y * rY, this.d * rY);
        pop();
    }
    
    drawMove() {
        let vorzeichen = this.v < 0 ? -1 : 1; 
        this.v = this.v - g * vorzeichen * Math.cos(0) * r * 12 * dt;
        this.x += this.v * dt;
        push();
            translate(centerX , centerY );
            fill(this.color);
            circle(this.x * rX, this.y * rY, this.d * rY);
        pop();
    }
    

    detectScore() {
        if(this.x > 435) {
            this.reset();
            left.resetSystem();
            right.resetSystem();
            scoreSystem.leftWin();
            move = 'r';
            if(toggle) createWind();
        }   

        if(this.x < - 435) {
            this.reset();
            left.resetSystem();
            right.resetSystem();
            scoreSystem.rightWin();
            move = 'l';
            if(toggle) createWind();
        }

        
    }
    
    moveBall() {
        this.state = 'MOVE';
    }

    stopBall() {
        if(this.state === 'MOVE') {
            if(this.v >= -9 && this.v <= 9) {
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