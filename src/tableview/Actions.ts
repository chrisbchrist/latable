import {Action, ValidatableAction} from "../Action";
import {BaseButtonProps} from "antd/es/button/button";
import TableView from "./TableView";

export abstract class TableAction<T> implements ValidatableAction<T, TableView<T>> {

    private _disabled = false;
    private _source?: TableView<T>;

    icon?: string;
    description?: string;
    buttonProps?: BaseButtonProps;

    abstract text: string;

    abstract perform(): void;
    abstract validate(): boolean;

    get disabled(): boolean {
        return this._disabled;
    }

    protected setDisabled( disabled: boolean ) {
        this._disabled = disabled
    }

    get source(): TableView<T> | undefined {
        return this._source;
    }

    set source( source: TableView<T> | undefined ) {
        this._source = source;
        if ( source ) {
            // source.handleSelect()
        }
    }

}

class InsertAction<T> extends TableAction<T> {

    text = "Insert";
    icon = "plus";


    constructor( private action?: (item: T) => T ) {
        super()
    }



    // needs to be final - no support for that in Typescript
    validate(): boolean {
        return true;
    }

    perform() {

        if ( this.source ) {

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

    // disabled( disabled: boolean ): TableActions<T> {
    //     this.action.disabled = disabled;
    //     return this;
    // }

    buttonProps( props: BaseButtonProps ) {
        this.action.buttonProps = props;
        return this;
    }

}

