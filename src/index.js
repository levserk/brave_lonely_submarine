import {run} from './game/index.js';

const init = () => {
    window.app = run();
};

init();

if (module.hot) {
    module.hot.accept(['./game/index.js'], () => {
        document.body.removeChild(app.view);
        init();
    });
}