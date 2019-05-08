import React, {useContext} from 'react';
import {InsertCallback, RemoveCallback, UpdateCallback, TableViewContext} from "./TableView"
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

interface TableActionProps extends ActionButtonProps {
    isValid?: () => boolean
}

export function RefreshTableAction<T extends DomainEntity>(props: TableActionProps) {
    return (
        <TableAction<T, ActionButtonProps>
            text="Refresh"
            icon="sync"
            isValid={ () => !props.isValid || props.isValid() }
            doPerform={ctx => ctx.refreshData()}
            {...props}
        />
    );
}

export interface InsertTableActionProps<T extends DomainEntity> extends TableActionProps {
    onInsert: InsertCallback<T>
}

export function InsertTableAction<T extends DomainEntity>(props: InsertTableActionProps<T>) {
    return (
        <TableAction<T, InsertTableActionProps<T>>
            text="Insert"
            icon="plus"
            isValid={() => !props.isValid || props.isValid()}
            doPerform={ctx => ctx.insertSelectedItem(props.onInsert)}
            {...props}
        />
    );
}

export interface UpdateTableActionProps<T extends DomainEntity> extends TableActionProps {
    onUpdate: UpdateCallback<T>
}

export function UpdateTableAction<T extends DomainEntity>(props: UpdateTableActionProps<T>) {

    let customIsValid: boolean = !props.isValid || props.isValid();

    return (
        <TableAction<T, UpdateTableActionProps<T>>
            text="Edit"
            icon="edit"
            isValid={ctx => ctx.selectedRowKeys.length == 1 && customIsValid}
            doPerform={ctx => ctx.updateSelectedItem(props.onUpdate)}
            {...props}
        />
    );

}

export interface RemoveTableActionProps<T extends DomainEntity> extends TableActionProps {
    onRemove: RemoveCallback<T>
}

export function RemoveTableAction<T extends DomainEntity>(props: RemoveTableActionProps<T>) {

    let customIsValid: boolean = !props.isValid || props.isValid();

    return (
        <TableAction<T, UpdateTableActionProps<T>>
            text="Delete"
            icon="delete"
            {...props}
            isValid   = { ctx => ctx.selectedRowKeys.length == 1  && customIsValid }
            doPerform = { ctx => ctx.removeSelectedItem(props.onRemove) }
        />
    );



}
