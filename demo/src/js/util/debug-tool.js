/**
 * 开启调试: 点击5次并且按住5秒钟
 */
import Systemjs from 'systemjs';
import param from 'util/param';
import PromiseClass from 'util/promise-class';

const debug = new PromiseClass();
const debugTool = new PromiseClass();
if (param.debug) {
    debug.resolve();
}
debug.promise
	.then(() => Systemjs.import('debug-tool'))
	.then(debugTool.resolve);
let i = 0;
let ct = 0;
document.addEventListener('touchstart', () => {
    clearTimeout(ct);
    i++;
    if (i < 4) {
        ct = setTimeout(() => {
            i = 0;
        }, 500);
    } else {
        ct = setTimeout(() => {
            debug.resolve();
        }, 5000);
    }
});

document.addEventListener('touchend', () => {
    if (i > 4) {
        i = 0;
        clearTimeout(ct);
    }
});

function tool(key, ...data) {
    debugTool.promise.then((Tool) => {
        Tool(key, ...data);
    });
}

export const log = tool.bind(this, 'log'); // .apply() (...data) => tool('log', ...data);

export default tool;
