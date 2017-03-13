/**
 * 电子公告主要框
 */
import React, {Component} from 'react';

import {observer} from "mobx-react";

import {observable, action, computed, runInAction, useStrict, extendObservable} from "mobx";
useStrict(true);
import classnames from 'classnames'; // css样式名处理
/**
 * 测试数据类
 */
class TabStore {
    @observable groupList = {

	};

    // 创建动作
    @action('新增组') addGroupList = ({group,index}) =>{
		let groupList = {
			...this.groupList,
			[group]: index
		};
        extendObservable(this,{groupList});
    }

	// 切换tab
	@action('切换tab') changeGroupIndex = ({group,index}) =>{
		let groupList = this.groupList;
		groupList[group] = index;
        extendObservable(this,{groupList});
    }
};

let tabStore = new TabStore();
// 头部
@observer
class TabT extends Component {
	constructor(props){
		super(props);
		this.store = tabStore;
		this.store.addGroupList({
			group:props.group,
			index:0
		});
	}
	render(){
		let {props,store} = this;
		let index = store.groupList[props.group];
		return (
			<div>{
				props.children.map((el,i)=>{
					el.props.onClick = ()=>{
						store.changeGroupIndex({
							group:props.group,
							index:i
						})
					}
					if(i == index){
						el.props.className = classnames([el.props.className,'activate']);
					}
					return el
				})
			}</div>
		)
	}
}

@observer
class TabC extends Component {
	constructor(props){
		super(props);
		this.store = tabStore;
	}
	render(){
		let {props,store} = this;
		let index = store.groupList[props.group];
		console.log(props)
		return (
			<div>
				{
					props.children.map((el,i)=>{
						if(i == index){
							el.props.className = classnames([el.props.className,'activate']);
						}
						return el
					})
				}
			</div>
		)
	}
}
// 主
@observer
export default class NoticeMain extends Component{
	constructor(props){
		super(props);
	
	}

	render(){
		const {mobxData,lang} = this;
		return (
			<div>

				<TabT group='1' >
					<div className="asdas">1</div>
					<div>2</div>
					<div>3</div>
				</TabT>
				<div>siuqwoie</div>
				<TabC group='1' >
					<div>1</div>
					<div>2</div>
					<div>3</div>
				</TabC>

			</div>
		)
	}
}