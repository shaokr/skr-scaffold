import Systemjs from 'systemjs';
import _ from 'lodash';
import createUrl from '../create-url-params';
import { log as utilLog } from '../debug-tool';
import PromiseClass from '../promise-class';

import errCode from './err-code';

const { Blob, File } = window;

if (!window.fetch && Systemjs) {
  Systemjs.import('fetch');
}

const scheme =
  window.location.protocol === 'file:' ? 'http:' : window.location.protocol;

const isBodyFilePrototype = val => {
  const valC = _.get(val, 'constructor', false);
  return (
    valC === _.get(File, 'prototype.constructor') ||
    valC === _.get(Blob, 'prototype.constructor')
  );
};
// 转换变量
export function toFetch(params, pkey, objectList = {}) {
  _.forEach(params, (val, key) => {
    let _key = key;
    if (pkey) _key = `${pkey}[${key}]`;
    if (
      typeof val !== 'undefined' &&
      (isBodyFilePrototype(val) || typeof val !== 'object')
    ) {
      objectList[_key] = val;
    } else {
      toFetch(val, _key, objectList);
    }
  });
  return objectList;
}

// 判断参数类型是否含文件
const isBodyFile = params => {
  let result = false;
  const twoforEachObj = [];
  _.forEach(params, val => {
    if (typeof val !== 'undefined' && isBodyFilePrototype(val)) {
      result = true;
      return false;
    } else if (typeof val === 'object') {
      twoforEachObj.push(val);
    }
  });
  if (!result) {
    _.forEach(twoforEachObj, val => {
      result = isBodyFile(val);
      return !result;
    });
  }
  return result;
};

let i = 0;
const log = a => utilLog(a, 'fetch请求');
export async function fetchParam({ host, url, param = {}, explain = '' }) {
  if (!window.fetch && Systemjs) {
    await Systemjs.import('fetch');
  }
  const { body = '' } = param;
  const _i = i++;
  const _promise = new PromiseClass();
  _promise.promise.abort = function(msg) {
    log([_i, 'abort中断', msg, ['请求参数:', body]]);
    _promise.resolve(errCode(-6));
  };
  if (!_.get(window, ['navigator', 'onLine'], true)) {
    // 先判断断网
    _promise.resolve(errCode('-8'));
    return _promise.promise;
  }
  let fetchApiUrl = urlJoin(url, host);
  if (param.method === 'POST') {
    let _form;
    if (param.isFormData || isBodyFile(body)) {
      _form = new FormData();
      _.forEach(toFetch(body), (v, k) => {
        _form.append(k, v);
      });
    } else if (param.isBodyJson) {
      param.headers = {
        'Content-Type': 'application/json;charset=utf-8'
      };
      _form = JSON.stringify(body);
    } else {
      param.headers = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      };
      _form = createUrl(body);
    }
    param.body = _form;
  } else {
    fetchApiUrl = createUrl(body, fetchApiUrl);
    delete param.body;
  }
  // 超时
  let timeout = param.timeout * 1;
  if (!_.isNumber(timeout) || _.isNaN(timeout)) {
    timeout = false;
  }

  log([_i, '请求', explain, fetchApiUrl, param, ['请求参数:', body]]);

  // 超时处理
  let timeoutId = 0;
  if (timeout !== false) {
    timeoutId = setTimeout(() => {
      log([_i, '超时', param.timeout, ['请求参数:', body]]);
      _promise.resolve(errCode(-5));
    }, timeout);
  }
  _promise.promise.then(res => {
    clearTimeout(timeoutId);
    if (res.err_code != '-5') log([_i, '回调', res, ['请求参数:', body]]);
  });

  const _fetch = window.fetch;
  _fetch(fetchApiUrl, param)
    .then(res => {
      let _res = '';
      if (res.ok) {
        const contentType = res.headers.get('Content-Type');
        if (contentType.match(/application\/json/)) {
          _res = res.json();
        } else if (contentType.match(/text\/html/)) {
          _res = res.text();
        } else {
          _res = res.blob();
        }
      }
      if (!_res) {
        _res = Promise.resolve(errCode(res.status));
      }
      _promise.resolve(_res);
    })
    .catch(e => {
      log([_i, '错误', e.toString(), e, ['请求参数:', body]]);
      _promise.resolve(errCode(-3));
    });
  return _promise.promise;
}

function urlJoin(url, host) {
  let fetchApiUrl = url ? `/${url}` : '';
  if (host.match(/^((http(|s):\/\/)|(\/\/))/)) {
    fetchApiUrl = `${host}${fetchApiUrl}`;
  } else {
    fetchApiUrl = `${scheme}//${host}${fetchApiUrl}`;
  }
  return fetchApiUrl;
}
