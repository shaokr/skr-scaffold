import _ from 'lodash';
import fedConst from 'fed-const';

export default (res, code = fedConst.SUCCESS) =>
  _.get(res, ['err_code']) === code || _.get(res, ['res', 'err_code']) === code;
