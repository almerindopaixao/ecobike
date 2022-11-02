
interface PriorityQueueProps<T> {
    comparator: (a: T, b: T) => number 
}
export class PriorityQueue<T> {
    private itens: T[] = [];
    private comparator: (a: T, b: T) => number;

    constructor({ comparator }: PriorityQueueProps<T>) {
        this.comparator = comparator;
    }
    
    public add(item: T): void {
        this.itens.push(item);
        this.itens.sort(this.comparator);
    }

    public pop(): T {
        if (this.isEmpty()) throw new Error("A fila está vazia");
        return this.itens.shift() as T;
    }

    public isEmpty(): boolean {
        return !this.itens.length;
    }
}