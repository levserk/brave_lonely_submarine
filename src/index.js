import {run} from './game/index.js';

const init = () => {
    if (window.app) {
        document.body.removeChild(app.view);
        window.app.destroy();

    }
    window.app = run();
};

init();

window.onresize = () => {
    init();
};

if (screen) {
    try {
        screen.orientation.lock('landscape');
    } catch (err) {
        console.error(err);
    }
}

if (module.hot) {
    module.hot.accept(['./game/index.js'], () => {
        init();
    });
}