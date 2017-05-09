
import _ from 'lodash';
import createUrl from 'util/create-url-params';

import './fetch';
import errCode from './err-code';

const scheme = window.location.protocol === 'file:' ? 'http:' : '';

export function toFetch(params, pkey, objectList = {}) {
    _.forEach(params, (val, key) => {
        let _key = key;
        if (pkey) _key = `${pkey}[${key}]`;
        // console.log(val,val.toString());
        if (val && (val.toString() === '[object File]' || val.toString() === '[object Blob]' || typeof val !== 'object')) {
            objectList[_key] = val;
        } else {
            toFetch(val, _key, objectList);
        }
    });
    return objectList;
}

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
    return window.fetch(fetchApiUrl, param)
        .then((res) => {
            // progress(res.clone());
            if (res.ok) {
                try {
                    return res.json();
                } catch (err) {}
                return res.text();
            }
            return errCode(res.status);
        }).catch((e) => {
            return errCode(-3);
        });
}
