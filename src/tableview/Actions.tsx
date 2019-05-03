import React, {useContext} from 'react';
import {DomainEntity, TableViewContext, TableViewState} from "./TableView"
import ActionButton, {ActionButtonProps} from "../action/ActionButton";

interface TableActionConfig<T extends DomainEntity, P extends ActionButtonProps > {
    props: P,
    defaultText: string,
    defaultIcon: string,
    isValid: (ctx: TableViewState<T>)=>boolean,
    doPerform: (props:P)=>void,
}

function TableAction<T extends DomainEntity, P extends ActionButtonProps >( config: TableActionConfig<T,P> ) {

    const context = useContext(TableViewContext);
    const { defaultText, defaultIcon, isValid, doPerform } = config;
    const { text, icon, perform, ...otherProps } = config.props;

    return (

        <ActionButton
            perform={() => perform? perform(): doPerform(config.props)}
            text={text ? text : defaultText}
            icon={icon ? icon : defaultIcon}
            verbose={context.verboseToolbar}
            disabled={!isValid(context)}
            {...otherProps}
        />

    );

}

export interface InsertTableActionProps<T extends DomainEntity> extends ActionButtonProps {
    onInsert: (item: T) => T
}

export function InsertTableAction<T extends DomainEntity>(props: InsertTableActionProps<T>) {
    return TableAction<T, InsertTableActionProps<T>>( {
        props      : props,
        defaultText: "Insert",
        defaultIcon: "plus",
        isValid    : () => true,
        doPerform  : () => {},
    });
}

export interface UpdateTableActionProps<T extends DomainEntity> extends ActionButtonProps {
    onUpdate: (item: T) => T
}

export function UpdateTableAction<T extends DomainEntity>(props: UpdateTableActionProps<T>) {

    return TableAction<T, UpdateTableActionProps<T>>( {
        props      : props,
        defaultText: "Edit",
        defaultIcon: "edit",
        isValid    : context => context.selectedRowKeys.length == 1,
        doPerform  : () => {},
    });
}

export interface RemoveTableActionProps<T extends DomainEntity> extends ActionButtonProps {
    onRemove: (item: T) => boolean
}

export function RemoveTableAction<T extends DomainEntity>(props: RemoveTableActionProps<T>) {

    return TableAction<T, RemoveTableActionProps<T>>( {
        props      : props,
        defaultText: "Delete",
        defaultIcon: "delete",
        isValid    : context => context.selectedRowKeys.length == 1,
        doPerform  : () => {},
    });

}
