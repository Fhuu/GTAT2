"use strict";

class ScoreSystem{

    constructor() {
        this.leftScore = 0;
        this.rightScore = 0;
   }

   draw() {
        push();

            textAlign(CENTER);
            text(this.leftScore + ' : ' + this.rightScore, centerX, centerY - 50);

        pop();
   }

   rightWin() {
       this.rightScore++;
   }

   leftWin(){
       this.leftScore++;
   }
}