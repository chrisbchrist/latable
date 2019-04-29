import {Action} from "../Action";
import {Table} from "antd";
import {ButtonType} from "antd/es/button";

export interface TableAction<T> extends Action {

    // updates the enabled state of the action
    validate(table: Table<T>): void

}

