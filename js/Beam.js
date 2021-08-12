class Beam extends Phaser.GameObjects.Sprite {
    constructor(scene, scaleFactor) {
        super(scene, scene.player.x, scene.player.y, "beam");
        scene.add.existing(this);
        scene.beams.add(this);
        this.play("beam");
        this.setScale(scaleFactor);
        scene.physics.world.enableBody(this);
        this.body.velocity.y = -250;
    }

    update() {
        if (this.y < 1) {
            this.destroy();
        }
    }
}