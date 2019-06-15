import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import firebase from 'react-native-firebase';

export default ChangePass = ({ navigation }) => {
    const [pass, setPass] = useState('');
    const [repass, setRePass] = useState('');
    const [loading, setLoading] = useState(false);

    const changePassEvent = () => {
        if (pass !== repass || pass === '' || repass === '') return Alert.alert('INVALID', 'Password tidak cocok');
        setLoading(true);
        firebase.auth().currentUser.updatePassword(pass)
            .then(() => {
                setLoading(false);
                Alert.alert('SUKSES', 'Password telah diganti', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ])
            })
            .catch(err => {
                Alert.alert('ERROR', err.message);
                console.log(err);
                setLoading(false);
            })
    }
    return (
        <View style={{ flex: 1 }}>
            <View style={{
                alignItems: 'center',
                paddingVertical: 10,
                shadowColor: '#000',
                shadowOpacity: .5,
                shadowOffset: { width: 0, height: 10 },
                elevation: 5,
                shadowRadius: 50,
                backgroundColor: '#4388d6',
                height: 50,
                position: 'relative',
                overflow: 'hidden',
                flexDirection: 'row'
            }}>
                <Button
                    type='clear'
                    onPress={() => navigation.goBack()}
                    icon={
                        <Icon name='arrow-left' color='#fff' size={25} />
                    }
                    buttonStyle={{ marginLeft: 5 }}
                />
                <Text style={{
                    fontSize: 22, fontWeight: 'bold', marginLeft: 15, color: '#fff'
                }}>PASSWORD</Text>
            </View>

            <View style={{
                paddingHorizontal: 10,
                height: 200,
                justifyContent: 'space-around'
            }}>
                <Input
                    secureTextEntry={true}
                    onChangeText={e => setPass(e)}
                    value={pass}
                    placeholder='Password Baru'
                    leftIcon={
                        <Icon
                            name='lock'
                            size={24}
                            color='black'
                        />
                    }
                />

                <Input
                    secureTextEntry={true}
                    onChangeText={e => setRePass(e)}
                    value={repass}
                    placeholder='Ulangi Password Baru'
                    leftIcon={
                        <Icon
                            name='lock'
                            size={24}
                            color='black'
                        />
                    }
                />

                <Button
                    onPress={changePassEvent}
                    loading={loading}
                    icon={
                        <Icon
                            name="lock"
                            size={15}
                            color="white"
                        />
                    }
                    title="Ubah Password"
                />
            </View>
        </View>
    );
}

