import React, { useState, useEffect, useContext } from 'react';
import { View, Alert, Animated, Dimensions, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, Button, Image, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import firebase from 'react-native-firebase';
import { CONTEXT } from '../../Context';
import HOMESTYLES from '../HOME/HOMESTYLE';


export default Home = (props) => {
    useEffect(() => {
        fetchTrendsPost();
    }, []);

    const { navigate } = props.navigation;
    const [post, setPost] = useContext(CONTEXT);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [posScroll] = useState(new Animated.Value(0));
    const HEADER_MAX_HEIGHT = 100;
    const HEADER_MIN_HEIGHT = 50;
    const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
    const screenWidth = Dimensions.get('window').width;

    const fetchTrendsPost = () => {
        setLoading(true);
        fetch('https://us-central1-forumpengaduan.cloudfunctions.net/getTrendsPosts')
            .then(res => res.json())
            .then(resjson => setPost(prev => {
                let data = { ...prev };
                data.trendsPost = resjson;
                return data;
            }))
            .then(() => {
                setRefreshing(false);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                Alert.alert('ERROR', err.message);
            })
    };

    const morePressed = (uid, index) => {
        if (uid === firebase.auth().currentUser.uid) {
            Alert.alert('Hapus', 'Anda yakin ingin menghapus post ini ?', [
                { text: 'Tidak' },
                {
                    text: 'Ya', onPress: () => {
                        const old = [...post];
                        old.splice(index, 1);
                        setPost(old);
                    }
                }
            ])
        } else {
            Alert.alert('Lapor', 'Apakah post ini mengandung hoax,hate speech,sara dan tindakan negatif lainnya ?', [
                { text: 'Tidak' },
                { text: 'Ya' }
            ])
        }
    };

    const isLoading = () => {
        if (loading) return <ActivityIndicator animating size='large' style={{ marginTop: 20 }} color='#4388d6' />
        return null;
    }

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
                position: 'relative',
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
                    <Avatar
                        rounded
                        source={require('../../../assets/profileIcon.png')}
                    />
                    <Text style={{ fontSize: 15, fontWeight: '100', color: '#fff' }}>Trends</Text>
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
                    <Avatar
                        size='small'
                        rounded
                        source={require('../../../assets/profileIcon.png')}
                        containerStyle={{ marginHorizontal: 10 }}
                    />
                    <Button
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
            </Animated.View>

            <FlatList
                data={post.trendsPost}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: posScroll } } }]
                )}
                refreshing={refreshing}
                onRefresh={() => {
                    setRefreshing(true);
                    fetchTrendsPost();
                }}
                ListFooterComponent={isLoading}
                renderItem={({ item, index }) => (
                    <View style={HOMESTYLES.card}>
                        <View style={HOMESTYLES.user}>
                            <View style={{
                                flexDirection: 'row', alignItems: 'center',
                            }}>
                                <Avatar
                                    rounded
                                    source={{ uri: item.profilePict }}
                                />
                                <Text style={{ marginLeft: 10, fontSize: 20 }}>{item.nama}</Text>
                            </View>
                            <Button
                                onPress={() => morePressed(item.uid, index)}
                                type='clear'
                                icon={
                                    <Icon
                                        name="more-horizontal"
                                        size={25}
                                        color="#000"
                                    />
                                }
                            />
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            {item.postPict !== '' ? <TouchableOpacity
                                onPress={() => navigate('OpenedImage', { imageUri: item.postPict })}
                                style={{ marginBottom: 10 }}>
                                <Image source={{ uri: item.postPict }}
                                    style={{ width: '100%', height: 200 }}
                                />
                            </TouchableOpacity> : null}

                            <View style={{ paddingHorizontal: 10 }}>
                                <Text>{item.caption}</Text>
                            </View>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingHorizontal: 10,
                            marginBottom: 10
                        }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Button
                                    type='clear'
                                    icon={
                                        <Icon
                                            name="heart"
                                            size={25}
                                            color="#000"
                                        />
                                    }
                                />
                                {item.totalUpVote > 19 ? <Button
                                    type='clear'
                                    icon={
                                        <Icon
                                            name="star"
                                            size={25}
                                            color="#4388d6"
                                        />
                                    }
                                /> : null}
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <Text>{item.totalUpVote} {item.totalUpVote > 1 ? 'Likes' : 'Like'}</Text>
                                <Text> | </Text>
                                <Text>{item.postInfo.totalComments} Komentar</Text>
                            </View>
                        </View>

                        <View style={{ paddingHorizontal: 10, marginBottom: 8 }}>
                            <Text style={{ fontSize: 12, color: '#c4c4c4' }}>{item.todayTime}</Text>
                            <Text style={{ fontSize: 12, color: '#c4c4c4' }}>{item.todayDate}</Text>
                        </View>

                        <View style={{ paddingHorizontal: 10 }}>
                            <Button title='Lihat Post' raised onPress={() => navigate('OpenedPost', { postIndex: post.trendsPost[index] })} />
                        </View>
                    </View>
                )}
            />
        </View>
    );
}
