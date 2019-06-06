import React, { useState, useEffect } from 'react';
import { View, Alert, Animated, Dimensions, FlatList, ActivityIndicator, StatusBar, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Button, Image, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import HOMESTYLES from '../HOME/HOMESTYLE';
import firebase from 'react-native-firebase';

export default Profile = ({ navigation }) => {
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = () => {
        const { displayName, photoURL, uid } = firebase.auth().currentUser;
        firebase.firestore().collection('tes').doc('tes')
            .get().then(snap => {
                alert(uid)
            })
            .catch(err => console.log(err))

    };

    const [userDatas, setUserData] = useState({
        name: '',
        photoURL: '',
        NPM: '',
        kelas: '',
        jurusan: '',
        totalPost: '',
        totalTrends: ''
    });

    const { navigate } = navigation;
    const [posScroll] = useState(new Animated.Value(0));
    const HEADER_MAX_HEIGHT = 220;
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

    const a = (
        <Text>a</Text>
    );

    return (
        <View style={HOMESTYLES.container}>
            <StatusBar hidden={true} />
            <ImageBackground
                source={require('../../../assets/postimg.jpg')}
                style={{ width: '100%' }}>
                <Animated.View style={{
                    shadowColor: '#000',
                    shadowOpacity: .5,
                    shadowOffset: { width: 0, height: 10 },
                    elevation: 5,
                    shadowRadius: 50,
                    backgroundColor: 'rgba(0, 0, 0,.6)',
                    height: headerHeight,
                    position: 'relative',
                    overflow: 'hidden',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>

                    <Animated.View style={{
                        flex: 1, alignItems: 'flex-start', opacity: textOpacity,
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
                    </Animated.View>


                    <Animated.View style={{
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'flex-end',
                        opacity: textOpacity,
                        transform: [{ translateY: textTranslate }]
                    }}>
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
                                    name="feather"
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

                    <Animated.View style={{
                        width: screenWidth,
                        position: 'absolute',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        alignSelf: 'center',
                        opacity: textOpacity,
                        transform: [{ translateY: textTranslate }],
                        marginTop: 5,
                        bottom: 0,
                    }}>
                        <TouchableOpacity onPress={() => navigate('OpenedImage', { imageUri: userDatas.photoURL })}>
                            <Avatar
                                rounded
                                source={userDatas.photoURL !== '' ? { uri: userDatas.photoURL } : require('../../../assets/profileIcon.png')}
                                size='large'
                            />
                        </TouchableOpacity>

                        <View style={{ alignItems: 'center', width: '70%', marginTop: 10 }}>
                            <Text style={{ color: '#fff', fontSize: 18 }}>{userDatas.name}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', }}>
                                <Text style={{ color: '#fff', fontSize: 13 }}>{userDatas.NPM}</Text>
                                <Text style={{ color: '#fff', fontSize: 13 }}>{userDatas.kelas}</Text>
                            </View>
                            <Text style={{ color: '#fff', fontSize: 13 }}>{userDatas.jurusan}</Text>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            marginVertical: 10,
                            justifyContent: 'space-between',
                            width: '70%'
                        }}>
                            <Text style={{ color: '#fff', fontSize: 13 }}>POST: {userDatas.totalPost}</Text>
                            <Text style={{ color: '#fff', fontSize: 13 }}>TREND: {userDatas.totalTrends}</Text>
                        </View>
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
                        <TouchableOpacity>
                            <Avatar
                                size='small'
                                rounded
                                source={require('../../../assets/profileIcon.png')}
                                containerStyle={{ marginHorizontal: 10 }}
                            />
                        </TouchableOpacity>
                        <Button
                            type='clear'
                            icon={
                                <Icon
                                    onPress={() => navigate('Notification')}
                                    name="feather"
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
            </ImageBackground>

            <ScrollView onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: posScroll } } }]
            )}>
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
                {a}
            </ScrollView>
        </View>
    );
};
