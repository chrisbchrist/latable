import set = Reflect.set;

export default interface SelectionModel<T> {

    isEmpty(): boolean
    clear(): void
    contains(test: T): boolean
    get(): T[]
    set(selection: T[]): void
    add(selection: T[]): void
    remove(selection: T[]): void
    toggle( key: T ): void

}

export function getSelectionModel<T>( multipleSelection: boolean, currentSelection: T[], updateSelection: (s: T[]) => void  ): SelectionModel<T> {
    return multipleSelection?
        new MultipleSelectionModel<T>( currentSelection, updateSelection):
        new SingleSelectionModel<T>( currentSelection, updateSelection);
}

class MultipleSelectionModel<T> implements SelectionModel<T> {

    constructor( protected current: T[], protected update: (s: T[]) => void ){}

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
        this.update([])
    }

    set(selection: T[]): void {
        this.update( selection )
    }

    add(selection: T[]): void {
        this.update( ([...this.current, ...selection]))
    }

    remove(selection: T[]): void {
        let data = [...this.current];
        this.update( (data.filter( e => selection.indexOf(e) < 0)) )
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

    constructor( current: T[], update: (s: T[]) => void ){
        super(current, update)
    }

    set(selection: T[]): void {
        this.update( (selection && selection.length > 0? [selection[0]]: []) )
    }

    add(selection: T[]): void {
        this.set(selection)
    }

}