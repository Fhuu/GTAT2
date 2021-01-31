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
        push();
            translate(centerX , centerY );
            fill(color(this.color));
            circle(this.x * rX, this.y * rY, this.d * rY);
        pop();
    }
    
}