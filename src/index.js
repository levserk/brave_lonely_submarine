import {run} from './game/index.js';
import styles from './index.css';

const init = () => {
    if (window.app) {
        document.body.removeChild(app.view);
        window.app.destroy();

    }
    window.app = run();
};

window.onresize = () => {
    init();
};



if (module.hot) {
    module.hot.accept(['./game/index.js'], () => {
        init();
    });
}

var button = document.createElement(`div`);
button.innerHTML = "Start";
document.body.appendChild(button);
button.onclick = () => {
    if (screen) {
        try {
            screen.orientation.lock('landscape');
        } catch (err) {
            console.error(err);
        }
    }
    fullScreen(document.documentElement);

    document.body.removeChild(button);
    //init();
}

function fullScreen(element) {
    if(element.requestFullscreen) {
        element.requestFullscreen();
    } else if(element.webkitrequestFullscreen) {
        element.webkitRequestFullscreen();
    }  else if(element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    }  else if(element.mozRequestFullscreen) {
        element.mozRequestFullScreen();
    }
}