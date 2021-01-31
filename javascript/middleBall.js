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

    reset() {
        this.x = 0;
        this.y = 0;
        this.v = 0;
    }
}