import {Table} from "antd";
import {isValidElement} from "react";
import {TableAction} from "./Actions";

export abstract class InsertAction<T> implements TableAction<T> {

    constructor(public text: string = "Insert",
                public icon: string = "plus",
                public disabled: boolean = false) {}

    // needs to be final - no support for that in Typescript
    validate(table: Table<T>): void {
        this.disabled = isValidElement(table)
    }

    protected isValid(table: Table<T>): boolean {
        return true;
    }

    perform() {

        // let selectedItem: T = null; // get selected item
        // let item = insert(selectedItem);
        //// add item to the table

    }

    abstract insert(item: T): T
}

export default InsertAction
