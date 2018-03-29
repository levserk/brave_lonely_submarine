const PIXI = require('pixi.js');

import Particle from './particle';

const MAX = 5000;
const TIME_LIFE = 1500;
const SPEED = 10;
const FRIC = 0.98;
const MAX_SIZE = 5;

const options = {
    scale: true,
    position: true,
    rotation: false,
    uvs: false,
    alpha: true
};



class Particles extends PIXI.Container {
    constructor(width, height) {
        super(MAX, options);

        this.maxWidht = width;
        this.maxHeight = height;
        console.log(this.maxWidht, this.maxHeight);
    }

    render(delta, hSpeed) {
        let removing = [];
        for (let particle of this.children) {
            particle.x -= hSpeed;
            particle.render(delta);
            particle.alpha -= Math.random() * 0.04;
            if (this.checkParticle(particle)) {
                removing.push(particle);
            }
        }

        for (let i = 0; i < removing.length; i++) {
            this.removeChild(removing[i]);
            removing[i].destroy();
        }
    }

    checkParticle(particle) {
        return (Date.now() - particle.timeCreation > TIME_LIFE ||
            particle.x < 0 - particle.width || particle.y < 0 - particle.height ||
            particle.x > this.maxWidht + particle.width || particle.y > this.maxHeight + particle.height ||
            particle.alpha < 0.05
        )
    }

    create(x, y, color) {
        for (let i = 0; i < 50; i++) {
            this.createParticle(x, y, color);
        }
    }

    createParticle(x, y, color, angle, speed, fric) {
        let particle = new Particle(Math.random() * MAX_SIZE, color);
        angle = angle || Math.random() * 2 * Math.PI;
        speed = speed || SPEED / 2 + Math.random() * SPEED / 3;
        fric = fric !== undefined ? fric : FRIC - Math.random() * 3 / 100;

        this.addChild(particle);
        particle.startColor = 0xffffff;
        particle.angle = angle;
        particle.speed = speed;
        particle.fric = fric;
        particle.x = x;
        particle.y = y;
        particle.hspeed = particle.speed * Math.cos(particle.angle);
        particle.vspeed = particle.speed * Math.sin(particle.angle);
    }
}

export default Particles;