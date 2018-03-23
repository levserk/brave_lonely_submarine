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
    //init();
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
    document.addEventListener("webkitfullscreenchange", fullScreenChanged);
    document.addEventListener("mozfullscreenchange", fullScreenChanged);
    document.addEventListener("fullscreenchange", fullScreenChanged);
    fullScreen(document.documentElement);
    document.body.removeChild(button);
};

const fullScreenChanged = () => {
    if (screen) {
        try {
            screen.orientation.lock('landscape').then(() => {
                init();
            }).catch((err) => {
                console.error(err);
                init();
            });
        } catch (err) {
            console.error(err);
            init();
        }
    } else {
        init();
    }
};

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