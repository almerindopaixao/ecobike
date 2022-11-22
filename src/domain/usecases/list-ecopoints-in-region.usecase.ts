import { IEcoPointRepository } from '../../infra/repositories/supabase/ecopoint.repository';

export class ListEcoPointsInRegionUseCase {
    private static INSTANCE: ListEcoPointsInRegionUseCase;

    constructor(
        private ecoPointRepository: IEcoPointRepository
    ) {}

    public static getInstance(ecoPointRepository: IEcoPointRepository): ListEcoPointsInRegionUseCase {
        if (!this.INSTANCE) this.INSTANCE = new ListEcoPointsInRegionUseCase(ecoPointRepository);
        return this.INSTANCE;
    }

    async execute() {
        try {
            return this.ecoPointRepository.listEcoPoints();
        } catch(err) {
            console.warn(err);
            return [];
        }
    }
}