import React, { useState } from 'react';
import { View, Alert, Animated, Dimensions, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, Button, Image, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import firebase from 'react-native-firebase';

export default Notification = ({ navigation }) => {
    const { navigate } = navigation;

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activity, setActivity] = useState(false);
    const [posScroll] = useState(new Animated.Value(0));
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

    const isLoading = () => {
        if (loading) return <ActivityIndicator animating size='large' style={{ marginTop: 20 }} color='#4388d6' />
        return null;
    }

    const notif = [
        {
            nama: 'Ilham cendana',
            profilePict: '',
            sub: 'Menyukai post anda',
            time: '3 Jam yang lalu'
        },
        {
            nama: 'Ilham cendana putra',
            profilePict: '',
            sub: 'Mengomentari post anda',
            time: '3 Jam yang lalu'
        }
    ]

    return (
        <View style={{
            flex: 1,
            width: screenWidth,
        }}>
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
                        onPress={() => navigate('Setting')}
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
                    <Text style={{ fontSize: 15, fontWeight: '100', color: '#fff' }}>Notifikasi</Text>
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
                        onPress={() => navigate('Setting')}
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

            {/* <FlatList
                data={notif}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: posScroll } } }]
                )}
                refreshing={refreshing}
                onRefresh={() => {
                    setRefreshing(true);
                    setRefreshing(false);
                }}
                ListFooterComponent={isLoading}
                renderItem={({ item }) => (
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        alignItems: 'center',
                        borderBottomWidth: 1 / 2
                    }}>
                        <Avatar title='IC' rounded />
                        <View style={{
                            marginLeft: 10
                        }}>
                            <Text><Text style={{ fontWeight: 'bold' }}>{item.nama}</Text> {item.sub}</Text>
                            <Text style={{ color: '#ccc', fontSize: 10 }}>{item.time}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            /> */}

            <View style={{
                alignItems: 'center',
                flex: 1,
                justifyContent: 'space-around'
            }}>
                <Icon name='anchor' size={200} color='#4388d6' />
                <Text style={{
                    color: '#4388d6',
                    fontSize: 20,
                    fontWeight: '100'
                }}>Notifikasi saat ini belum tersedia :(</Text>
            </View>

        </View>
    );
}

