const gameSettings = {
    playerSpeed: 200
}

const config = {
    width: 600,
    height: 600,
    scene: Game,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
