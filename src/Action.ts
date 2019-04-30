import {BaseButtonProps} from "antd/es/button/button";


export interface ActionProps {
    text: string,
    description?: string,
    icon?: string,
    disabled?: boolean,
    buttonProps?: BaseButtonProps,
}

export interface Action extends ActionProps {
    perform: () => void
}

