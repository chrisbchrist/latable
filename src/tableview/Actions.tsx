import React, {useContext} from 'react';
import {InsertCallback, RemoveCallback, UpdateCallback, TableViewContext} from "./TableView"
import ActionButton, {ActionButtonProps, ActionMenuItem} from "../action/ActionButton";
import {DomainEntity} from "../domain/Domain";
import {Omit} from "antd/es/_util/type";
import {ContextMenuDropdownContext} from "./ContextMenuDropdown";

// Excludes perform property since it should be defined internally by each table action
export interface TableActionProps extends Omit<ActionButtonProps, 'perform'> {
    isValid?: () => boolean // custom validation rule
}

interface TableActionConfig<T extends DomainEntity> extends TableActionProps {
    isCtxValid?: (ctx: TableViewContext<T>) => boolean,
    doPerform  : (ctx: TableViewContext<T>) => void,
}

function TableActionBase<T extends DomainEntity>( config: TableActionConfig<T> ) {

    const tableContext = useContext(TableViewContext);
    const menuContext  = useContext(ContextMenuDropdownContext);

    const { isCtxValid, isValid, doPerform, ...otherProps } = config;

    // Combines core action validation with custom one
    const enabled = ( !isCtxValid || isCtxValid(tableContext) ) && ( !isValid || isValid() );

    if ( menuContext ) {

        // Show action as a menu item since it is withing menu tableContext

        return <ActionMenuItem
            perform={() => {
                menuContext.setMenuVisible(false);
                doPerform(tableContext);
            }}
            verbose={true}
            disabled={!enabled}
            {...otherProps}
        />

    } else {

        return <ActionButton
            perform={() => doPerform(tableContext)}
            verbose={tableContext.verboseToolbar}
            disabled={!enabled}
            {...otherProps}
        />

    }


}

export type TableAction = RefreshTableAction | InsertTableAction | UpdateTableAction | RemoveTableAction

export function RefreshTableAction<T extends DomainEntity>(props: TableActionProps) {
    return (
        <TableActionBase<T>
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
    const { onInsert, ...rest } = props;
    return (
        <TableActionBase<T>
            text="Insert"
            icon="plus"
            doPerform={ctx => ctx.insertSelectedItem(onInsert)}
            {...rest}
        />
    );
}

export interface InsertTableAction extends ReturnType<typeof InsertTableAction> {}

export interface UpdateTableActionProps<T extends DomainEntity> extends TableActionProps {
    onUpdate: UpdateCallback<T>
}

export function UpdateTableAction<T extends DomainEntity>(props: UpdateTableActionProps<T>) {
    const { onUpdate, ...rest } = props;
    return (
        <TableActionBase<T>
            text="Edit"
            icon="edit"
            isCtxValid={ ctx => ctx.selectedRowKeys.length == 1 }
            doPerform={ ctx => ctx.updateSelectedItem(onUpdate) }
            {...rest}
        />
    );
}

export interface UpdateTableAction extends ReturnType<typeof UpdateTableAction> {}

export interface RemoveTableActionProps<T extends DomainEntity> extends TableActionProps {
    onRemove: RemoveCallback<T>
}

export function RemoveTableAction<T extends DomainEntity>(props: RemoveTableActionProps<T>) {
    const { onRemove, ...rest} = props;
    return (
        <TableActionBase<T>
            text="Delete"
            icon="delete"
            {...rest}
            isCtxValid= { ctx => ctx.selectedRowKeys.length == 1 }
            doPerform = { ctx => ctx.removeSelectedItem(onRemove) }
        />
    );
}

export interface RemoveTableAction extends ReturnType<typeof RemoveTableAction> {}
