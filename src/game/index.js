import * as PIXI from 'pixi.js'
import textures from './textures'

let boxes = [],
    spites = [],
    hSpeed = 1,
    vAcl = 0.02,
    vMaxSpeed = 3,
    info,
    submarine,
    touchStartFlag = false,
    accelerometerEvent,
    magnetometerEvent;

export const run = () => {
    let app = createApp();
    document.body.appendChild(app.view);
    console.log(`game is run`);
    if (PIXI.loader.resources.submarine) {
        startGame(app)
    } else {
        PIXI.loader.add('submarine', textures.submarine)
            .load(() => {
                startGame(app)
            });
    }

    //monkey path app destroy
    let appdestroy = app.destroy;
    app.destroy = function () {
        destroy();
        appdestroy.bind(app)();
    }.bind(app);

    return app;
};

const destroy = () => {
    submarine = null;
    boxes = [];
};

const createApp = () => {
    let width = document.documentElement.clientWidth,
        height = document.documentElement.clientHeight;
    return new PIXI.Application(width, height, {
        backgroundColor: 0x334d5c,
        //antialiasing: true,
        //antialias: true,
        //forceFXAA: true,
        transparent: false,
        resolution: 1
    });
};

const BOX_COLOR = 0xd5d5d5;

const Box = (width, height, color) => {
    let graphics = new PIXI.Graphics();
    graphics.beginFill(color);
    graphics.lineStyle(1, color, 1);
    graphics.drawRect(0, 0, width, height);
    graphics.endFill();
    return graphics;
};

const createBox = (container, x, y) => {
    let box = Box(25, 25, BOX_COLOR);
    box.x = x;
    box.y = y;
    boxes.push(box);
    container.addChild(box);
};

const createSubmarine = (app) => {
    if (submarine) return submarine;
    submarine = new PIXI.Container();
    submarine.sprite = new PIXI.Sprite(PIXI.loader.resources.submarine.texture);
    submarine.addChild(submarine.sprite);
    submarine.sprite.height = submarine.sprite.height * 0.8;
    submarine.sprite.width = submarine.sprite.width * 0.8;
    submarine.sprite.anchor.set(0.5);
    submarine.vSpeed = 0;
    submarine.direction = 0;
    submarine.cacheAsBitmap = true;
    app.stage.addChild(submarine);
    submarine.x = app.screen.width / 2;
    submarine.y = app.screen.height / 2;
};

const removeObj = (app, obj) => {
    obj.removeed = true;
    app.stage.removeChild(obj);
};

const OUTBORDER_MAX_DISTANCE = 100;
const checkObjectIsOutBorders = (obj, app) => {
    let appWidth = app.screen.width,
        appHeight = app.screen.height,
        objWidth = obj.width,
        objHeight = obj.height;

    return (obj.x - objWidth < -OUTBORDER_MAX_DISTANCE || obj.y - objHeight < -OUTBORDER_MAX_DISTANCE ||
        obj.x > appWidth + OUTBORDER_MAX_DISTANCE || obj.y > appHeight + OUTBORDER_MAX_DISTANCE)
};


const startGame = (app) => {
    createSubmarine(app);
    createInfo(app);
    app.ticker.add((delta) => render(delta, app));

    window.onkeydown = (e) => onKeyDown(e.keyCode);
    window.onkeyup = (e) => onKeyUp(e.keyCode);

    document.body.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length) {
            for (let touch of e.touches){
                console.log('touchstart', touch.identifier, touch.pageX, touch.pageY, touch);
                touchStart(touch)
            }
        }
    }, false);
    document.body.addEventListener('touchend', (e) => {
        console.log('touchend', e);
        touchEnd()
    }, false);

    if(window.DeviceMotionEvent){
        window.addEventListener("devicemotion", motion, false);
    }else{
        console.log("DeviceMotionEvent is not supported");
    }

};

const UP_KEYCODE = 38;
const DOWN_KEYCODE = 40;
const onKeyDown = (keyCode) => {
    if (UP_KEYCODE === keyCode) {
        submarine.direction = -1;
    }
    if (DOWN_KEYCODE === keyCode) {
        submarine.direction = 1
    }
};

const onKeyUp = (keyCode) => {
    if (UP_KEYCODE === keyCode || DOWN_KEYCODE === keyCode) {
        submarine.direction = 0;
    }
};

