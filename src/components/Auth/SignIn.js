import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { AuthStyles } from './AuthStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Input, Button } from 'react-native-elements';
import firebase from 'react-native-firebase';

export default SignIn = (props) => {
    const { navigate } = props.navigation;

    const [btnLoading, setBtnLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginEvent = () => {
        if (email === '' || password === '') {
            Alert.alert('INVALID', 'Email/Password kosong');
        } else {
            setBtnLoading(true);
            firebase.auth().signInWithEmailAndPassword(email, password)
                .catch((err) => {
                    setBtnLoading(false);
                    Alert.alert('Error', err.message);
                });
        }
    };

    return (
        <View>
            <ScrollView>
                <KeyboardAvoidingView behavior='padding'>
                    <View style={AuthStyles.container}>
                        <Text h3 style={AuthStyles.title}>GLUE</Text>

                        <View style={AuthStyles.formLogin}>
                            <Input
                                containerStyle={{ marginBottom: 20 }}
                                inputContainerStyle={{ borderBottomColor: '#4388d6' }}
                                placeholder='Email'
                                autoCapitalize='none'
                                leftIcon={
                                    <Icon
                                        name='envelope'
                                        size={24}
                                        color={'#4388d6'}
                                    />
                                }
                                value={email}
                                onChangeText={e => setEmail(e)}
                                keyboardType='email-address'

                            />
                            <Input
                                containerStyle={{ marginBottom: 20 }}
                                inputContainerStyle={{ borderBottomColor: '#4388d6' }}
                                placeholder='Password'
                                autoCapitalize='none'
                                leftIcon={
                                    <Icon
                                        name='lock'
                                        size={24}
                                        color='#4388d6'
                                    />
                                }
                                value={password}
                                onChangeText={e => setPassword(e)}
                                secureTextEntry={true}
                            />
                            <Button
                                title="Login"
                                raised
                                loading={btnLoading}
                                onPress={loginEvent}
                            />
                        </View>

                        <View style={{ width: '80%', alignSelf: 'center' }}>
                            <Button title='Lupa Password ?' type='clear'
                                buttonStyle={{ alignSelf: 'flex-start', marginVertical: 20 }}
                                onPress={() => navigate('ForgotPass')} />
                            <Button title='Buat Akun' type='outline' onPress={() => navigate('SignUp')} />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
};

