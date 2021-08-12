class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
    }

    init(data) {
        this.score = data.score;
    }

    create() {
        this.add.text(config.width / 2, config.height / 2 - 50, "Game over").setOrigin(0.5);
        this.add.text(config.width / 2, config.height / 2, "SCORE: " + this.score).setOrigin(0.5);
        this.add.text(config.width / 2, config.height / 2 + 50, "Press SPACE to play again").setOrigin(0.5);

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            this.scene.start("Game");
        }
    }
}