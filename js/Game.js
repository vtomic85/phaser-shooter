class Game extends Phaser.Scene {
    constructor() {
        super("SpaceDestroyer");
    }

    preload() {
        this.load.image("background", "assets/images/background.png");
        this.load.spritesheet("ship1", "assets/spritesheets/ship1.png", {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet("ship2", "assets/spritesheets/ship2.png", {frameWidth: 32, frameHeight: 16});
        this.load.spritesheet("ship3", "assets/spritesheets/ship3.png", {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet("explosion", "assets/spritesheets/explosion.png", {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet("powerUp", "assets/spritesheets/powerUp.png", {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet("player", "assets/spritesheets/player.png", {frameWidth: 16, frameHeight: 24});
        this.load.spritesheet("beam", "assets/spritesheets/beam.png", {frameWidth: 16, frameHeight: 16});
        this.load.bitmapFont("pixelFont", "assets/font/font.png", "assets/font/font.xml");
    }

    create() {
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0, 0);

        this.ship1 = this.add.sprite(config.width / 2 - 50, config.height / 2, "ship1");
        this.ship1.setScale(2);
        this.anims.create({
            key: "ship1_anim",
            frames: this.anims.generateFrameNumbers("ship1"),
            frameRate: 20,
            repeat: -1
        });

        this.ship2 = this.add.sprite(config.width / 2, config.height / 2, "ship2");
        this.ship2.setScale(2);
        this.anims.create({
            key: "ship2_anim",
            frames: this.anims.generateFrameNumbers("ship2"),
            frameRate: 20,
            repeat: -1
        });

        this.ship3 = this.add.sprite(config.width / 2 + 50, config.height / 2, "ship3");
        this.ship3.setScale(2);
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
            key: "beam",
            frames: this.anims.generateFrameNumbers("beam"),
            frameRate: 20,
            repeat: -1
        });

        this.powerUps = this.physics.add.group();
        const maxPowerUps = 4;
        for (let i = 0; i < maxPowerUps; i++) {
            let powerUp = this.physics.add.sprite(16, 16, "powerUp");
            this.powerUps.add(powerUp);
            powerUp.setRandomPosition(0, 0, game.config.width, game.config.height);

            if (Math.random() > 0.5) {
                powerUp.play("red");
            } else {
                powerUp.play("gray");
            }

            powerUp.setVelocity(Phaser.Math.Between(-50, 50), 50);
            powerUp.setCollideWorldBounds(true);
            powerUp.setBounce(1);
        }

        this.ship1.play("ship1_anim");
        this.ship2.play("ship2_anim");
        this.ship3.play("ship3_anim");

        this.ship1.setInteractive();
        this.ship2.setInteractive();
        this.ship3.setInteractive();

        this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player");
        this.player.setCollideWorldBounds(true);

        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.beams = this.add.group();

        this.input.on('gameobjectdown', this.destroyShip, this);

        this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);

        this.enemies = this.physics.add.group();

        this.enemies.add(this.ship1);
        this.enemies.add(this.ship2);
        this.enemies.add(this.ship3);

        this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);
        this.physics.add.overlap(this.beams, this.enemies, this.hitEnemy, null, this);

        this.score = 0;
        let graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 1);
        graphics.beginPath();
        graphics.moveTo(0, 0);
        graphics.lineTo(config.width, 0);
        graphics.lineTo(config.width, 20);
        graphics.lineTo(0, 20);
        graphics.lineTo(0, 0);
        graphics.closePath();
        graphics.fillPath();
        this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE 0", 16);
    }

    update() {
        this.moveShip(this.ship1, 1);
        this.moveShip(this.ship2, 2);
        this.moveShip(this.ship3, 3);
        this.background.tilePositionY -= 0.5;
        this.movePlayerManager();
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            if (this.player.active) {
                this.shootBeam();
            }
        }
        for (let i = 0; i < this.beams.getChildren().length; i++) {
            let beam = this.beams.getChildren()[i];
            beam.update();
        }
    }

    moveShip(ship, speed) {
        ship.y += speed;
        if (ship.y > config.height) {
            this.resetShipPosition(ship);
        }
    }

    resetShipPosition(ship) {
        ship.y = 0;
        ship.x = Phaser.Math.Between(10, config.width - 10);
    }

    resetPowerUp(powerUp) {
        powerUp.y = 0;
        powerUp.x = Phaser.Math.Between(10, config.width - 10);
    }

    destroyShip(pointer, gameObject) {
        gameObject.setTexture("explosion");
        gameObject.play("explosion");
    }

    movePlayerManager() {
        this.player.setVelocity(0, 0);

        if (this.cursorKeys.left.isDown) {
            this.player.setVelocityX(-gameSettings.playerSpeed);
        } else if (this.cursorKeys.right.isDown) {
            this.player.setVelocityX(gameSettings.playerSpeed);
        }

        if (this.cursorKeys.up.isDown) {
            this.player.setVelocityY(-gameSettings.playerSpeed);
        } else if (this.cursorKeys.down.isDown) {
            this.player.setVelocityY(gameSettings.playerSpeed);
        }
    }

    shootBeam() {
        let beam = new Beam(this);
    }

    beamHitsPowerUp(beam, powerUp) {
        beam.destroy();
    }

    pickPowerUp(player, powerUp) {
        this.resetPowerUp(powerUp);
    }

    hurtPlayer(player, enemy) {
        if (player.alpha == 1) {
            this.resetShipPosition(enemy);
            let explosion = new Explosion(this, player.x, player.y);
            player.disableBody(true, true);
            this.time.addEvent({
                delay: 1000,
                callback: this.resetPlayer,
                callbackScope: this,
                loop: false
            });
        }
    }

    hitEnemy(beam, enemy) {
        let explosion = new Explosion(this, enemy.x, enemy.y);
        beam.destroy();
        this.resetShipPosition(enemy);
        this.score += 10;
        const scoreFormatted = this.zeroPad(this.score, 6);
        this.scoreLabel.text = "SCORE " + scoreFormatted;
    }

    zeroPad(number, size) {
        let stringNumber = String(number);
        while (stringNumber.length < (size || 2)) {
            stringNumber = "0" + stringNumber;
        }
        return stringNumber;
    }

    resetPlayer() {
        const x = config.width / 2 - 8;
        const y = config.height + 64;
        this.player.enableBody(true, x, y, true, true);
        this.player.alpha = 0.5;

        let tween = this.tweens.add({
            targets: this.player,
            y: config.height - 64,
            ease: 'Power1',
            duration: 1500,
            repeat: 0,
            onComplete: function () {
                this.player.alpha = 1;
            },
            callbackScope: this
        })
    }
}