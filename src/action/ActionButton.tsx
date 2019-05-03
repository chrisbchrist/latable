import React from 'react';
import {Button, Icon, Tooltip} from 'antd';

import {BaseButtonProps} from "antd/es/button/button";

export interface ActionButtonProps {
    text?: string;
    description?: string;
    icon?: string;
    disabled?: boolean;
    buttonProps?: BaseButtonProps;
    verbose?: boolean,
    perform? :() => void
}


export const ActionButton = (props: ActionButtonProps) => {

    const { icon, disabled, description, buttonProps, verbose, perform } = props;
    const text = props.text ? props.text : "???";

    return (
        <Tooltip placement="bottom" title={description ? description : text}>
            <Button className="toolbar-button"
                    disabled={disabled}
                    {...buttonProps}
                    onClick={() => { if (perform) perform() }} >
                {icon ? <Icon type={icon}/> : null}
                {verbose ? text : null}
            </Button>
        </Tooltip>
    );
};

export default ActionButton;

