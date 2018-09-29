/**
 * computed:计算
 */
import { computed } from 'mobx';

export class AppComputed {
  constructor(props) {
    this.props = props;
    const { store } = props;
    this.title = store.title;
    this.tab = store.tab;
  }
  // 创建计算
  @computed
  get total() {
    return this.title.data * this.title.data;
  }
}
