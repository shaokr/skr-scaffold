// let _

const { localStorage, sessionStorage } = window;

class Storage {
    constructor(props) {
        this.storage = props;
    }
    // 获取长度
    get longth() {
        return this.storage.length;
    }
    // 获取
    get(key) {
        return JSON.parse(this.storage.getItem(key));
    }
    // 设置
    set(key, val) {
        this.storage.setItem(key, JSON.stringify(val));
    }
    // 删除项
    remove(key) {
        this.storage.removeItem(key);
    }
    // 清除全部
    clear() {
        this.storage.clear();
    }
    has(key) {
        return this.storage.hasOwnProperty(key);
    }
}
export const local = new Storage(localStorage);
export const session = new Storage(sessionStorage);
export default {
    local, session
};
