class MiddleBall {

    constructor(x, y, d, m) {
        this.x = x;
        this.y = y;
        this.d = d;
        this.m = m;
        this.color = '#ff0000';
    }

    draw() {
        push();
            translate(centerX + this.x * rX, centerY + this.y * rY);
            fill(color(this.color));
            circle(0,0, this.d * rY);
        pop();
    }
    
}