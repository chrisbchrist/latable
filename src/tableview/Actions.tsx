import React, {useContext} from 'react';
import {InsertCallback, RemoveCallback, RemoveMultipleCallback, UpdateCallback, TableViewContext} from "./TableView"
import ActionButton, {ActionButtonProps, ActionMenuItem} from "../action/ActionButton";
import {DomainEntity} from "../domain/Domain";
import {Omit} from "antd/es/_util/type";
import {ContextMenuDropdownContext} from "./ContextMenuDropdown";
import ReactExport from 'react-export-excel';
import {ColumnProps} from "antd/lib/table";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

// Excludes perform property since it should be defined internally by each table action
export interface TableActionProps extends Omit<ActionButtonProps, 'perform'> {
    isValid?: () => boolean // custom validation rule
    customText?: string;
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

export type TableAction = RefreshTableAction | InsertTableAction | UpdateTableAction | RemoveTableAction | ExportTableAction

export function RefreshTableAction<T extends DomainEntity>(props: TableActionProps) {
    const { customText, ...rest } = props;
    return (
        <TableActionBase<T>
            text={ customText || "Refresh"}
            icon="sync"
            doPerform={ctx => ctx.refreshData()}
            {...rest}
        />
    );
}

export interface RefreshTableAction extends ReturnType<typeof RefreshTableAction> {}

export interface InsertTableActionProps<T extends DomainEntity> extends TableActionProps {
    onInsert: InsertCallback<T>
}

export function InsertTableAction<T extends DomainEntity>(props: InsertTableActionProps<T>) {
    const { onInsert, customText, ...rest } = props;
    return (
        <TableActionBase<T>
            text={ customText || "Add"}
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
    const { onUpdate, customText, ...rest } = props;
    return (
        <TableActionBase<T>
            text={ customText || "Edit"}
            icon="edit"
            isCtxValid={ ctx => ctx.selectedRowKeys.length == 1 }
            doPerform={ ctx => ctx.updateSelectedItem(onUpdate) }
            {...rest}
        />
    );
}

export interface UpdateTableAction extends ReturnType<typeof UpdateTableAction> {}

export interface RemoveTableActionProps<T extends DomainEntity> extends TableActionProps {
    onRemove: RemoveCallback<T>;
    onRemoveMultiple?: RemoveMultipleCallback;
    multiple?: boolean; // Flag to enable button for bulk deletion
}

export function RemoveTableAction<T extends DomainEntity>(props: RemoveTableActionProps<T>) {
    const { onRemove, customText, multiple, ...rest} = props;
    return (
        <TableActionBase<T>
            text={ customText || "Delete"}
            icon="delete"
            {...rest}
            isCtxValid= { ctx => ctx.selectedRowKeys.length == 1 || !!(multiple && ctx.selectedRowKeys.length > 0)}
            doPerform = { ctx => ctx.removeSelectedItem(onRemove) }
        />
    );
}

export interface RemoveTableAction extends ReturnType<typeof RemoveTableAction> {}

export interface ExportTableActionProps<T extends DomainEntity> extends TableActionProps {
    name?: string;
    fileExtension?: string;
    fileName?: string;
    sheetName?: string;
}

// Not working in context menu yet
export function ExportTableAction<T extends DomainEntity>(props: ExportTableActionProps<T>) {
    const { customText, name, fileName, fileExtension, ...rest } = props;
    const { columns, tableData } = useContext(TableViewContext);
    console.log(columns);

    const ExportButton = (
        <TableActionBase<T>
            text={customText || "Export"}
            icon="file-excel"
            doPerform={() => null}
            {...rest}
        />
    );

    if (columns.length > 0) {
        return (
            <ExcelFile element={ExportButton} filename={fileName || "Document"}>
                <ExcelSheet name={name || "Document"} data={tableData && tableData}>
                    {columns && columns.filter((col: ColumnProps<T>) => col.dataIndex).map((col: ColumnProps<T>, i: number) => {
                            return <ExcelColumn key={col.dataIndex! + i} label={col.title} value={col.dataIndex}/>
                    })}
                </ExcelSheet>
            </ExcelFile>
        )
    } else {
        return ExportButton;
    }

}

export interface ExportTableAction extends ReturnType<typeof ExportTableAction> {}
