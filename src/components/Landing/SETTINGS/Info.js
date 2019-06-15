import React, { useEffect, useState } from 'react';
import { View, Linking, Animated, Image } from 'react-native';
import { Text, Button, } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import IconFA from 'react-native-vector-icons/FontAwesome';

export default Info = ({ navigation }) => {
    useEffect(() => {
        animate1();
    }, []);
    const [rotates, setRotate] = useState(new Animated.Value(0));

    const animate1 = () => {
        Animated.timing(rotates, {
            toValue: 1,
            duration: 2000
        }).start(animate2);
    }

    const animate2 = () => {
        Animated.timing(rotates, {
            toValue: 0,
            duration: 2000
        }).start(animate1);
    }

    const spin = rotates.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })


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
                }}>INFO</Text>
            </View>


            <View style={{
                width: '100%',
                alignItems: 'center',
                marginTop: 20,
            }}>
                <Image source={require('../../../assets/glueLogo.png')}
                    style={{
                        width: 100,
                        height: 100,
                        alignSelf: 'center',
                        marginTop: 10,
                        borderRadius: 100 / 2
                    }} />
                <Text h4 style={{ fontWeight: 'bold', color: '#4388d6' }}>GLUE</Text>
            </View>

            <View style={{
                width: '100%',
                alignItems: 'center',
                marginTop: 20,
                flex: 1,
                justifyContent: 'space-between',
                paddingBottom: 10
            }}>
                <View>
                    <Text style={{ textAlign: 'center' }}>GLUE merupakan aplikasi sosial untuk mahasiswa dan dosen untuk lingkungan universitas gunadarma</Text>
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>Terima kasih telah menggunakan aplikasi ini</Text>
                </View>

                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Icon name='sun' size={100} color='#4388d6' />
                </Animated.View>

                <View>
                    <Text>Developed by <Text
                        style={{ color: '#4388d6' }} onPress={() => Linking.openURL('https://github.com/ilhamcendana')}>Ilhamcendana</Text></Text>
                    <Text style={{ textAlign: 'center' }}>
                        <IconFA name='copyright' size={15} /> Copyright {new Date().getFullYear()}
                    </Text>
                </View>
            </View>
        </View>
    );
}

