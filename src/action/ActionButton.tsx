import React from 'react';
import {Button, Icon, Tooltip} from 'antd';

import {BaseButtonProps} from "antd/es/button/button";
import {IconProps} from "antd/es/icon";

export interface ActionButtonProps {
    text?: string;
    description?: string;
    icon?: string;
    disabled?: boolean;
    buttonProps?: BaseButtonProps;
    iconProps?: IconProps;
    verbose?: boolean,
    perform? :() => void
}


export const ActionButton = (props: ActionButtonProps) => {

    const { icon, disabled, description, buttonProps, iconProps, verbose, perform } = props;
    const text = props.text ? props.text : "???";

    return (
        <Tooltip placement="bottom" title={description ? description : text}>
            <Button className="toolbar-button"
                    disabled={disabled}
                    {...buttonProps}
                    onClick={() => { if (perform) perform() }} >
                {icon ? <Icon {...iconProps} type={icon}/> : null}
                {verbose ? text : null}
            </Button>
        </Tooltip>
    );
};

export default React.memo(ActionButton);

