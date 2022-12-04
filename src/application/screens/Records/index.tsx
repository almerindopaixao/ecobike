import { 
    useEffect, 
    useState, 
    useContext 
} from 'react';
import { Text, FlatList, ListRenderItem } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { Race, Loading } from '../../components';

import { RaceDto } from '../../../dtos/race.dto';

import { AuthContext } from '../../context/auth.provider';
import { supabase } from '../../../infra/database/supabase/supabase.database';
import { RaceRepository } from '../../../infra/repositories/supabase/race.repository';
import { RaceController } from '../../../controllers/race.controller';

export function Records() {
    const raceRepository = RaceRepository.getInstance(supabase);
    const raceController = RaceController.getInstance(raceRepository);

    const [races, setRaces] = useState<RaceDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [auth] = useContext(AuthContext);

    const renderItem: ListRenderItem<RaceDto> = ({ item: race }) => (
        <Race 
          data={race}
        />
    );

    
    async function fetchData() {
        try {
            setIsLoading(true);
            const userId = auth.session?.user.id as string;
            const result = await raceController.getRacesFromUser(userId);
            setRaces(result);
        } finally {
            setIsLoading(false);
        }
    }
    

    useEffect(() => {
        fetchData();
    }, []);
    

    return (
        <SafeAreaView 
            style={styles.container}
        >
            {
                isLoading ? 
                    <Loading/> : (
                    !races.length ?
                    <Text style={styles.emptyRacesText}>
                        O usuário não possui corridas registradas
                    </Text> :
                    <FlatList
                        data={races}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.contentList}
                    />
                )
            }
        </SafeAreaView>
    )
}