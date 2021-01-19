class TestBall{
    constructor(x,y,d,m, v, angle) {
        this.x = x;
        this.y = y;
        this.d = d;
        this.m = m;
        this.v = v;
        this.angle = angle;
        this.state = 'BEGIN';
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
            case 'BEGIN' :
                this.drawBegin();
                break;
        }
    }

    drawBegin() {
        let a1 = createVector(0, 0);
        let a2 = createVector(this.v / 10 * Math.cos(this.angle) * rX, this.v / 10 * Math.sin(this.angle) * rY);
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
}