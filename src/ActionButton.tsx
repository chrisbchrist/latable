import React, { Component } from 'react';
import {Button, Icon, Tooltip} from 'antd';
import {ActionX} from "./Action";
import {observer} from "mobx-react";


export interface ActionButtonProps  {
    action: ActionX
    verbose?: boolean,
}

@observer
export class ActionButton extends Component<ActionButtonProps, any> {

    render() {

        const {icon, disabled, description, buttonProps } = this.props.action;
        const verbose = this.props.verbose;
        const text = this.props.action.text? this.props.action.text: "???";

        return (
            <Tooltip placement="bottom" title={description ? description : text}>
                <Button className="toolbar-button" disabled={disabled} {...buttonProps} onClick={ () => this.props.action.perform()} >
                    {icon ? <Icon type={icon}/> : null}
                    {verbose ? text : null}
                </Button>
            </Tooltip>
        );

    }

}

export default ActionButton;