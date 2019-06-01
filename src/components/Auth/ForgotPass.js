import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { AuthStyles } from './AuthStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Input, Button } from 'react-native-elements';
import firebase from 'react-native-firebase';

export default SignIn = (props) => {
    const { navigate } = props.navigation;

    const [btnLoading, setBtnLoading] = useState(false);
    const [email, setEmail] = useState('');

    const resetPassEvent = () => {
        if (email === '') {
            Alert.alert('INVALID', 'Email kosong');
        } else {
            setBtnLoading(true);
            firebase.auth().sendPasswordResetEmail(email)
                .then(() => {
                    Alert.alert('Email sudah dikirim');
                    setBtnLoading(false);
                    setEmail('');
                    navigate('SignIn');
                })
                .catch(err => {
                    Alert.alert('INVALID', err.message);
                    setBtnLoading(false);
                })
        }
    };

    return (
        <View style={AuthStyles.container}>
            <Text h4 style={AuthStyles.title}>Masukkan email anda</Text>

            <View style={AuthStyles.formLogin}>
                <Input
                    containerStyle={{ marginBottom: 20 }}
                    placeholder='Email'
                    autoCapitalize='none'
                    inputContainerStyle={{ borderBottomColor: '#4388d6' }}
                    leftIcon={
                        <Icon
                            name='envelope'
                            size={24}
                            color='#4388d6'
                        />
                    }
                    value={email}
                    onChangeText={e => setEmail(e)}
                    keyboardType='email-address'
                />

                <Button
                    title="Kirim"
                    raised
                    loading={btnLoading}
                    onPress={resetPassEvent}
                />
            </View>

            <View style={{ width: '80%', alignSelf: 'center', marginVertical: 20 }}>
                <Button title='Login' type='outline' onPress={() => navigate('SignIn')} />
            </View>

        </View>
    );
};

