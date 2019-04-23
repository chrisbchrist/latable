import {ButtonType} from "antd/es/button";


export interface ActionProps {
    text: string,
    icon?: string,
    disabled?: boolean
    buttonType?: ButtonType
}

export interface Action extends ActionProps {
    perform: () => void
}

