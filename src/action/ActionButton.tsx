import React from 'react';
import {Button, Icon, Tooltip} from 'antd';

import {BaseButtonProps} from "antd/es/button/button";
import {IconProps} from "antd/es/icon";
import MenuItem from "antd/es/menu/MenuItem";

export interface ActionButtonProps extends BaseButtonProps {
    text?: string;
    description?: string;
    icon?: string;
    disabled?: boolean;
    iconProps?: IconProps;
    verbose?: boolean,
    perform :() => void
}


export const ActionButton = (props: ActionButtonProps) => {

    const { icon, disabled, description, iconProps, verbose, perform, ...otherProps } = props;
    const text = props.text ? props.text : "???";

    return (
        <Tooltip placement="bottom" title={description ? description : text}>
            <Button className="action-button"
                    disabled={disabled}
                    {...otherProps}
                    onClick={perform}
            >
                {icon ? <Icon {...iconProps} type={icon}/> : undefined}
                {verbose ? text : null}
            </Button>
        </Tooltip>
    );
};

export const ActionMenuItem = (props: ActionButtonProps) => {

    const { icon, disabled, description, iconProps, verbose, perform, ...otherProps } = props;
    const text = props.text ? props.text : "???";

    return (
            <MenuItem className="action-menu"
                    disabled={disabled}
                    {...otherProps}
                    onClick={perform}
            >
                {icon ? <Icon {...iconProps} type={icon}/> : undefined}
                {text}
            </MenuItem>
    );
};


export default React.memo(ActionButton);

