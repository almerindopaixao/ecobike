import { MapNode } from "./MapNode";

export class MapEdge {
    constructor(
        private _roadName: string,
        private _start: MapNode,
        private _end: MapNode,
        private _length: number
    ) {}

    public getOtherNode(node: MapNode): MapNode {
        if (node.equals(this.start)) return this.end;
        if (node.equals(this.end)) return this.start;
        throw new Error("Procurando por um ponto que não está na aresta");
    }

    public get end(): MapNode {
        return this._end;
    }

    public get start(): MapNode {
        return this._start;
    }

    public get length(): number {
        return this._length;
    }

    public get roadName(): string {
        return this._roadName;
    }
}