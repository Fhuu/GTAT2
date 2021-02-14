function playGame() {
    
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
    resetButton.mousePressed(() => {
        scoreSystem.reset();
        gameState = 'PLAY';
        move = Math.random() < 0.5 ? 'l' : 'r';
    })
}