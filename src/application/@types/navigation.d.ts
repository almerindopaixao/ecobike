import { EcoPointDto } from "../../dtos/ecopoint.dto";

export interface DetailEcoPointParams {
    ecopoint: EcoPointDto
}

export interface RefundEcoBikeRoutesParams {
    ecopoint: EcoPointDto
}

export declare global {
    namespace ReactNavigation {
        interface RootParamList {
            Home: undefined;
            SelectLocation: undefined;
            SelectEcoPoint: undefined;
            SelectUsageTime: undefined;
            DetailEcoPoint: DetailEcoPointParams;
            RouteToEcoPoint: undefined;
            RefundEcoBikeRoutes: RefundEcoBikeRoutesParams;
            Records: undefined;
        }
    }
}