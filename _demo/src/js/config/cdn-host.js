import env from './env';
import param from 'util/param';

const { location } = window;
// import 'common/widget/whatwg-fetch';
// 设置公私有cdn云地址
const _protocol = location.protocol === 'file:' ? 'http:' : location.protocol;

const host = {
    production: `${param.cdnHref}`,
    test: `${_protocol}//192.168.1.251:8282/fed/web-cdn`,
    cloud: `${location.origin}/fed/web-cdn`
}[env];

export default host;
