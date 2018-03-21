const PIXI = require('pixi.js');

let boxes = [];

export const run = () => {
    let app = createApp();
    document.body.appendChild(app.view);
    console.log(`game is run`);
    startGame(app);
    return app;
};

const createApp = () => {
    let width = document.documentElement.clientWidth,
        height = document.documentElement.clientHeight;
        return new PIXI.Application(width, height, {
        backgroundColor: 0x014f63,
        //antialiasing: true,
        //antialias: true,
        //forceFXAA: true,
        transparent: false,
        resolution: 1
    });
};

const BOX_COLOR = 0x272d37;

const Box = (width, height, color) => {
    let graphics = new PIXI.Graphics();
    graphics.beginFill(color);
    graphics.lineStyle(1, color, 1);
    graphics.drawRect(0, 0, width, height);
    graphics.endFill();
    return graphics;
};

const createBox = (app) => {
    let box = Box(25, 25, BOX_COLOR),
        width = app.screen.width,
        height = app.screen.height;

    box.x = width - box.height;
    box.y = Math.random() * (height - box.height);
    boxes.push(box);
    app.stage.addChild(box);
};


const startGame = (app) => {
    createBox(app);
    app.ticker.add((delta) => render(delta, app));
};

const render = (delta, app) => {
    boxes.forEach((box) => {
        box.x += -1 - delta;
    });

    if (Math.random() > 0.96) {
        createBox(app)
    }
};

