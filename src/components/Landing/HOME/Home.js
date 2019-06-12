import React, { useState, useEffect, useContext } from 'react';
import { View, YellowBox, Alert, Animated, Easing, Dimensions, FlatList, ActivityIndicator, TouchableOpacity, StatusBar, RefreshControl } from 'react-native';
import { Text, Button, Image, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import firebase from 'react-native-firebase';
import { CONTEXT } from '../../Context';
import HOMESTYLES from './HOMESTYLE';
import moment from 'moment';

import Greeting from '../Greeting';
import { ScrollView } from 'react-native-gesture-handler';
import TrendsAnim from './TrendsAnim';

export default Home = ({ navigation }) => {
    useEffect(() => {
        fetchPost();
        YellowBox.ignoreWarnings(['Remote debugger']);
    }, []);

    const { navigate } = navigation;
    const [post, setPost] = useContext(CONTEXT);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activity, setActivity] = useState(false);
    const [greet, setGreet] = useState(false);

    const posScroll = new Animated.Value(0);
    const HEADER_MAX_HEIGHT = 100;
    const HEADER_MIN_HEIGHT = 50;
    const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
    const screenWidth = Dimensions.get('window').width;

    const fetchPost = () => {
        setLoading(true);
        let data = [];
        firebase.firestore().collection('posts').orderBy('mergeDate')
            .get()
            .then(snap => {
                snap.forEach(child => {
                    data.push(child.data());
                })
            })
            .then(() => {
                setPost(prev => {
                    let newData = { ...prev };
                    newData.allPost = data.reverse();
                    return newData;
                })
                setLoading(false);
                setRefreshing(false);
                setGreet(true);
                console.log(data);
            })
            .catch(err => Alert.alert('Error', err.message))

    };
    const morePressed = (uid, index, key) => {
        if (uid === firebase.auth().currentUser.uid) {
            Alert.alert('Hapus', 'Anda yakin ingin menghapus post ini ?', [
                { text: 'Tidak' },
                {
                    text: 'Ya', onPress: () => {
                        setActivity(true);
                        firebase.firestore().collection('posts').doc(key).delete()
                            .then(() => {
                                const old = post.allPost;
                                old.splice(index, 1);
                                setPost({ allPost: old });
                                setActivity(false);
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
                            .catch(err => Alert.alert('Error', err.message))
                    }
                }
            ])
        } else {
            Alert.alert('Lapor', 'Apakah post ini mengandung hoax,hate speech,sara dan tindakan negatif lainnya ?', [
                { text: 'Tidak' },
                {
                    text: 'Ya', onPress: () => {
                        if (!firebase.auth().currentUser.emailVerified) return Alert.alert('Verifikasi email', 'Verifikasi dulu email anda');

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
        }
    };

    const isLoading = () => {
        if (loading) return <ActivityIndicator animating size='large' style={{ marginTop: 20 }} color='#4388d6' />
        return null;
    }


    //LIKE BTN
    const likeBtn = (uidPost, key, vote) => {
        if (!firebase.auth().currentUser.emailVerified) return Alert.alert('Verifikasi email', 'Verifikasi dulu email anda');

        setActivity(true);
        const uid = firebase.auth().currentUser.uid;
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
        <>
            <Greeting greet={greet}>
                <Icon name='sun' size={100} color='#fff' />
                <Text style={{ fontWeight: '200', fontSize: 20, color: '#fff', marginTop: 20 }}>GLUE</Text>
                <Text style={{ fontWeight: '100', fontSize: 15, color: '#fff' }}>Gunadarma Lounge</Text>
            </Greeting>

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

                {loading ? null : post.allPost.length === 0 ?
                    <ScrollView contentContainerStyle={{ justifyContent: 'center', flex: 1 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => {
                                    setRefreshing(true);
                                    fetchPost();
                                }} />
                        }>
                        <View style={{
                            width: screenWidth - 200,
                            alignSelf: 'center',
                            alignItems: 'center',
                            flex: 1,
                            justifyContent: 'center',
                        }}>
                            <Text h4 style={{ textAlign: 'center' }}>Belum ada yang membuat post</Text>
                            <Text style={{ textAlign: 'center' }}>Jadilah yang pertama, dengan ketuk tombol dikanan bawah layar anda</Text>
                        </View>
                    </ScrollView>
                    :

                    <FlatList
                        data={post.allPost}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: posScroll } } }]
                        )}
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            fetchPost();
                        }}
                        ListFooterComponent={isLoading}
                        renderItem={({ item, index }) => (
                            <View style={HOMESTYLES.card} key={item.key}>
                                <View style={HOMESTYLES.user}>
                                    <View style={{
                                        flexDirection: 'row', alignItems: 'center',
                                    }}>
                                        <Avatar
                                            onPress={() => item.uid === firebase.auth().currentUser.uid ? navigate('Profile') : navigate('OpenedProfile', { uid: item.uid })}
                                            rounded
                                            source={{ uri: item.profilePict }}
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
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Text>{item.totalUpVote} {item.totalUpVote > 1 ? 'Likes' : 'Like'}</Text>
                                        <Text> | </Text>
                                        <Text>{item.postInfo.totalComments} Komentar</Text>
                                    </View>
                                </View>

                                <View style={{ paddingHorizontal: 10, marginBottom: 8 }}>
                                    <Text style={{ fontSize: 12, color: '#c4c4c4' }}>
                                        {moment(item.mergeDate, "YYYYMMDDhhmmss").fromNow()}
                                    </Text>
                                </View>

                                <View style={{ paddingHorizontal: 10 }}>
                                    <Button title='Lihat Post' raised onPress={() => navigate('OpenedPost', { postIndex: post.allPost[index], postKey: item.key, postUID: item.uid, indexState: index })} />
                                </View>
                            </View>
                        )}
                    />}

                <TouchableOpacity
                    onPress={() => {
                        if (!firebase.auth().currentUser.emailVerified) return Alert.alert('Verifikasi email', 'Verifikasi dulu email anda');
                        navigate('CreatePost');
                    }}
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50 / 2,
                        backgroundColor: '#4388d6',
                        position: 'absolute',
                        bottom: 20,
                        right: 20,
                        zIndex: 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowOffset: { width: 1, height: 1 },
                        shadowColor: '#000',
                        elevation: 3
                    }}>
                    <Icon name='edit-2' color='#fff' size={20} />
                </TouchableOpacity>
            </View>

            <TrendsAnim translate={translate} />
        </>
    );
}
