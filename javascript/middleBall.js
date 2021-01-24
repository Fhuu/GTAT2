class MiddleBall {

    constructor(x, y, d, m) {
        this.x = x;
        this.y = y;
        this.d = d;
        this.m = m;
        this.v = 0;
        this.angle = 0;
        this.color = '#ff0000';
    }

    draw() {
        this.x += this.v * dt;
        // this.y = this.y > 0 : this.vy * dt ?;
        textSize(32);
        fill(color('#000000'));
        text('Middle VX: ' + Math.round(this.v), 700, 330);
        push();
            translate(centerX , centerY );
            fill(color(this.color));
            circle(this.x * rX, this.y * rY, this.d * rY);
        pop();
    }
    
}