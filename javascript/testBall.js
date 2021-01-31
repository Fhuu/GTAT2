class TestBall{
    constructor(x,y,d,m, v, angle) {
        this.x = x;
        this.y = y;
        this.d = d;
        this.m = m;
        this.v = v;
        this.vx = 0;
        this.vy = 0;
        this.angle = angle;
        this.state = 'OFF';
    }

    setVelocityInProzent(prozent) {
        this.v = this.v * prozent;
    }

    setAngle(angle) {
        this.angle = angle;
    }

    setMass(m) {
        this.m = m;
    }

    getVelocity() {
        return this.v;
    }

    getAngle() {
        return this.angle;
    }

    getMass() {
        return this.m;
    }

    draw() {
        switch(this.state) {
            case 'OFF': 
                break;
            case 'POSITION' :
                this.promptState();
                this.drawBegin();
                break;
            case 'SET' :
                this.promptState();
                this.drawBegin();
                break;
            case 'MOVE' :
                this.promptState();
                this.drawMove();
                break;
            case 'COLLISION' :
                this.promptState();
                this.drawCollision();
                break;
            default :
                this.promptState();
                this.drawBegin();
                break;
        }
    }

    promptState() {
        push();
        textSize(32);
        fill(color('#000000'));
        text('Testball STATE: "' + this.state + '"', 700, 160);
        text('Velocity: ' + this.v * velocitySlider.value(), 700, 190);
        text('VX: ' + Math.round(this.vx), 700, 220);
        text('VY: ' + Math.round(this.vy), 700, 250);
        text('X: ' + Math.round(this.x), 700, 280);
        text('Y: ' + Math.round(this.y), 700, 310);
        pop();
    }
    
    drawCollision() {
        // console.log(this.vx, this.vy);
        this.x += this.vx * dt;
        if(this.y > 0) {
            this.y += this.vy * dt;
        } else {
            this.y = 0;
        }
        push();
            translate(centerX + this.x * rX, centerY + this.y * rY);
            fill(color('#ffffff'));
            circle(0, 0, this.d * rX);
        pop();
    }

    drawMove() {
        this.x += this.v * Math.cos(this.angle) * dt;
        this.y += this.v * Math.sin(this.angle) * dt;
        let a1 = createVector(0, 0);
        let a2 = createVector(this.v / 10 * Math.cos(this.angle) * rX, this.v / 10 * Math.sin(this.angle) * rY);
        push();
            translate(centerX + this.x * rX, centerY + this.y * rY);
            fill(color('#fffffff'));
            circle(0, 0, this.d * rX);
            this.drawArrow(a1, a2, 'black');
        pop();
    }

    drawBegin() {
        this.setAngle(angleSlider.value());
        let a1 = createVector(0, 0);
        let a2 = createVector(this.v * velocitySlider.value() / 10 * Math.cos(this.angle) * rX, this.v * velocitySlider.value() / 10 * Math.sin(this.angle) * rY);
        push();
            translate(centerX + this.x * rX, centerY + this.y * rY);
            fill(color('#fffffff'));
            circle(0, 0, this.d * rX);
            this.drawArrow(a1, a2, 'black');
        pop();
    }

    drawArrow(base, vec, myColor) {
        push();
        stroke(myColor);
        strokeWeight(3);
        fill(myColor);
        translate(base.x, base.y);
        line(0, 0, vec.x, vec.y);
        rotate(vec.heading());
        let arrowSize = 7;
        translate(vec.mag() - arrowSize, 0);
        triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        pop();
    }

    stateChange() {
        switch(this.state) {
            case 'OFF':
                this.state = 'POSITION';
                break;
            case 'POSITION' : 
                this.state = 'SET';
                break;
            case 'SET' :
                this.state = 'MOVE';
                this.setVelocityInProzent(velocitySlider.value());
                break;
            case 'MOVE' :
                testBall.reset();
                velocitySlider.value(1);
                angleSlider.value(0);
                break;
            case 'COLLISION' :
                testBall.reset();
                velocitySlider.value(1);
                angleSlider.value(0);
                break;
        }
    }

    reset() {
        this.x = 0;
        this.y = centerY / 2 / rX;
        this.v = vMax;
        this.angle = 0;
        this.state = 'OFF';
    }

    detectCollision() {
        let distance = dist(this.x, this.y, middleBall.x, middleBall.y);
        if(distance < this.d / 2 + middleBall.d / 2) {
            if (this.state === 'MOVE') {
                this.countCollideVelocity();
                this.state = 'COLLISION';
                this.v = 0;
                middleBall.moveBall();
            }
        }
    }

    countCollideVelocity() {
        let alpha = this.countAlpha();

        let newCoor = this.countZT(this.v * Math.cos(this.angle), this.v * Math.sin(this.angle), alpha - HALF_PI);
        let v1T = newCoor[0];
        let v1Z = newCoor[1];

        newCoor = this.countZT(middleBall.v, 0, alpha - HALF_PI );
        let v2T = newCoor[0];
        let v2Z = newCoor[1];
        console.log(newCoor);

        let v1Z_ = ((this.m - middleBall.m) * v1Z + 2 * middleBall.m * v2Z) / (this.m + middleBall.m);
        
        newCoor = this.countZT(v1T, v1Z_, -alpha + HALF_PI);
        this.vx = newCoor[0];
        this.vy = newCoor[1];

        let v2Z_ = ((middleBall.m - this.m) * v2Z + 2 * this.m * v1Z) / (this.m + middleBall.m);

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