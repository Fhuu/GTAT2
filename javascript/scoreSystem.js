"use strict";

class ScoreSystem{

    constructor() {
        this.leftScore = 0;
        this.rightScore = 0;
   }

   draw() {
        push();
            fill(color('#ffffff'));
            textSize(36);
            textAlign(CENTER);
            text(this.leftScore + ' : ' + this.rightScore, centerX, centerY + 600 * rY);

        pop();
   }

   rightWin() {
       this.rightScore++;
   }

   leftWin(){
       this.leftScore++;
   }

   reset() {
       this.leftScore = 0;
       this.rightScore = 0;
   }
}