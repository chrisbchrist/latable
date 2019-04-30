import React, { Component } from 'react';
import {Button, Icon, Tooltip} from 'antd';
import {ActionProps} from "./Action";


export interface ActionButtonProps extends ActionProps {
    verbose?: boolean,
}

export class ActionButton extends Component<ActionButtonProps, any> {

    render() {

        const {text, icon, disabled, verbose, description, buttonProps } = this.props;

        return (
            <Tooltip placement="bottom" title={description ? description : text}>
                <Button className="toolbar-button" disabled={disabled} {...buttonProps}>
                    {icon ? <Icon type={icon}/> : null}
                    {verbose ? text : null}
                </Button>
            </Tooltip>
        );

    }

}

export default ActionButton;