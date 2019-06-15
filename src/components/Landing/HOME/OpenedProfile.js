import React, { useState, useEffect, useContext } from 'react';
import { View, Alert, Animated, Dimensions, FlatList, ActivityIndicator, Easing, StatusBar, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Button, Image, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import HOMESTYLES from '../HOME/HOMESTYLE';
import firebase from 'react-native-firebase';
import { CONTEXT } from '../../Context';
import moment from 'moment';
import TrendsAnim from '../HOME/TrendsAnim';
import ImagePicker from 'react-native-image-crop-picker';

export default Profile = ({ navigation }) => {
    useEffect(() => {
        fetchUserData();
    }, []);

    const [post, setPost] = useContext(CONTEXT);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activity, setActivity] = useState(false);
    const [userPost, setUserPost] = useState();
    const [verifClicked, setVerifClicked] = useState(false);
    const [userUID, setUserUID] = useState(navigation.state.params.uid);

    const fetchUserData = () => {
        const ref = firebase.firestore().collection('users').doc(userUID);
        ref.get().then(snap => {
            setUserData({
                name: snap.data().profile.nama,
                photoURL: snap.data().profile.profilePict,
                NPM: snap.data().profile.npm,
                kelas: snap.data().profile.kelas,
                jurusan: snap.data().profile.jurusan,
                totalPost: snap.data().profile.totalPost,
                totalTrends: snap.data().profile.totalTrends,
                headerImgDB: snap.data().profile.headerImgDB
            })
        })
            .then(() => fetchUserPost())
            .then(() => {
                setRefreshing(false);
                setLoading(false);
                setActivity(false);
            })
            .catch(err => {
                Alert.alert('Error', err.message);
                console.log(err);
            })
    };

    const fetchUserPost = () => {
        const datanya = [];
        for (let i = 0; i < post.allPost.length; i++) {
            if (post.allPost[i].uid === userUID) {
                datanya.push(post.allPost[i]);
            }
        }
        setUserPost(datanya);
    };

    const [userDatas, setUserData] = useState({
        name: '',
        photoURL: '',
        NPM: '',
        kelas: '',
        jurusan: '',
        totalPost: '',
        totalTrends: '',
        headerImgDB: ''
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

    const isLoading = () => {
        if (loading) return <ActivityIndicator animating size='large' style={{ marginTop: 20 }} color='#4388d6' />
        return null;
    }

    const morePressed = (uid, index, key) => {
        Alert.alert('Lapor', 'Apakah post ini mengandung hoax,hate speech,sara dan tindakan negatif lainnya ?', [
            { text: 'Tidak' },
            {
                text: 'Ya', onPress: () => {
                    const rep = firebase.firestore().collection('posts').doc(key)
                    rep.get().then(snap => {
                        if (snap.data().userWhoReported[firebase.auth().currentUser.uid] === undefined) {
                            if (snap.data().userWhoReported[firebase.auth().currentUser.uid] === true) {
                                Alert.alert('Sudah dilaporkan', 'Anda sudah melaporkan post ini');
                            } else {
                                setActivity(true);
                                const ref = firebase.firestore().collection('posts').doc(key);
                                ref.get().then(snap => {
                                    if (snap.data().postInfo.totalReported > 4) {
                                        ref.delete()
                                            .then(() => {
                                                const old = post.allPost;
                                                old.splice(indexState, 1);
                                                setPost({ allPost: old });
                                                setLoading(false);
                                            })
                                            .then(() => {
                                                const ref = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
                                                ref.get().then(snap => {
                                                    ref.set({
                                                        profile: {
                                                            totalPost: snap.data().profile.totalPost - 1
                                                        }
                                                    }, { merge: true })
                                                })
                                            })
                                    }

                                    ref.set({
                                        postInfo: {
                                            totalReported: snap.data().postInfo.totalReported + 1
                                        },
                                        userWhoReported: {
                                            [firebase.auth().currentUser.uid]: true
                                        }
                                    }, { merge: true })
                                        .then(() => {
                                            Alert.alert('OK', 'Post telah dilaporkan :)');
                                            setActivity(false);
                                        })
                                        .catch(err => Alert.alert('Error', err.message))
                                })
                            }
                        } else {
                            Alert.alert('Sudah dilaporkan', 'Anda sudah melaporkan post ini');
                        }
                    })
                }
            }
        ])
    };

    //LIKE BTN
    const likeBtn = (uidPost, key, vote) => {
        setActivity(true);
        const uid = firebase.auth().currentUser.uid;
        const userRef = firebase.firestore().collection('users').doc(uidPost);
        const dbRef = firebase.firestore().collection('posts').doc(key);
        dbRef.get().then(snap => {
            if (snap.data().userWhoLiked[uid] !== undefined) {
                if (snap.data().userWhoLiked[uid] === false) {
                    dbRef.set({
                        totalUpVote: vote + 1,
                        userWhoLiked: {
                            [uid]: true
                        }
                    }, { merge: true })
                        .then(() => {
                            const allPost = post.allPost;
                            for (let i = 0; i < allPost.length; i++) {
                                if (allPost[i].key === key) {
                                    allPost[i].totalUpVote += 1;
                                    allPost[i].userWhoLiked[uid] = true;
                                }
                            }
                            setActivity(false);
                            return setPost({ allPost: allPost })
                        })
                } else {
                    dbRef.set({
                        totalUpVote: vote - 1,
                        userWhoLiked: {
                            [uid]: false
                        }
                    }, { merge: true })
                        .then(() => {
                            const allPost = post.allPost;
                            for (let i = 0; i < allPost.length; i++) {
                                if (allPost[i].key === key) {
                                    allPost[i].totalUpVote -= 1;
                                    allPost[i].userWhoLiked[uid] = false;
                                }
                            }
                            setActivity(false);
                            return setPost({ allPost: allPost })
                        })
                }
            } else {
                dbRef.set({
                    totalUpVote: vote + 1,
                    userWhoLiked: {
                        [uid]: true
                    }
                }, { merge: true })
                    .then(() => {
                        const allPost = post.allPost;
                        for (let i = 0; i < allPost.length; i++) {
                            if (allPost[i].key === key) {
                                allPost[i].totalUpVote += 1;
                                allPost[i].userWhoLiked[uid] = true;
                            }
                        }
                        setActivity(false);
                        return setPost({ allPost: allPost })
                    })
            }
        })
    };

    const [translate] = useState(new Animated.Value(200));

    const trendBtnEvent = () => {
        Animated.timing(translate, {
            toValue: 0,
            duration: 500,
            easing: Easing.ease
        }).start(() => {
            Animated.timing(translate, {
                toValue: 200,
                duration: 500,
                easing: Easing.ease,
                delay: 500
            }).start()
        });
    }


    return (
        <View style={HOMESTYLES.container}>
            <StatusBar hidden={true} />
            <ImageBackground
                source={userDatas.headerImgDB === '' ? require('../../../assets/header.png') : { uri: userDatas.headerImgDB }}
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
                        {!activity ?
                            <TouchableOpacity onPress={() => navigate('OpenedImage', { imageUri: userDatas.photoURL })}>
                                <Avatar
                                    rounded
                                    source={userDatas.photoURL !== '' ? { uri: userDatas.photoURL } : require('../../../assets/profileIcon.png')}
                                    size='large'
                                />
                            </TouchableOpacity> : <ActivityIndicator color='#fff' size='large' />}

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
                        <TouchableOpacity>
                            <Avatar
                                size='small'
                                rounded
                                source={{ uri: userDatas.photoURL }}
                                containerStyle={{ marginHorizontal: 10 }}
                            />
                        </TouchableOpacity>
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
            </ImageBackground>


            <FlatList
                data={userPost}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: posScroll } } }]
                )}
                refreshing={refreshing}
                onRefresh={() => {
                    setRefreshing(true);
                    fetchUserData();
                }}
                ListFooterComponent={isLoading}
                renderItem={({ item, index }) => (
                    <View style={{
                        paddingVertical: 10,
                        marginBottom: 20,

                    }} key={item.key}>
                        <View style={HOMESTYLES.user}>
                            <View style={{
                                flexDirection: 'row', alignItems: 'center',
                            }}>
                                <Avatar
                                    rounded
                                    source={{ uri: userDatas.photoURL }}
                                />
                                <Text style={{ marginLeft: 10, fontSize: 20 }}>{item.nama}</Text>
                            </View>
                            <Button
                                onPress={() => morePressed(item.uid, index, item.key)}
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
                            {item.postPict !== '' && item.postPict !== undefined ? <TouchableOpacity
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
                                    onPress={() => likeBtn(item.uid, item.key, item.totalUpVote)}
                                    type='clear'
                                    icon={
                                        <Icon
                                            name="heart"
                                            size={25}
                                            color={item.userWhoLiked ? item.userWhoLiked[firebase.auth().currentUser.uid] === true ?
                                                '#4388d6' : '#333'
                                                : '#333'}
                                        />
                                    }
                                />
                                {item.totalUpVote > 19 ? <Button
                                    onPress={trendBtnEvent}
                                    type='clear'
                                    icon={
                                        <Icon
                                            name="star"
                                            size={25}
                                            color="#4388d6"
                                        />
                                    }
                                /> : null}

                                {item.status !== '' ? <Button
                                    type='clear'
                                    icon={
                                        <Icon
                                            name="circle"
                                            size={25}
                                            color={item.status === 'Tidak relevan' ? 'red' : item.status === 'Sedang ditindak lanjuti' ? '#4388d6' : item.status === 'Sudah ditindak lanjuti' ? 'green' : '#000'}
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
                            <Text style={{ fontSize: 10, color: '#c4c4c4' }}>
                                {moment(item.mergeDate, "YYYYMMDDhhmmss").fromNow()}
                            </Text>
                        </View>

                        <View style={{ paddingHorizontal: 10 }}>
                            <Button title='Lihat Post' raised onPress={() => navigate('OpenedPost', { postIndex: post.allPost[index], postKey: item.key, postUID: item.uid, indexState: index })} />
                        </View>
                    </View>
                )}
            />

            <TrendsAnim translate={translate} />
        </View>
    );
};
