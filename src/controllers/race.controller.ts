import { IRaceRepository } from '../infra/repositories/supabase/race.repository';

export class RaceController {
    private static INSTANCE: RaceController;

    constructor(
        private raceRepository: IRaceRepository,
    ) {}

    public static getInstance(raceRepository: IRaceRepository): RaceController {
        if (!this.INSTANCE) this.INSTANCE = new RaceController(raceRepository);
        return this.INSTANCE;
    }

    public async getRacesFromUser(userId: string) {
        try {
            return this.raceRepository.getRacesFromUser(userId);
        } catch (err){
            return [];
        }
    }
}