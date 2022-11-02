import { GeographicPoint } from "../geography/GeographicPoint";
import { RoadLine, IRoadLine } from "../geography/RoadLine";
import { MapGraph } from "../maps/MapGraph";

export class GraphLoaderHelper {
    /**
     * Este método irá agrupar os pontos para que apenas as interseções
     * sejam representados como nós no gráfico.
     * @param roadMap  Segmentos de rua
     * @param map O gráfico para carregar o mapa. O gráfico é assumido como dirigido.
     */
    public static loadRoadMap(roadMap: IRoadLine[], map: MapGraph) {
        const pointMap: Map<string, RoadLine[][]> = this.buildPointMapOneWay(roadMap);
        const nodes = this.findIntersections(pointMap);

        for (let node of nodes) {
            map.addVertex(node);
        }

        this.addEdges(nodes, pointMap, map);
    }

    /**
     * Faz a indexação entre pontos e ruas
     * @param roadMap Segmentos de rua
     * @returns 
     */
    private static buildPointMapOneWay(roadMap: IRoadLine[]): Map<string, RoadLine[][]> { 
        const pointMap: Map<string, RoadLine[][]> = new Map();

        for (const item of roadMap) {
            const point1 = new GeographicPoint(item.start);
            const point2 = new GeographicPoint(item.end);

            const roadLine = new RoadLine(point1, point2, item.roadName);

            this.addToPointsMapOneWay(roadLine, pointMap);
        }
        
        return pointMap;
    }

    private static addToPointsMapOneWay(line: RoadLine, map: Map<string, RoadLine[][]>) {
        let pt1Infos = map.get(line.point1.toJson());
        let pt2Infos = map.get(line.point2.toJson());

        if (!pt1Infos) {
            pt1Infos = [[], []];
            map.set(line.point1.toJson(), pt1Infos);
        }

        const outgoing = pt1Infos[0];
        outgoing.push(line);

        if (!pt2Infos) {
            pt2Infos = [[], []];
            map.set(line.point2.toJson(), pt2Infos);
        }

        const incoming = pt2Infos[1];
        incoming.push(line);
    }

    /**
     * Encontra todas as interseções. As interseções são becos sem saída 
     * (1 estrada de entrada e 1 estrada de saída, que são o inverso uma da outra)
     * ou interseções entre duas estradas diferentes, ou onde três
     * ou mais segmentos da mesma estrada se encontram.
     * 
     * @param pointMap 
     */
    private static findIntersections(pointMap: Map<string, RoadLine[][]>): GeographicPoint[] {
        const intersections: GeographicPoint[] = [];

        for (const [pt, roadsInAndOut] of pointMap) {

            const roadsOut =  roadsInAndOut[0];
            const roadsIn = roadsInAndOut[1];

            let isNode = true;

            if (roadsIn.length === 1 && roadsOut.length === 1) {
                // Se estes são o inverso um do outro, então isso é
                // uma interseção (beco sem saída)

                if (!(
                    roadsIn[0].point1.equals(roadsOut[0].point2) &&
                    roadsIn[0].point2.equals(roadsOut[0].point1)) &&
                    roadsIn[0].roadName === roadsOut[0].roadName) {
                    isNode = false;
                }
            }

            if (roadsIn.length === 2 && roadsOut.length === 2) {
                const name = roadsIn[0].roadName;
                let sameName = true;

                for (let roadIn of roadsIn) {
                    if (roadIn.roadName !== name) sameName = false;
                }

                for (let roadOut of roadsOut) {
                    if (roadOut.roadName !== name) sameName = false;
                }

                const in1 = roadsIn[0];
                const in2 = roadsIn[1];
                const out1 = roadsOut[0];
                const out2 = roadsOut[1];

                let passThrough = false;

                if ((in1.isReverse(out1) && in2.isReverse(out2)) ||
                    (in1.isReverse(out2) && in2.isReverse(out1))) {
                    passThrough = true;  
                }

                if (sameName && passThrough) isNode = false;
            }

            if (isNode) {
                intersections.push(new GeographicPoint(JSON.parse(pt)));
            }
        }

        return intersections;
    }

    private static addEdges(
        nodes: GeographicPoint[], 
        pointMap: Map<string, RoadLine[][]>, 
        map: MapGraph
    ) {
        for (let point of nodes) {
            const inAndOut = pointMap.get(point.toJson()) || [];
            const outgoing = inAndOut[0];

            for (let readLine of outgoing) {
                const pointsOnEdge = this.findPointsOnEdge(pointMap, readLine, nodes);
                const end = pointsOnEdge.pop() as GeographicPoint;

                const length = this.getRoadLength(point, end, pointsOnEdge);
                map.addEdge(point, end, readLine.roadName, length);
            }
        }

    }

    private static findPointsOnEdge(
        pointMap: Map<string, RoadLine[][]>,
        roadLine: RoadLine,
        nodes: GeographicPoint[]
    ): GeographicPoint[] {
        const toReturn: GeographicPoint[] = [];

        let pt = roadLine.point1;
        let end = roadLine.point2;

        let nextInAndOut = pointMap.get(end.toJson()) || [];
        let nextLines = nextInAndOut[0];

        while (!nodes.find((node) => node.equals(end))) {
            toReturn.push(end);

            let nextRoadLine = nextLines[0]

            if (nextLines.length === 2) {
                if (nextRoadLine.point2.equals(pt)) {
                    nextRoadLine = nextLines[1];
                }
            } else if (nextLines.length !== 1) {
                console.error("Algo deu errado durante a construção das arestas")
            }

            pt = end;
            end = nextRoadLine.point2;
            nextInAndOut = pointMap.get(end.toJson()) || [];
            nextLines = nextInAndOut[0];
        }

        toReturn.push(end);

        return toReturn;
    }

    private static getRoadLength(start: GeographicPoint, end: GeographicPoint, path: GeographicPoint[]): number {
        let dist = 0;
        let curr = start;

        for (let next of path) {
            dist += curr.distance(next);
            curr = next;
        }

        dist += curr.distance(end);
        return dist;
    }
}