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
    return <TableAction
               text = "Insert"
               icon = "plus"
               isValid = {() => true}
               doPerform = {() => {}}
               {...props}
           />

}

export interface UpdateTableActionProps<T extends DomainEntity> extends ActionButtonProps {
    onUpdate: (item: T) => T
}

export function UpdateTableAction<T extends DomainEntity>(props: UpdateTableActionProps<T>) {

    return <TableAction
        text = "Edit"
        icon = "edit"
        isValid = {context => context.selectedRowKeys.length == 1}
        doPerform = {() => {}}
        {...props}
    />

}

export interface RemoveTableActionProps<T extends DomainEntity> extends ActionButtonProps {
    onRemove: (item: T) => boolean
}

export function RemoveTableAction<T extends DomainEntity>(props: RemoveTableActionProps<T>) {

    return (
        <TableAction
        text="Delete"
        icon="delete"
        isValid={context => context.selectedRowKeys.length == 1}
        {...props}
        doPerform={(context) => {

            const {selectedRowKeys, setSelectedRowKeys, dataSource, setDataSource} = context;
            // console.log("Preparing to remove item with key=" + selectedRowKeys[0])
            const item = context.dataSource.find(e => e.key === selectedRowKeys[0]);
            // console.log("item = " + item)

            if (item) {
                // console.log("Removing item with key=" + item.key)
                const itemIndex = dataSource.indexOf(item);
                let data = dataSource; // should the data be copied?
                data.splice(itemIndex, 1);
                setDataSource(data);
                setSelectedRowKeys([]);
            }

        }}
    />);

}
