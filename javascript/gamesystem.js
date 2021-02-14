function playGame() {
    
    initiateWorld();

    left.drawSystem();
    right.drawSystem();
   
    middleBall.draw();
    scoreSystem.draw();


    checkLimit();
    testBall.detectCollision();
}

function startGame() {
    resetButton.position(100, 30);
    resetButton.mousePressed(() => {
        gameState = 'PLAY';
    })
}