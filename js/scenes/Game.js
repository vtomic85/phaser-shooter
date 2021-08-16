class Game extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    create() {
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0, 0);

        this.ship1 = this.add.sprite(config.width / 2 - 50, config.height / 2, "ship1");
        this.ship2 = this.add.sprite(config.width / 2, config.height / 2, "ship2");
        this.ship3 = this.add.sprite(config.width / 2 + 50, config.height / 2, "ship3");

        this.ship1.play("ship1_anim");
        this.ship2.play("ship2_anim");
        this.ship3.play("ship3_anim");

        this.powerUps = this.physics.add.group();
        for (let i = 0; i < gameSettings.maxPowerUps; i++) {
            let powerUp = this.physics.add.sprite(16, 16, "powerUp");
            this.powerUps.add(powerUp);
            powerUp.setRandomPosition(0, 0, game.config.width, game.config.height);

            if (Math.random() > 0.5) {
                powerUp.type = "points";
                powerUp.play("points");
            } else {
                powerUp.type = "life";
                powerUp.play("life");
            }

            powerUp.setVelocity(Phaser.Math.Between(
                -gameSettings.powerUpsVelocity,
                gameSettings.powerUpsVelocity
            ), gameSettings.powerUpsVelocity);
            powerUp.setCollideWorldBounds(true);
            powerUp.setBounce(1);
        }

        this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "plane");
        this.player.setCollideWorldBounds(true);
        this.player.play("plane");
        this.player.setDepth(2);

        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.beams = this.add.group();
        this.scaleFactor = 1;

        this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);

        this.enemies = this.physics.add.group();

        this.enemies.add(this.ship1);
        this.enemies.add(this.ship2);
        this.enemies.add(this.ship3);

        this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);
        this.physics.add.overlap(this.beams, this.enemies, this.hitEnemy, null, this);

        this.score = 0;
        this.lives = 3;

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
        const scoreFormatted = this.zeroPad(this.score, 6);
        this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE " + scoreFormatted, 16);
        this.livesLabel = this.add.bitmapText(config.width - 100, 5, "pixelFont", "LIVES 3");
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
        if (Math.random() > 0.5) {
            powerUp.type = "points";
            powerUp.play("points");
        } else {
            powerUp.type = "life";
            powerUp.play("life");
        }
        powerUp.y = 0;
        powerUp.x = Phaser.Math.Between(10, config.width - 10);
    }

    movePlayerManager() {
        this.player.setVelocity(0, 0);

        if (this.cursorKeys.left.isDown) {
            this.player.setVelocityX(-gameSettings.playerVelocity);
        } else if (this.cursorKeys.right.isDown) {
            this.player.setVelocityX(gameSettings.playerVelocity);
        }

        if (this.cursorKeys.up.isDown) {
            this.player.setVelocityY(-gameSettings.playerVelocity);
        } else if (this.cursorKeys.down.isDown) {
            this.player.setVelocityY(gameSettings.playerVelocity);
        }
    }

    shootBeam() {
        let beam = new Beam(this, this.scaleFactor || 1);
    }

    pickPowerUp(player, powerUp) {
        if (powerUp.type === "points") {
            let scoreIncrementText = this.add.text(powerUp.x, powerUp.y, "+" + gameSettings.powerUpPickedScoreIncrement, {
                font: 'bold',
                fill: '#FF0'
            });
            setTimeout(() => scoreIncrementText.destroy(), 2000);
            this.score += gameSettings.powerUpPickedScoreIncrement;
            const scoreFormatted = this.zeroPad(this.score, 6);
            this.scoreLabel.text = "SCORE " + scoreFormatted;
        } else {
            let lifeIncrementText = this.add.text(powerUp.x, powerUp.y, "1 UP", {
                font: 'bold',
                fill: '#0F0'
            });
            setTimeout(() => lifeIncrementText.destroy(), 2000);
            this.lives++;
            this.livesLabel.setText("LIVES " + this.lives);
        }
        this.resetPowerUp(powerUp);
    }

    hurtPlayer(player, enemy) {
        if (player.alpha == 1) {
            let scoreDecrementText = this.add.text(player.x, player.y, this.score >= 100 ? ("-" + gameSettings.deathScoreDecrement) : ("-" + this.score), {
                font: 'bold',
                fill: '#F00'
            });
            setTimeout(() => scoreDecrementText.destroy(), 2000);
            this.resetShipPosition(enemy);
            this.scaleFactor = 1;
            this.scoreToRemember = this.score;
            this.score = this.score < gameSettings.deathScoreDecrement ? 0 : this.score - gameSettings.deathScoreDecrement;
            const scoreFormatted = this.zeroPad(this.score, 6);
            this.scoreLabel.text = "SCORE " + scoreFormatted;
            let explosion = new Explosion(this, player.x, player.y);
            player.disableBody(true, true);
            this.lives--;
            this.livesLabel.setText("LIVES " + this.lives);
            if (this.lives > 0) {
                this.time.addEvent({
                    delay: 1000,
                    callback: this.resetPlayer,
                    callbackScope: this,
                    loop: false
                });
            } else {
                setTimeout(() => {
                    this.scene.start("GameOver", {
                        score: this.scoreToRemember
                    });
                }, 1000);
            }
        }
    }

    hitEnemy(beam, enemy) {
        let explosion = new Explosion(this, enemy.x, enemy.y);
        let scoreIncrementText = this.add.text(enemy.x, enemy.y, "+" + gameSettings.enemyHitScoreIncrement, {
            font: 'bold',
            fill: '#FF0'
        });
        setTimeout(() => scoreIncrementText.destroy(), 2000);
        beam.destroy();
        this.resetShipPosition(enemy);
        this.score += gameSettings.enemyHitScoreIncrement;
        const scoreFormatted = this.zeroPad(this.score, 6);
        this.scoreLabel.text = "SCORE " + scoreFormatted;
    }

    resetPlayer() {
        const x = config.width / 2 - 8;
        const y = config.height + 64;
        this.player.enableBody(true, x, y, true, true);
        this.player.setDepth(2);
        this.player.alpha = 0.5;

        this.tweens.add({
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

    zeroPad(number, size) {
        let stringNumber = String(number);
        while (stringNumber.length < (size || 2)) {
            stringNumber = "0" + stringNumber;
        }
        return stringNumber;
    }
}