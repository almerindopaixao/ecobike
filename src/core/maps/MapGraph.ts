import { GeographicPoint } from "../geography/GeographicPoint";
import { PriorityQueue } from "../queue/PriorityQueue";
import { MapEdge } from "./MapEdge";
import { MapNode } from "./MapNode";

interface ResultSearch {
    path: GeographicPoint[],
    distance: number;
}

/**
 * @description Classe Responsável por fazer o mapeamento entre o grafo e o mapa
 */
export class MapGraph {
    // Lista de vértices
    private _vertices: Map<string, MapNode> = new Map();
    
    // Lista de arestas
    private _edges: MapEdge[] = [];

    public addVertex(location: GeographicPoint): boolean {
        if (!location) return false;

        const n = this.vertices.get(location.toJson());

        if (n) return false;

        const node = new MapNode(location);
        this.vertices.set(location.toJson(), node);
        return true;
    }

    public get vertices(): Map<string, MapNode>{
        return this._vertices;
    }

    public addEdge(from: GeographicPoint, to: GeographicPoint, roadName: string, length: number) {
        const n1 = this.vertices.get(from.toJson());
        const n2 = this.vertices.get(to.toJson());

        if (!n1 || !n2) throw new Error('Pontos não encontrados no grafo');

        const edge = new MapEdge(roadName, n1, n2, length);

        this._edges.push(edge);
        n1.addEdge(edge);
    }

    public get edges(): MapEdge[] {
        return this._edges;
    }

    public aStarSearch(start: GeographicPoint, goal: GeographicPoint): ResultSearch | null {
        // Verificar se o usuário selecionou os pontos de inicio e destino
        if (!start || !goal) throw new Error('start e goal são obrigatórios');



        const toExpore = new PriorityQueue<MapNode>({ comparator: MapNode.compare });
        const visited: MapNode[] = [];
        const parentMap =  new Map<string, MapNode>();

        const startNode = this.vertices.get(start.toJson());
        const goalNode = this.vertices.get(goal.toJson());

        // Verificar se os pontos cleselecionados existem no grafo
        if (!startNode || !goalNode) throw new Error('start ou goal não encontrados no grafo');

        for (let node of this.vertices.values()) {
            node.distance = Infinity;
        }

        toExpore.add(startNode);

        while(!toExpore.isEmpty()) {
            const next = toExpore.pop();

            if (!visited.find((value) => value.equals(next))) {
                visited.push(next);

                if (next.equals(goalNode)) {
                    return this.reconstructPath(startNode, goalNode, parentMap);
                }

                for (let node of next.getNeighbors()) {
                    if (!visited.find((value) => value.equals(node))) {
                        const nodeLocation = node.location;
                        const startToNode = next.actualDistance + next.getDistanceTo(node);
                        const predictedDistance = startToNode + nodeLocation.distance(goal);
                        
                        if (predictedDistance < node.distance) {
                            node.distance = predictedDistance;
                            node.actualDistance = startToNode;
                            parentMap.set(node.location.toJson(), next);
                            toExpore.add(node);
                        }
                    }
                }
            }
        }
        
        return null;
    }

    private reconstructPath(start: MapNode, goal: MapNode, parentMap: Map<string, MapNode>): ResultSearch {
        const path: GeographicPoint[] = [];
        let current: MapNode | undefined = goal;

        while(current && !current.equals(start)) {
            path.unshift(current.location);
            current = parentMap.get(current.location.toJson());
        }

        path.unshift(start.location);

        return { path, distance: goal.actualDistance };
    }
}