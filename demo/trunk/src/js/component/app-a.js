/**
 * 例子
 */
import { Component } from 'react';

const Li = ({item}) => {
    return (
        <li>{item}</li>
    );
};

export default class AppA extends Component {
    render () {
        let {data} = this.props;
        return (
            <ul>
                {
                    data.map((item) => {
                        return <Li item={item} />;
                    })
                }
            </ul>
        );
    }
};
