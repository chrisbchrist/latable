import React, { Component } from 'react';
import {Button, Icon, Tooltip} from 'antd';
import {ActionProps} from "./Action";


export interface ActionButtonProps extends ActionProps {
    extended?: boolean,
}

export class ActionButton extends Component<ActionButtonProps, any> {

    render() {

        const {text, icon, buttonType, disabled, extended } = this.props;

        let button =
            <Button className="toolbar-button" type={buttonType} disabled={disabled}>
                {icon?<Icon type={icon}/>: null}
                {extended? text: null}
            </Button>;

        return extended? button: <Tooltip placement="bottom" title={text}>{button}</Tooltip>

    }

}

export default ActionButton;