import React, {useContext} from 'react';
import {InsertCallback, RemoveCallback, UpdateCallback, TableViewContext} from "./TableView"
import ActionButton, {ActionButtonProps} from "../action/ActionButton";
import {DomainEntity} from "../domain/Domain";
import {Omit} from "antd/es/_util/type";

// Excludes perform property since it should be defined internally by each table action
export interface TableActionProps extends Omit<ActionButtonProps, 'perform'> {
    isValid?: () => boolean // custom validation rule
}

interface TableActionConfig<T extends DomainEntity> extends TableActionProps {
    isCtxValid?: (ctx: TableViewContext<T>) => boolean,
    doPerform  : (ctx: TableViewContext<T>) => void,
}

function TableAction<T extends DomainEntity>( config: TableActionConfig<T> ) {

    const context = useContext(TableViewContext);
    const { isCtxValid, isValid, doPerform, ...otherProps } = config;

    // Combines core action validation with custom one
    const enabled = ( !isCtxValid || isCtxValid(context) ) && ( !isValid || isValid() );

    return (
        <ActionButton
            perform={() => doPerform(context)}
            verbose={context.verboseToolbar}
            disabled={ !enabled }
            {...otherProps}
        />
    );

}

export function RefreshTableAction<T extends DomainEntity>(props: TableActionProps) {
    return (
        <TableAction<T>
            text="Refresh"
            icon="sync"
            doPerform={ctx => ctx.refreshData()}
            {...props}
        />
    );
}

export interface RefreshTableAction extends ReturnType<typeof RefreshTableAction> {}

export interface InsertTableActionProps<T extends DomainEntity> extends TableActionProps {
    onInsert: InsertCallback<T>
}

export function InsertTableAction<T extends DomainEntity>(props: InsertTableActionProps<T>) {
    return (
        <TableAction<T>
            text="Insert"
            icon="plus"
            doPerform={ctx => ctx.insertSelectedItem(props.onInsert)}
            {...props}
        />
    );
}

export interface InsertTableAction extends ReturnType<typeof InsertTableAction> {}

export interface UpdateTableActionProps<T extends DomainEntity> extends TableActionProps {
    onUpdate: UpdateCallback<T>
}

export function UpdateTableAction<T extends DomainEntity>(props: UpdateTableActionProps<T>) {
    return (
        <TableAction<T>
            text="Edit"
            icon="edit"
            isCtxValid={ ctx => ctx.selectedRowKeys.length == 1 }
            doPerform={ ctx => ctx.updateSelectedItem(props.onUpdate) }
            {...props}
        />
    );
}

export interface UpdateTableAction extends ReturnType<typeof UpdateTableAction> {}

export interface RemoveTableActionProps<T extends DomainEntity> extends TableActionProps {
    onRemove: RemoveCallback<T>
}

export function RemoveTableAction<T extends DomainEntity>(props: RemoveTableActionProps<T>) {
    return (
        <TableAction<T>
            text="Delete"
            icon="delete"
            {...props}
            isCtxValid= { ctx => ctx.selectedRowKeys.length == 1 }
            doPerform = { ctx => ctx.removeSelectedItem(props.onRemove) }
        />
    );
}

export interface RemoveTableAction extends ReturnType<typeof RemoveTableAction> {}
