import React, { Component } from 'react';
import {Button, Icon, Tooltip} from 'antd';
import {ButtonType} from "antd/lib/button";


export interface ActionProps {
    text: string,
    icon?: string,
    type?: ButtonType,
    extended?: boolean,
    perform: () => void
}


export class ActionButton extends Component<ActionProps, any> {

    render() {

        const {text, icon,extended, type } = this.props;

        let button = <Button className="toolbar-button"  type={type}>
            {icon?<Icon type={icon}/>: null}
            {extended? text: null}
        </Button>;

        return extended? button: <Tooltip placement="bottom" title={text}>{button}</Tooltip>

    }

}

export default ActionButton;