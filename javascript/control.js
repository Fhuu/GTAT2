"use strict";

class Control {
    constructor(type) {
        this.type = type;
        if(this.type === 'left') {
            this.distance = -distance;
            this.seesawHalfLength = -seesawHalfLength;
        } else {
            this.distance = distance;
            this.seesawHalfLength = seesawHalfLength;
        }
    }

    drawControl() {
        let angle = this.type === 'left' ? leftAngle : rightAngle;
        push();
            translate(centerX, centerY);
            fill(color('#00000000'));
            
            if(this.isHovering(angle)) 
                stroke(color('#00000000'));
            else 
                stroke(color(0,0,0));

            push();
                translate(this.distance * rX, (seesawHeight - d/2) * rY);
                rotate(angle);
                circle(this.seesawHalfLength * rX, 0, 64 * rX);
            pop();
    
        pop();
    }

    isHovering(angle) {
        let dif = dist(mouseX - centerX, mouseY - centerY, (this.distance + this.seesawHalfLength * Math.cos(angle)) * rX,  (seesawHeight - this.seesawHalfLength * Math.sin(angle) - d / 2) * rY);

        if(dif < 32 *rX) {
            return true;
        }

        return false;
    }

    mouseControl() {
        let angle = Math.atan((mouseY - centerY - d / 2 * rX - seesawHeight * rY) / (mouseX - centerX - this.distance * rX));
        this.type === 'left' ? leftAngle = angle : rightAngle = angle;
    }
}