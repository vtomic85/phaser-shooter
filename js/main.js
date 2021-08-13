const gameSettings = {
    playerVelocity: 200,
    powerUpsVelocity: 50,
    shadowOffset: 3,
    enemyHitScoreIncrement: 10,
    powerUpPickedScoreIncrement: 1,
    deathScoreDecrement: 100
}

const config = {
    width: 1000,
    height: 800,
    scene: [Loading, Game, GameOver],
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
