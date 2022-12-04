import { useState, useContext } from 'react';
import { View, TextInput, Text, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { AppButton, Loading } from '../../components';
import { styles } from './styles';
import { THEME } from '../../theme';

import { AuthContext } from '../../context/auth.provider';

import { emailIsValid } from '../../utils';
import { supabase } from '../../../infra/database/supabase/supabase.database';
import { AuthRepository } from '../../../infra/repositories/supabase/auth.repository';
import { AuthController } from '../../../controllers/auth.controller';

type FieldError = {
    has: boolean;
    message: string;
}

export function Login() {
    const fieldError: FieldError = {
        has: false,
        message: ''
    }

    const [auth, setAuth] = useContext(AuthContext);

    const authRepository = AuthRepository.getInstance(supabase);
    const authController = AuthController.getInstance(authRepository);

    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<FieldError>(fieldError);

    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<FieldError>(fieldError);

    const [loading, setLoading] = useState<boolean>(false);

    function resetForm() {
        setEmailError({
            has: false,
            message: ''
        });

        setPasswordError({
            has: false,
            message: ''
        });
    }

    async function handleSubmit() {
        try {
          setLoading(true);
          resetForm();

          let fieldsIsEmpty = false;
  
          if (!email) {
            setEmailError({
                has: true,
                message: 'Campo obrigatório'
            });

            fieldsIsEmpty = true;
          }
  
          if (!password) {
            setPasswordError({
                has: true,
                message: 'Campo obrigatório'
            })

            fieldsIsEmpty = true;
          } 
  
          if (fieldsIsEmpty) return;
  
          if (!emailIsValid(email)) {
            setEmailError({
                has: true,
                message: 'E-mail inválido'
            });
            return;
          }

          const result = await authController.sigIn(email, password);

          if (!result.success) {
            Alert.alert('Error na autenticação do usuário', result.errorMessage);
            return;
          }

          setAuth({
            ...auth,
            session: result.session
          });
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            {loading ? <Loading /> : (
                <>
                    <MaterialIcons 
                        name='account-circle'
                        size={100}
                        color={THEME.COLORS.PRIMARY}
                    />
                    <TextInput 
                        style={ 
                            emailError.has ? 
                            {...styles.input, ...styles.inputError } : 
                            styles.input 
                        }
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        placeholder='Digite seu e-mail'
                        keyboardType='email-address'
                        textContentType='emailAddress'
                    />
                    <Text 
                        style={
                            emailError.has ? 
                            {...styles.msg, ...styles.msgError} : 
                            styles.msg
                        }>
                        {emailError.message}
                    </Text>

                    <TextInput 
                        style={ 
                            passwordError.has ? 
                            {...styles.input, ...styles.inputError } : 
                            styles.input 
                        }
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        placeholder='Digite sua senha'
                        textContentType='password'
                        secureTextEntry
                    />
                    <Text 
                        style={
                            passwordError.has ? 
                            {...styles.msg, ...styles.msgError} : 
                            styles.msg
                        }>
                        {passwordError.message}
                    </Text>

                    <AppButton 
                        onPress={handleSubmit}
                        text='Entrar' 
                        marginTop={35} 
                    />
                </>
            )}
        </View>
    );
}