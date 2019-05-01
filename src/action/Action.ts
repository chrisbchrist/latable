import {BaseButtonProps} from "antd/es/button/button";
import {computed, observable} from 'mobx'

export interface ActionProps {
    text?: string;
    description?: string;
    icon?: string;
    disabled?: boolean;
    buttonProps?: BaseButtonProps;
}

export abstract class Action implements ActionProps {

    @observable text?: string;
    @observable description?: string;
    @observable icon?: string;
    @observable disabled?: boolean;
    @observable buttonProps?: BaseButtonProps;

    constructor( public readonly perform:() => void ){}

    // abstract perform(): void
}

export abstract class ValidatableAction<T> extends Action {

    @observable validationSource: T | null = null; // validation validationSource, usually a component which triggers validation

    constructor( perform:() => void ){
        super(perform)
    }

    @computed
    get disabled(): boolean {
        // disabled state is automatically derived from the validation result
        return !this.isValid()
    }

    // disabled state cannot be directly set
    set disabled(value: boolean) {
    }

    protected abstract isValid(): boolean

}
