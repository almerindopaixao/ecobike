import { IEcoBikeRepository } from '../infra/repositories/supabase/ecobike.repository';

export class EcoBikeController {
    private static INSTANCE: EcoBikeController;

    constructor(private ecoBikeRepository: IEcoBikeRepository) {}

    public static getInstance(ecoBikeRepository: IEcoBikeRepository): EcoBikeController {
        if (!this.INSTANCE) this.INSTANCE = new EcoBikeController(ecoBikeRepository);
        return this.INSTANCE;
    }

    public async reserveEcoBike(ecopointId: string, userId: string, timeUsage: number) {
        try {
            const availableEcoBikes = await this.ecoBikeRepository.getAvailableEcoBikes(ecopointId);
    
            if (!availableEcoBikes.length) return {
                success: false,
                error: {
                    title: 'Ops, você não conseguiu reservar sua ecobike a tempo',
                    message: 'O ecopoint não possui mais ecobikes disponíveis, tente novamente mais tarde'
                }
            }
    
            for (const availableEcoBike of availableEcoBikes) {
                const error = await this.ecoBikeRepository.reserveEcoBike(
                    availableEcoBike,
                    userId,
                    timeUsage
                );
    
                if (!error) return { success: true };
    
                if (error.includes('user_id')) return {
                    success: false,
                    error: {
                        title: 'Ops, você já possui uma ecobike reservada',
                        message: 'Você só poderá reservar uma ecobike novamente assim que realizar a devolução da ecobike em utilização'
                    }
                }
    
                if (error.includes('ecobike_id')) continue;
    
                return {
                    success: false,
                    error: {
                        title: 'Ops, ocorreu um erro ao tentar reservar sua ecobike',
                        message: 'Entre em contato com os desenvolvedores ou tente novamente mais tarde'
                    }
                }
            }
    
            return {
                success: false,
                error: {
                    title: 'Ops, você não conseguiu reservar sua ecobike a tempo',
                    message: 'O ecopoint não possui mais ecobikes disponíveis, tente novamente mais tarde'
                }
            }
        } catch (err) {
            return {
                success: false,
                error: {
                    title: 'Ops, ocorreu um erro ao tentar reservar sua ecobike',
                    message: 'Entre em contato com os desenvolvedores ou tente novamente mais tarde'
                }
            }
        }
    }

    public async getReservedEcoBike(userId: string) {
        try {
            const result = await this.ecoBikeRepository.getReservedEcoBike(userId);
            return result;
        } catch (err) {
            return null;
        }
    }
}