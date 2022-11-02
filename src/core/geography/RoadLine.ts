import { GeographicPoint, IPoint } from "./GeographicPoint";

export interface IRoadLine {
    start: IPoint,
    end: IPoint,
    roadName: string;
}

export class RoadLine {
    constructor(
        public point1: GeographicPoint,
        public point2: GeographicPoint,
        public roadName: string,
    ) {}

    public isReverse(other: RoadLine): boolean {
        return this.point1.equals(other.point2) && this.point2.equals(other.point1) &&
				this.roadName === other.roadName
    }
}