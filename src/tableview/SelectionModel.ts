import {Key} from "../domain/Domain";

export default interface SelectionModel<T> {

    isEmpty(): boolean
    clear(): void
    contains(test: T): boolean
    get(): T[]
    set(newSelection: T[]): void
    add(newSelection: T[]): void
    remove(selection: T[]): void
    toggle( key: T ): void

}

export function getSelectionModel<T>( multipleSelection: boolean, current: T[], setter: (s: T[]) => void  ): SelectionModel<T> {
    return multipleSelection?
        new MultipleSelectionModel<T>( current, setter):
        new SingleSelectionModel<T>( current, setter);
}

class MultipleSelectionModel<T> implements SelectionModel<T> {

    constructor( protected current: T[], protected setter: (s: T[]) => void ){}

    isEmpty(): boolean  {
        return this.current.length == 0;
    }

    contains(key: T): boolean {
        return this.current.indexOf(key) >= 0;
    }

    get(): T[] {
        return this.current
    }

    clear(): void {
        this.setter([])
    }

    set(newSelection: T[]): void {
        this.setter( newSelection )
    }

    add(newSelection: T[]): void {
        this.setter( ([...this.current, ...newSelection]))
    }

    remove(selection: T[]): void {
        let data = [...this.current];
        this.setter( (data.filter( e => selection.indexOf(e) < 0)) )
    }

    toggle( key: T ) {
        if (this.contains(key)) {
            this.remove([key])
        } else {
            this.add([key])
        }
    }

}

class SingleSelectionModel<T> extends MultipleSelectionModel<T> {

    constructor( current: T[], setter: (s: T[]) => void ){
        super(current, setter)
    }

    set(newSelection: T[]): void {
        this.setter( (newSelection && newSelection.length > 0? [newSelection[0]]: []) )
    }

    add(newSelection: T[]): void {
        this.set(newSelection)
    }

}