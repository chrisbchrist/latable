import React, {useContext} from 'react';
import {OnInsertCallback, OnRemoveCallback, OnUpdateCallback, TableViewContext} from "./TableView"
import ActionButton, {ActionButtonProps} from "../action/ActionButton";
import {DomainEntity} from "../domain/Domain";

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
    onInsert: OnInsertCallback<T>
}

export function InsertTableAction<T extends DomainEntity>(props: InsertTableActionProps<T>) {
    return (
        <TableAction<T, InsertTableActionProps<T>>
            text="Insert"
            icon="plus"
            isValid={() => true}
            doPerform={ctx => ctx.insertSelectedItem( item => props.onInsert(item))}
            {...props}
        />
    );
}

export interface UpdateTableActionProps<T extends DomainEntity> extends ActionButtonProps {
    onUpdate: OnUpdateCallback<T>
}

export function UpdateTableAction<T extends DomainEntity>(props: UpdateTableActionProps<T>) {

    return (
        <TableAction<T, UpdateTableActionProps<T>>
            text="Edit"
            icon="edit"
            isValid={ctx => ctx.selectedRowKeys.length == 1}
            doPerform={ctx => ctx.updateSelectedItem( item => props.onUpdate(item))}
            {...props}
        />
    );

}

export interface RemoveTableActionProps<T extends DomainEntity> extends ActionButtonProps {
    onRemove: OnRemoveCallback<T>
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
