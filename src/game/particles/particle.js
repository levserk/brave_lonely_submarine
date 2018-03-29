const PIXI = require('pixi.js');

const WHITE = 0xffffff;

class Particle extends PIXI.Graphics {
    constructor(size, color) {
        super();

        this.size = size > 3 ? size : 3;
        this.color = color;
        this.startColor = color;
        this.timeCreation = Date.now();
        this.hspeed = 0;
        this.vspeed = 0;
        this.haccel = 0;
        this.vaccel = 0;
        this.fric = 0.95;

        this.draw();
    }

    draw() {
        this.drawFilledCircleWithoutBounds(this.size, this.startColor, 1);
    }

    drawFilledCircleWithoutBounds(radius, color, alpha) {
        this.lineStyle(0);
        this.beginFill(color, alpha);
        this.drawCircle(0, 0, radius);
        this.endFill();
    }

    render() {
        this.hspeed = this.hspeed*this.fric + this.haccel;
        this.vspeed = this.vspeed*this.fric + this.vaccel;
        this.x += this.hspeed;
        this.y += this.vspeed;
    }
}

export default Particle;
