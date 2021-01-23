class TestBall{
    constructor(x,y,d,m, v, angle) {
        this.x = x;
        this.y = y;
        this.d = d;
        this.m = m;
        this.v = v;
        this.angle = angle;
        this.state = 'POSITION';
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
        this.promptState();
        switch(this.state) {
            case 'POSITION' :
                this.drawBegin();
                break;
            case 'SET' :
                this.drawBegin();
                break;
            case 'MOVE' :
                this.drawMove();
                break;
            default :
                this.drawBegin();
                break;
        }
    }

    promptState() {
        push();
        textSize(32);
        fill(color('#000000'));
        text('Testball STATE: "' + this.state + '"', 700, 150);
        text('Velocity: ' + this.v * velocitySlider.value(), 700, 180);
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
        }
    }

    reset() {
        this.x = 0;
        this.y = centerY / 2 / rX;
        this.v = vMax;
        this.angle = 0;
        this.state = 'POSITION';
    }
}