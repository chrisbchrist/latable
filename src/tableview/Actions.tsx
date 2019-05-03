import React, {useContext} from 'react';
import {DomainEntity, TableViewContext} from "./TableView"
import ActionButton, {ActionButtonProps} from "../action/ActionButton";

interface TableActionConfig<T extends DomainEntity> extends ActionButtonProps {
    isValid: (ctx: TableViewContext<T>)=>boolean,
    doPerform: (ctx: TableViewContext<T>)=>void,
}

function TableAction<T extends DomainEntity, P extends ActionButtonProps >( config: TableActionConfig<T> ) {

    const context = useContext(TableViewContext);
    const { perform, isValid, doPerform, ...otherProps } = config;

    return (

        <ActionButton
            perform={() => perform? perform(): doPerform(context)}
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
    return (
        <TableAction
            text="Insert"
            icon="plus"
            isValid={() => true}
            doPerform={() => {}} //TODO implement insert
            {...props}
        />
    );
}

export interface UpdateTableActionProps<T extends DomainEntity> extends ActionButtonProps {
    onUpdate: (item: T) => T
}

export function UpdateTableAction<T extends DomainEntity>(props: UpdateTableActionProps<T>) {

    return (
        <TableAction
            text="Edit"
            icon="edit"
            isValid={ctx => ctx.selectedRowKeys.length == 1}
            doPerform={() => {}} // TODO implement update
            {...props}
        />
    );

}

export interface RemoveTableActionProps<T extends DomainEntity> extends ActionButtonProps {
    onRemove: (item: T) => boolean
}

export function RemoveTableAction<T extends DomainEntity>(props: RemoveTableActionProps<T>) {

    return (
        <TableAction
            text="Delete"
            icon="delete"
            {...props}
            isValid   ={ ctx => ctx.selectedRowKeys.length == 1 }
            doPerform ={ ctx => ctx.removeSelectedItem() }
        />
    );



}
