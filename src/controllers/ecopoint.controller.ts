import { IEcoPointRepository } from '../infra/repositories/supabase/ecopoint.repository';

export class EcoPointController {
    private static INSTANCE: EcoPointController;

    constructor(private ecoPointRepository: IEcoPointRepository) {}

    public static getInstance(ecoPointRepository: IEcoPointRepository): EcoPointController {
        if (!this.INSTANCE) this.INSTANCE = new EcoPointController(ecoPointRepository);
        return this.INSTANCE;
    }

    async listAllEcoPointsInRegion() {
        try {
            return this.ecoPointRepository.listEcoPoints();
        } catch(err) {
            console.warn(err);
            return [];
        }
    }
}