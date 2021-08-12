class Beam extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene, scene.player.x, scene.player.y, "beam");
        scene.add.existing(this);
        scene.beams.add(this);
        this.play("beam");
        scene.physics.world.enableBody(this);
        this.body.velocity.y = -250;
    }

    update() {
        if (this.y < 10) {
            this.destroy();
        }
    }
}