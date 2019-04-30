import {Action} from "../Action";
import {Table} from "antd";
import {BaseButtonProps} from "antd/es/button/button";

export interface TableAction<T> extends Action {

    table: Table<T> | null
    // updates the enabled state of the action
    validate(): void

}

class InsertAction<T> implements TableAction<T> {

    disabled = false;
    text = "Insert";
    icon = "plus";
    table = null;

    constructor( private action?: (item: T) => T ) {}

    // needs to be final - no support for that in Typescript
    validate(): void {
        this.disabled = this.isValid()
    }

    protected isValid(): boolean {
        return true;
    }

    perform() {

        if ( this.table ) {

            // let selectedItem: T = null; // get selected item
            // let item = insert(selectedItem);
            //// add item to the table

        }


    }

}


export class TableActions<T>{

    constructor( private action: TableAction<T> ) {}

    public static insert<T>(action: (item: T) => T ): TableActions<T> {
        return new TableActions<T>( new InsertAction<T>(action));
    };

    build(): TableAction<T> {
        return this.action;
    }

    text( text: string ): TableActions<T> {
        this.action.text = text;
        return this;
    }

    icon( icon: string ): TableActions<T> {
        this.action.icon = icon;
        return this;
    }

    description( description: string ): TableActions<T> {
        this.action.description = description;
        return this;
    }

    disabled( disabled: boolean ): TableActions<T> {
        this.action.disabled = disabled;
        return this;
    }

    buttonProps( props: BaseButtonProps ) {
        this.action.buttonProps = props;
        return this;
    }

}

