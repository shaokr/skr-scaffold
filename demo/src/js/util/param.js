/**
 * 解析参数等
 * shaokr 2018.3.14
 */
const { location } = window;
/**
 * 传入url可解析url中的参数
 */
export const getParam = url => {
  const args = {};
  let match = null;
  let search = url.match(/\?([^#]+)/);
  if (search) {
    search = search[1];
    const reg = /(?:([^&]+)=([^&]*))/g;
    while ((match = reg.exec(search)) !== null) {
      if (match[1]) {
        args[match[1]] = decodeURIComponent(match[2].replace(/\+/g, '%20'));
      }
    }
  }
  return args;
};
export const getGash = url => {
  const gash = url.match(/#(.+)/);
  if (gash) {
    return decodeURIComponent(gash[1].replace(/\+/g, '%20'));
  }
};

// 输出给外面的param处理
const param = getParam(location.href);
const debug = param.debug || window.debug;
if (typeof debug !== 'undefined') {
  param.debug = debug;
}
export default param;
