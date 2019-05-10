import React from 'react';
import {Button, Icon, Tooltip} from 'antd';

import {BaseButtonProps} from "antd/es/button/button";
import {IconProps} from "antd/es/icon";

export interface ActionButtonProps extends BaseButtonProps {
    text?: string;
    description?: string;
    icon?: string;
    disabled?: boolean;
    iconProps?: IconProps;
    verbose?: boolean,
    perform? :() => void
}


export const ActionButton = (props: ActionButtonProps) => {

    const { icon, disabled, description, iconProps, verbose, perform, ...otherProps } = props;
    const text = props.text ? props.text : "???";

    const doPerform = () => { if (perform) perform() };

    return (
        <Tooltip placement="bottom" title={description ? description : text}>
            <Button className="toolbar-button"
                    disabled={disabled}
                    {...otherProps}
                    onClick={doPerform}
            >
                {icon ? <Icon {...iconProps} type={icon}/> : null}
                {verbose ? text : null}
            </Button>
        </Tooltip>
    );
};

export default React.memo(ActionButton);

