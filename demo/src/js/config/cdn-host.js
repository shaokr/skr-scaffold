/**
 * cdn根据环境变化地址
 */
import env from './env';
import param from 'util/param';

const { location } = window;
// import 'common/widget/whatwg-fetch';
// 设置公私有cdn云地址
const _protocol = location.protocol === 'file:' ? 'http:' : location.protocol;

const host = {
    production: `${param.cdnHref}`,
    test: `${_protocol}//192.168.1.251:8282`,
    cloud: `${location.origin}`
}[env];

export default host;
