
import _ from 'lodash';
import createUrl from 'util/create-url-params';
import log from 'util/log';

import './fetch';
import errCode from './err-code';


const scheme = window.location.protocol === 'file:' ? 'http:' : '';

export function toFetch(params, pkey, objectList = {}) {
    _.forEach(params, (val, key) => {
        let _key = key;
        if (pkey) _key = `${pkey}[${key}]`;
        if (val && (val.toString() === '[object File]' || val.toString() === '[object Blob]' || typeof val !== 'object')) {
            objectList[_key] = val;
        } else {
            toFetch(val, _key, objectList);
        }
    });
    return objectList;
}
let i = 0;
export function fetchParam({ host, url, param }) {
    const { body } = param;

    if (param.method === 'POST') {
        const _form = new FormData();
        _.forEach(toFetch(body), (v, k) => {
            _form.append(k, v);
        });
        param.body = _form;
    } else {
        url = createUrl(body, url);
        delete param.body;
    }

    const fetchApiUrl = `${scheme}//${host}/${url}`;
    const _i = i++;
    log([`${_i}请求:`, fetchApiUrl, param, ['body', body]], 'fetch请求');
    return window.fetch(fetchApiUrl, param)
        .then((res) => {
            let _res = '';
            if (res.ok) {
                try {
                    _res = res.json();
                } catch (err) {
                    _res = res.text();
                }
            }
            if (!_res) {
                _res = Promise.resolve(errCode(res.status));
            }
            _res.then((a)=>{
                log([`${_i}回调:`, a], 'fetch请求');
            });
            
            return _res;
        }).catch((e) => {
            log([`${_i}错误:`, e.toString(), e], 'fetch请求');
            return errCode(-3);
        });
}