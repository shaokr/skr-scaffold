/**
 * 开启调试: 点击5次并且按住5秒钟
 */
// import Systemjs from 'systemjs';
import param from 'util/param';
import Monitor from 'util/monitor';

const { debugToolOpen: windowDebugToolOpen, SystemJS, debugTool, Promise } = window;
let debug = false;
let monitorList = new Monitor();
const cachingTime = 1000 * 60 * 2;// // 设置清除缓存时间
// 开启
const debugToolOpen = () => {
    debug = true;
    if (debugTool) {
        monitorList.go(Promise.resolve(debugTool));
    } else if (SystemJS) {
        monitorList.go(SystemJS.import('debug-tool'));
    }
};
if (param.debug) {
    debug = true;
} else {
    setTimeout(() => {
        if (!debug) {
            monitorList = null;
        }
    }, cachingTime);
}
let i = 0;
let ct = 0;
const onClearTimeout = () => {
    if (i > 4) {
        i = 0;
        clearTimeout(ct);
    }
};
const onOpenDebug = () => {
    clearTimeout(ct);
    i++;
    if (i < 4) {
        ct = setTimeout(() => {
            i = 0;
        }, 500);
    } else {
        ct = setTimeout(() => {
            debugToolOpen();
            document.removeEventListener('click', onOpenDebug);
            document.removeEventListener('click', onClearTimeout);
        }, 5000);
    }
};
document.addEventListener('click', onOpenDebug);
document.addEventListener('click', onClearTimeout);

function tool(key, ...data) {
    if (monitorList) {
        monitorList.once((debugToolPromise) => {
            debugToolPromise.then((Tool) => {
                Tool(key, ...data);
            });
        });
        if (debug) {
            debugToolOpen();
        }
    }
}

window.debugToolOpen = () => {
    debugToolOpen();
    if (windowDebugToolOpen) windowDebugToolOpen();
};

export const log = tool.bind(this, 'log'); // .apply() (...data) => tool('log', ...data);

export default tool;
