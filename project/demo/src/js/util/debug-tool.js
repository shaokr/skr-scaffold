/**
 * 开启调试:(2分钟后会清除2分钟内的各种请求
 * 1.引入debugTool组件
 * 2.点击5次并且按住5秒钟
 * 3.url中存在debug的参数
 * 4.变量var debug = 1;
 * 5.执行debugToolOpen();
 */
// import Systemjs from 'systemjs';
import param from 'util/param';
import Monitor from 'util/monitor';

const {
  debugToolOpen: windowDebugToolOpen,
  SystemJS,
  debugTool,
  Promise
} = window;
let debug = !!debugTool;
let monitorList = new Monitor();
// 开启
const debugToolOpen = () => {
  debug = true;
  if (window.debugTool) {
    monitorList.go(Promise.resolve(window.debugTool));
  } else if (SystemJS) {
    monitorList.go(SystemJS.import('debug-tool'));
  }
};
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
      debugToolOpen();
      document.removeEventListener('click', onOpenDebug);
      document.removeEventListener('click', onClearTimeout);
    }, 5000);
  }
};
document.addEventListener('click', onOpenDebug);
document.addEventListener('click', onClearTimeout);

function tool(key, ...data) {
  if (monitorList && Promise) {
    return new Promise((resolve, reject) => {
      monitorList.once(debugToolPromise => {
        debugToolPromise
          .then(Tool => {
            if (typeof Tool !== 'function') {
              return Tool;
            }
            return Tool(key, ...data);
          })
          .then(resolve)
          .catch(reject);
      });
      if (debug) {
        debugToolOpen();
      }
    });
  }
}

window.debugToolOpen = () => {
  debugToolOpen();
  if (windowDebugToolOpen) windowDebugToolOpen();
};

export const log = tool.bind(this, 'log'); // .apply() (...data) => tool('log', ...data);

export default tool;
