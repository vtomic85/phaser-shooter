const gameSettings = {
    playerVelocity: 200,
    powerUpsVelocity: 50,
    shadowOffset: 3
}

const config = {
    width: 800,
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
