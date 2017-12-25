/**
 * 开启调试: 点击5次并且按住5秒钟
 */
import Systemjs from 'systemjs';
import param from 'util/param';
import Monitor from 'util/monitor';

let debug = false;
let monitorList = new Monitor();

if (param.debug) {
    debug = true;
} else {
    // 2分钟设置清除缓存
    setTimeout(() => {
        if (!debug) {
            monitorList = null;
        }
    }, 1000 * 60 * 2);
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
            debug = true;
            monitorList.go(Systemjs.import('debug-tool'));
            document.removeEventListener('click', onOpenDebug);
            document.removeEventListener('click', onClearTimeout);
        }, 5000);
    }
};
document.addEventListener('click', onOpenDebug);
document.addEventListener('click', onClearTimeout);

function tool(key, ...data) {
    monitorList.once((debugToolPromise) => {
        debugToolPromise.then((Tool) => {
            Tool(key, ...data);
        });
    });
    if (debug) {
        monitorList.go(Systemjs.import('debug-tool'));
    }
}


export const log = tool.bind(this, 'log'); // .apply() (...data) => tool('log', ...data);

export default tool;
