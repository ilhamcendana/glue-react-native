import React, { useState, useEffect, useContext } from 'react';
import { View, Alert, Animated, Dimensions, FlatList, ActivityIndicator, Easing, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Text, Button, Image, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import firebase from 'react-native-firebase';
import { CONTEXT } from '../../Context';
import HOMESTYLES from '../HOME/HOMESTYLE';
import moment from 'moment';
import TrendsAnim from '../HOME/TrendsAnim';
import StatusAlert from '../HOME/StatusAlert';

export default Home = (props) => {
    useEffect(() => {
        setLoading(true);
        fetchTrendsPost();
    }, []);

    const { navigate } = props.navigation;
    const [post, setPost] = useContext(CONTEXT);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activity, setActivity] = useState(false);
    const [posScroll] = useState(new Animated.Value(0));
    const HEADER_MAX_HEIGHT = 100;
    const HEADER_MIN_HEIGHT = 50;
    const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
    const screenWidth = Dimensions.get('window').width;
    const [trends, setTrends] = useState([]);

    const fetchTrendsPost = () => {
        const trendsData = [];
        for (let i = 0; i < post.allPost.length; i++) {
            if (post.allPost[i].totalUpVote > 19) {
                let data = post.allPost[i];
                trendsData.push(data);
            }
        }
        setTrends(trendsData);
        setRefreshing(false);
        setTimeout(() => {
            setLoading(false);
        }, 100);
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

                                const oldTrends = trends;
                                oldTrends.splice(index, 1);
                                setTrends(oldTrends);
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
                                                    const oldTrends = trends;
                                                    oldTrends.splice(index, 1);
                                                    setTrends(oldTrends);
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
                    if (snap.data().totalUpVote === 19) {
                        userRef.get().then(snap => {
                            userRef.set({
                                profile: { totalTrends: snap.data().profile.totalTrends + 1 }
                            }, { merge: true })
                        })
                    }
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
                    if (snap.data().totalUpVote === 20) {
                        userRef.get().then(snap => {
                            userRef.set({
                                profile: { totalTrends: snap.data().profile.totalTrends - 1 }
                            }, { merge: true })
                        })
                    }
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
                if (snap.data().totalUpVote === 19) {
                    userRef.get().then(snap => {
                        userRef.set({
                            profile: { totalTrends: snap.data().profile.totalTrends + 1 }
                        }, { merge: true })
                    })
                }
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

    const [statusTranslate] = useState(new Animated.Value(-100));
    const [statusStatement, setStatusStatement] = useState('');
    const statusAnimEvent = (status) => {
        setStatusStatement(status);
        Animated.timing(statusTranslate, {
            toValue: 0,
            duration: 1000
        }).start(() => {
            Animated.timing(statusTranslate, {
                toValue: -100,
                duration: 1000,
                delay: 1500
            }).start()
        })
    }

    return (
        <>
            <StatusAlert
                status={statusStatement}
                translate={statusTranslate}
            />
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

                {loading ? <ActivityIndicator size='large' color='#4388d6' style={{ marginTop: 20 }} /> : trends.length < 1 ?
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
                            <Text h4 style={{ textAlign: 'center' }}>Belum ada trending post</Text>
                            <Text style={{ textAlign: 'center' }}>Post akan masuk ke halaman trending bila memenuhi syarat</Text>
                        </View>
                    </ScrollView>
                    :
                    <FlatList
                        data={trends}
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
                            <View style={HOMESTYLES.card} key={item.key}>
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
                                        <Text>{item.caption.length > 600 ? item.caption.slice(0, 600) + '...' : item.caption}</Text>
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
                                            onPress={() => statusAnimEvent(item.status)}
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

                <TrendsAnim translate={translate} />
            </View>
        </>
    );
}
