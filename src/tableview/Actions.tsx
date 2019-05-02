import React, {useContext} from 'react';
import {DomainEntity, TableViewContext} from "./TableView"
import ActionButton, {ActionButtonProps} from "../action/ActionButton";


export interface InsertTableActionProps<T extends DomainEntity> extends ActionButtonProps {
    onInsert: (item: T) => T
}

export function InsertTableAction<T extends DomainEntity>(props: InsertTableActionProps<T>) {

    const {verboseToolbar }= useContext(TableViewContext);

    const { text, icon, description, ...otherProps } = props;

    const perform = () => {
        //TODO use props.onInsert here
    };

    return (

        <ActionButton
            perform={() => perform}
            text={text ? text : "Insert"}
            icon={icon ? icon : "plus"}
            verbose={verboseToolbar}
            disabled={false}
            description={description ? description : "Insert Item"}
            {...otherProps}
        />

    );
}

export interface UpdateTableActionProps<T extends DomainEntity> extends ActionButtonProps {
    onUpdate: (item: T) => T
}

export function UpdateTableAction<T extends DomainEntity>(props: UpdateTableActionProps<T>) {

    const {selectedRowKeys, verboseToolbar }= useContext(TableViewContext);
    const { text, icon, description, ...otherProps } = props;

    const perform = () => {
        //TODO use props.onUpdate here
    };

    return (
        <ActionButton
            perform={() => perform}
            text={text? text: "Edit"}
            icon={icon? icon: "edit"}
            verbose={verboseToolbar}
            disabled={ selectedRowKeys.length != 1}
            description={ description? description: "Edit Item"}
            {... otherProps}
        />
    );
}

export interface RemoveTableActionProps<T extends DomainEntity> extends ActionButtonProps {
    onRemove: (item: T) => boolean
}

export function RemoveTableAction<T extends DomainEntity>(props: RemoveTableActionProps<T>) {

    const {selectedRowKeys, verboseToolbar }= useContext(TableViewContext);
    const { text, icon, description, ...otherProps } = props;

    const perform = () => {
        //TODO use props.onUpdate here
    };

    return (
        <ActionButton
            perform={() => perform}
            text={text? text: "Delete"}
            icon={icon? icon: "delete"}
            verbose={verboseToolbar}
            disabled={ selectedRowKeys.length != 1}
            description={ description? description: "Delete Item"}
            {... otherProps}
        />
    );
}
