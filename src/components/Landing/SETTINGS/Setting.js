import React, { useState } from 'react';
import { View, Animated, TouchableOpacity, Dimensions, Alert } from 'react-native';
import HOMESTYLES from '../HOME/HOMESTYLE';
import { Text, Button, Image, Avatar, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import firebase from 'react-native-firebase';


export default Setting = ({ navigation }) => {
    const [list] = useState([
        {
            title: 'Sunting Profil',
            icon: 'edit'
        },
        {
            title: 'Ubah Password',
            icon: 'lock'
        },
        {
            title: 'Info',
            icon: 'info'
        },
        {
            title: 'Bantuan',
            icon: 'help-circle'
        },
        {
            title: 'Keluar',
            icon: 'log-out'
        },
    ]);

    const { navigate } = navigation;
    const [activity, setActivity] = useState(false);

    const posScroll = new Animated.Value(0);
    const HEADER_MAX_HEIGHT = 100;
    const HEADER_MIN_HEIGHT = 50;
    const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
    const screenWidth = Dimensions.get('window').width;

    const headerHeight = posScroll.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp',
    });

    const textOpacity = posScroll.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 1, 0],
        extrapolate: 'clamp',
    });

    const textTranslate = posScroll.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -50],
        extrapolate: 'clamp',
    });

    const settingEvent = (choosed) => {
        switch (choosed) {
            case 'Sunting Profil':
                navigate('EditProfile')
                break;

            case 'Ubah Password':
                navigate('ChangePass');
                break;

            case 'Info':
                navigate('Info');
                break;

            case 'Bantuan':
                navigate('Help');
                break;

            case 'Keluar':
                Alert.alert('Keluar dari glue', 'Apakah anda yakin ingin keluar ?', [
                    { text: 'Tidak' },
                    { text: 'Ya', onPress: () => firebase.auth().signOut() }
                ])
                break;

            default:
        }
    }
    return (
        <View style={HOMESTYLES.container}>
            <Animated.View style={{
                paddingVertical: 10,
                shadowColor: '#000',
                shadowOpacity: .5,
                shadowOffset: { width: 0, height: 10 },
                elevation: 5,
                shadowRadius: 50,
                backgroundColor: '#4388d6',
                height: headerHeight,
                overflow: 'hidden',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <View style={{ flex: 1 }}></View>
                <Animated.Text style={{
                    fontSize: 22, fontWeight: 'bold', color: '#fff',
                    opacity: textOpacity,
                    transform: [{ translateY: textTranslate }],
                    marginTop: 5
                }}>GLUE</Animated.Text>

                <Animated.View style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'flex-end',
                    opacity: textOpacity,
                    transform: [{ translateY: textTranslate }]
                }}>
                    <Button
                        onPress={() => navigate('Feed')}
                        type='clear'
                        icon={
                            <Icon
                                name="home"
                                size={20}
                                color="#fff"
                            />
                        }
                    />
                    <Button
                        onPress={() => navigate('Trends')}
                        type='clear'
                        icon={
                            <Icon
                                name="star"
                                size={20}
                                color="#fff"
                            />
                        }
                    />
                    <Button
                        onPress={() => navigate('Notification')}
                        type='clear'
                        icon={
                            <Icon
                                name="bell"
                                size={20}
                                color="#fff"
                            />
                        }
                    />
                </Animated.View>

                <Animated.View style={{
                    width: screenWidth,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: 0,
                    marginBottom: 10,
                    opacity: textOpacity,
                    transform: [{ translateY: textTranslate }]
                }}>
                    {!activity ? <TouchableOpacity onPress={() => navigate('Profile')}>
                        <Avatar
                            rounded
                            source={{ uri: firebase.auth().currentUser.photoURL }}
                        />
                    </TouchableOpacity> : <ActivityIndicator color='#fff' size='large' />}
                    <Text style={{ fontSize: 15, fontWeight: '100', color: '#fff' }}>Home</Text>
                </Animated.View>

                <Animated.View style={{
                    width: screenWidth,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: [{ translateY: textTranslate }],
                    position: 'absolute',
                    bottom: -42,
                }}>
                    <Button
                        onPress={() => navigate('Feed')}
                        type='clear'
                        icon={
                            <Icon
                                name="home"
                                size={20}
                                color="#fff"
                            />
                        }
                    />
                    <Button
                        onPress={() => navigate('Trends')}
                        type='clear'
                        icon={
                            <Icon
                                name="star"
                                size={20}
                                color="#fff"
                            />
                        }
                    />
                    {!activity ? <TouchableOpacity onPress={() => navigate('Profile')}>
                        <Avatar
                            containerStyle={{ marginHorizontal: 10 }}
                            size='small'
                            rounded
                            source={{ uri: firebase.auth().currentUser.photoURL }}
                        />
                    </TouchableOpacity> : <ActivityIndicator color='#fff' size='large' />}
                    <Button
                        onPress={() => navigate('Notification')}
                        type='clear'
                        icon={
                            <Icon
                                name="bell"
                                size={20}
                                color="#fff"
                            />
                        }
                    />
                    <Button
                        type='clear'
                        icon={
                            <Icon
                                name="settings"
                                size={20}
                                color="#fff"
                            />
                        }
                    />
                </Animated.View>
            </Animated.View>

            <View>
                {
                    list.map((item, i) => (
                        <Button
                            onPress={() => settingEvent(item.title)}
                            buttonStyle={{ backgroundColor: '#eaeaea', justifyContent: 'flex-start' }}
                            titleStyle={{ color: '#333', marginLeft: 10 }}
                            key={i}
                            icon={
                                <Icon
                                    name={item.icon}
                                    size={15}
                                    color="#333"
                                />
                            }
                            title={item.title}
                        />
                    ))
                }
            </View>
        </View>
    );
}