const touchStart = (touch) => {
    console.log('touchStart', touch.pageX > app.screen.width / 2);
    touchStartFlag = true;
    if (touch.pageX > app.screen.width / 2 ) {
        submarine.direction = -1;
    } else {
        submarine.direction = 1
    }
};

const touchEnd = (touch) => {
    touchStartFlag = false;
    submarine.direction = 0;
};

const ORIENTATION_LANDSCAPE_PRIMARY = `landscape-primary`;
const ORIENTATION_LANDSCAPE_SECONDARY = `landscape-secondary`;
const ORIENTATION_PORTRAIT_PRIMARY = `portrait-primary`;
const ORIENTATION_PORTRAIT_SECONDARY = `portrait-secondary`;

const motion = (event) => {
    console.log("Accelerometer: ", event);
    accelerometerEvent = event;

    if (touchStartFlag) {
        return;
    }

    switch (window.screen.orientation) {
        case ORIENTATION_LANDSCAPE_PRIMARY:
            if (event.accelerationIncludingGravity.y < -1) {
                submarine.direction = -1;
                return;
            }
            if (event.accelerationIncludingGravity.y > 1) {
                submarine.direction = 1;
                return;
            }
            break;
        case ORIENTATION_LANDSCAPE_SECONDARY:
            if (event.accelerationIncludingGravity.y < -1) {
                submarine.direction = 1;
                return;
            }
            if (event.accelerationIncludingGravity.y > 1) {
                submarine.direction = -1;
                return;
            }
            break;
        case ORIENTATION_PORTRAIT_PRIMARY:
            if (event.accelerationIncludingGravity.x < -1) {
                submarine.direction = -1;
                return;
            }
            if (event.accelerationIncludingGravity.x > 1) {
                submarine.direction = 1;
                return;
            }
            break;
        case ORIENTATION_PORTRAIT_SECONDARY:
            if (event.accelerationIncludingGravity.x < -1) {
                submarine.direction = 1;
                return;
            }
            if (event.accelerationIncludingGravity.x > 1) {
                submarine.direction = -1;
                return;
            }
            break;
    }

    submarine.direction = 0;
};

const render = (delta, app) => {
    updateBoxes(delta, app);
    updateSubmarine(delta, app);
    showInfo(app);
    if (Math.random() > 0.96) {
        createBox(app.stage, app.screen.width - 25, Math.random() * (app.screen.height - 25));
    }
};

const updateSubmarine = (delta, app) => {
    //console.log(submarine.vSpeed, submarine.direction);
    submarine.vSpeed = submarine.vSpeed + vAcl  + (vAcl * 10 * submarine.direction);
    submarine.y += submarine.vSpeed;
    submarine.rotation = Math.atan2(submarine.vSpeed * 0.25 , hSpeed);
    if (submarine.y > app.screen.height - submarine.sprite.height || submarine.y < submarine.sprite.height) {
        submarine.y = app.screen.height / 2;
        submarine.vSpeed = 0;
    }
};

const updateBoxes = (delta, app) => {
    let removed = false;
    boxes.forEach((box) => {
        box.x += -hSpeed - delta;
        if (checkObjectIsOutBorders(box, app)) {
            removed = true;
            removeObj(app, box);
        }
    });

    boxes = removed ? boxes.filter(box => !box.removeed) : boxes;
};

const createInfo = (app) => {
    let style = new PIXI.TextStyle({
        fontSize: 12,
        fill: 'white'
    });
    info = new PIXI.Text(``, style);
    info.x = 10;
    info.y = 10;
    app.stage.addChild(info);

};

const showInfo = (app) => {
    info.text = `width: ${app.screen.width}, height: ${app.screen.height}, boxCount: ${boxes.length}` +
        (accelerometerEvent ? `\n accelerometerEvent: x: ${accelerometerEvent.accelerationIncludingGravity.x}` +
            `y: ${accelerometerEvent.accelerationIncludingGravity.y}` : ``) +
        (accelerometerEvent ? `\n accelerometerEvent acel: x: ${accelerometerEvent.acceleration.x}` +
            `y: ${accelerometerEvent.acceleration.y}` : ``) +
        (window.screen.orientation ? `\n orientation: ${window.screen.orientation.type}` : ``);
};

