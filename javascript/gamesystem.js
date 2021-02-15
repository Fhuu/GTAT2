function playGame() {
    resetButton.position(100, 30);
    windToggle.position(100, 60);

    resetButton.mousePressed(resetAll);

    initiateWorld();

    left.drawSystem();
    right.drawSystem();
   
    middleBall.draw();
    scoreSystem.draw();


    checkLimit();
    testBall.detectCollision();
}

function startGame() {
    push();
        textAlign(CENTER);
        windToggle.position(-100, -100);
        resetButton.position(centerX - 70, windowHeight / 2);
        resetButton.mousePressed(() => {
            scoreSystem.reset();
            gameState = 'PLAY';
            move = Math.random() < 0.5 ? 'l' : 'r';
        })
    pop();
}