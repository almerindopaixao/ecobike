export interface DetailEcoPointParams {
    ecopointId: string;
}

export declare global {
    namespace ReactNavigation {
        interface RootParamList {
            Home: undefined;
            SelectLocation: undefined;
            SelectEcoPoint: undefined;
            SelectUsageTime: undefined;
            DetailEcoPoint: DetailEcoPointParams
        }
    }
}