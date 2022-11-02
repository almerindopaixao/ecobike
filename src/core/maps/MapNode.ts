import { GeographicPoint } from "../geography/GeographicPoint";
import { MapEdge } from "./MapEdge";

export class MapNode {
    private _edges: MapEdge[] = [];

    public distance: number = 0;

    public actualDistance: number = 0;

    constructor(private _location: GeographicPoint) {}

    /**
     * Adiciona uma aresta que sai desse nó do grafo
     * @param edge 
     */
    public addEdge(edge: MapEdge): void {
        this._edges.push(edge);
    }

    public get location(): GeographicPoint {
        return this._location;
    }

    public get edges(): MapEdge[] {
        return  this._edges;
    }

    public equals(other: MapNode): boolean {
        return other.location.equals(this.location);
    }

    public getNeighbors(): MapNode[] {
        const neighbors: MapNode[] = [];

        for (let edge of this.edges) {
            neighbors.push(edge.getOtherNode(this))
        }

        return neighbors;
    }

    public getDistanceTo(to: MapNode): number {
        const neighbors = this.getNeighbors();

        if (!neighbors.find((value) => value.equals(to)))
            throw new Error('Caminho não encontrado');

        for (let me of this.edges) {
            if (me.end.equals(to)) return me.length;
        }

        return 0;
    }

    /**
     * Isso nos permitirá classificar os nós na fila de prioridade
     * @returns -1 ordem decrescente, 0 para igual, 1 para ascendente
     */
    public static compare(a: MapNode, b: MapNode): number {
        return a.distance - b.distance;
    }
}