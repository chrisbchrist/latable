import {ActionProps, ValidatableActionX} from "../Action";
import TableView from "./TableView";
import {observable, when} from "mobx";

export abstract class TableAction<T> extends ValidatableActionX<TableView<T>> {

    @observable source?: TableView<T>;

    protected constructor() {
        super();
        when(
            () => this.source != undefined,
            () => this.doValidate()
        )
    }

    private doValidate(): void {
        this.disabled = !this.validate()
    }

    validate(): boolean {
        return true;
    }
}

export class InsertAction<T> extends TableAction<T> {

    constructor( private action?: (item: T) => T, props?: ActionProps ) {
        super();
        this.text = "Insert";
        this.icon = "plus";
        this.description = "Insert Item";
        if (props) {
            Object.assign(this, props)
        }
    }


    // needs to be final - no support for that in Typescript
    validate(): boolean {
        return true;
    }

    perform(): void {

        if ( this.source ) {

            // let selectedItem: T = null; // get selected item
            // let item = insert(selectedItem);
            //// add item to the table

        }

    }

}

export class UpdateAction<T> extends TableAction<T> {

    constructor( private action?: (item: T) => T, props?: ActionProps ) {
        super();
        this.text = "Edit";
        this.icon = "edit";
        this.description = "Edit Item";
        if (props) {
            Object.assign(this, props)
        }
    }


    // needs to be final - no support for that in Typescript
    validate(): boolean {
        return this.source != undefined && this.source.selectedRowCount() == 1;
    }

    perform(): void {

        if ( this.source ) {

            // let selectedItem: T = null; // get selected item
            // let item = insert(selectedItem);
            //// add item to the table

        }

    }

}

export class RemoveAction<T> extends TableAction<T> {

    constructor( private action?: (item: T) => boolean, props?: ActionProps ) {
        super();
        this.text = "Delete";
        this.icon = "delete";
        this.description = "Delete Item";
        if (props) {
            Object.assign(this, props)
        }
    }


    // needs to be final - no support for that in Typescript
    validate(): boolean {
        return this.source != undefined && this.source.selectedRowCount() == 1;
    }

    perform(): void {

        if ( this.source ) {

            // let selectedItem: T = null; // get selected item
            // let item = insert(selectedItem);
            //// add item to the table

        }

    }

}


