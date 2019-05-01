// import {Action, ActionProps, ValidatableAction} from "../action/Action";
import TableView from "./TableView";
import {ActionProps, ValidatableAction} from "../action/Action";
import {Table} from "antd";

export abstract class TableAction<T> extends ValidatableAction<Table<T>> {

    constructor( props?: ActionProps ) {
        super(() => this.doPerform());
        if (props) {
            Object.assign(this, props)
        }
    }

    protected abstract doPerform(): void

}

export class InsertAction<T> extends TableAction<T> {

    text = "Insert";
    icon = "plus";
    description = "Insert Item";

    constructor( private action?: (item: T) => T, props?: ActionProps ) {
        super(  props);
    }

    // needs to be final - no support for that in Typescript
    protected isValid(): boolean {
        return true;
    }

    protected doPerform(): void {

        //TODO use action method here
        if ( this.validationSource ) {

            // let selectedItem: T = null; // get selected item
            // let item = insert(selectedItem);
            //// add item to the table

        }

    }

}

export class UpdateAction<T> extends TableAction<T> {

    text = "Edit";
    icon = "edit";
    description = "Edit Item";

    constructor( private action?: (item: T) => T, props?: ActionProps ) {
        super(props);
    }

    // needs to be final - no support for that in Typescript
    protected isValid(): boolean {
        return this.validationSource != undefined //&& this.validationSource.selectedRowCount() == 1;
    }

    protected doPerform(): void {

        //TODO use action method here
        if ( this.validationSource ) {

            // let selectedItem: T = null; // get selected item
            // let item = insert(selectedItem);
            //// add item to the table

        }

    }

}

export class RemoveAction<T> extends TableAction<T> {

    text = "Delete";
    icon = "delete";
    description = "Delete Item";

    constructor( private action?: (item: T) => boolean, props?: ActionProps ) {
        super(props);
    }

    // needs to be final - no support for that in Typescript
    protected isValid(): boolean {
        return this.validationSource != undefined //&& this.validationSource.selectedRowCount() == 1;
    }

    protected doPerform(): void {
        //TODO use action method her
        if ( this.validationSource ) {

            // let selectedItem: T = null; // get selected item
            // let item = insert(selectedItem);
            //// add item to the table

        }

    }

}


