import {BaseButtonProps} from "antd/es/button/button";
import {observable} from 'mobx'

export interface ActionProps {
    text?: string,
    description?: string,
    icon?: string,
    disabled?: boolean,
    buttonProps?: BaseButtonProps,
}

export abstract class ActionX implements ActionProps {

    @observable text?: string;
    @observable description?: string;
    @observable icon?: string;
    @observable disabled?: boolean;
    @observable buttonProps?: BaseButtonProps;

    abstract perform(): void
}

export abstract class ValidatableActionX<T> extends ActionX {

    source?: T; // validation source, usually a component which triggers validation

    abstract validate(): boolean
}

