class Loading extends Phaser.Scene {
    constructor() {
        super("Loading");
    }

    preload() {
        this.load.image("background", "assets/images/bg.png");
        this.load.spritesheet("ship1", "assets/spritesheets/ship1.png", {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet("ship2", "assets/spritesheets/ship2.png", {frameWidth: 32, frameHeight: 16});
        this.load.spritesheet("ship3", "assets/spritesheets/ship3.png", {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet("explosion", "assets/spritesheets/explosion.png", {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet("powerUp", "assets/spritesheets/powerUp.png", {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet("player", "assets/spritesheets/player.png", {frameWidth: 16, frameHeight: 24});
        this.load.spritesheet("plane", "assets/spritesheets/plane.png", {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet("beam", "assets/spritesheets/beam.png", {frameWidth: 16, frameHeight: 16});
        this.load.bitmapFont("pixelFont", "assets/font/font.png", "assets/font/font.xml");
    }

    create() {
        this.add.text(config.width / 2, config.height - 20, "Loading...").setOrigin(0.5);
        this.add.text(config.width / 2, config.height / 2, "SPACE SHOOTER", {
            fontSize: '48px',
            fill: '#FF0'
        }).setOrigin(0.5);

        this.anims.create({
            key: "ship1_anim",
            frames: this.anims.generateFrameNumbers("ship1"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "ship2_anim",
            frames: this.anims.generateFrameNumbers("ship2"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "ship3_anim",
            frames: this.anims.generateFrameNumbers("ship3"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "explosion",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });

        this.anims.create({
            key: "red",
            frames: this.anims.generateFrameNumbers("powerUp", {
                start: 0,
                end: 1
            }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "gray",
            frames: this.anims.generateFrameNumbers("powerUp", {
                start: 2,
                end: 3
            }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "player",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "plane",
            frames: this.anims.generateFrameNumbers("plane"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "beam",
            frames: this.anims.generateFrameNumbers("beam"),
            frameRate: 20,
            repeat: -1
        });

        setTimeout(() => {
            this.scene.start("Game");
        }, 2000);
    }
}