import moment from 'moment';
import { View, Text } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';


import { RaceDto } from "../../../dtos/race.dto";
import { toHoursAndMinutes } from '../../utils';
import { styles } from './styles';
import { THEME } from "../../theme";

interface RaceProps {
    data: RaceDto;
}

export function Race({ data }: RaceProps) {
    function getCardData() {
        if (!data.dataHoraFinal) {
            return moment(data.dataHoraInicial)
                .subtract(3, 'hours')
                .format('DD/MM/yyyy HH:mm')
        } 

        return moment(data.dataHoraFinal)
        .subtract(3, 'hours')
        .format('DD/MM/yyyy HH:mm')
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <MaterialIcons 
                    name="history"
                    color={data.dataHoraFinal ?  THEME.COLORS.PRIMARY : THEME.COLORS.SECONDARY}
                    size={25}
                />
                <Text style={styles.status}>
                    {data.dataHoraFinal ? 'Finalizada' : 'Em andamento'}
                </Text>
            </View>
            <View style={styles.content}>
                {data.dataHoraFinal && (
                    <>
                        <View style={styles.row}>
                            <MaterialIcons 
                                name='payments' 
                                color={THEME.COLORS.TEXT}
                                size={20} 
                            />
                            <Text style={styles.text}>
                                R$ {data.faturamento.toFixed(2)}
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <MaterialIcons 
                                name='schedule' 
                                color={THEME.COLORS.TEXT}
                                size={20} 
                            />
                            <Text style={styles.text}>
                                {toHoursAndMinutes(data.tempo as number)}
                            </Text>
                        </View>
                    </>
                )}
                <View style={styles.row}>
                    <MaterialIcons 
                        name='calendar-today' 
                        color={THEME.COLORS.TEXT}
                        size={20} 
                    />
                    <Text style={styles.text}>
                        {getCardData()}
                    </Text>
                </View>
            </View>
        </View>
    )
}