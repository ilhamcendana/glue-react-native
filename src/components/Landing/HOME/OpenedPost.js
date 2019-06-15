import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, RefreshControl, Alert, TextInput, ActivityIndicator, Animated, Easing } from 'react-native';
import { Text, Button, Image, Avatar, } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import HOMESTYLES from './HOMESTYLE';
import firebase from 'react-native-firebase';
import { CONTEXT } from '../../Context';
import moment from 'moment';
import TrendsAnim from './TrendsAnim';
import StatusAlert from './StatusAlert';


export default OpenedPost = ({ navigation }) => {
    const [post, setPost] = useContext(CONTEXT);
    const [isReady, setIsReady] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [item, setItem] = useState({});
    const [indexState] = useState(navigation.state.params.indexState);
    const [postKey] = useState(navigation.state.params.postKey);
    const [postUID] = useState(navigation.state.params.postUID);
    const [listComment, setListComment] = useState([]);
    const [commentInput, setCommentInput] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsReady(false);
        fetchPost();
        fetchComment();
    }, []);

    const fetchPost = () => {
        setLoading(true);
        const reff = firebase.firestore().collection('posts').doc(postKey);
        reff.get().then(snap => setItem(snap.data()))
            .then(() => {
                setLoading(false);
                setIsReady(true);
            })
            .catch(err => {
                setLoading(false);
                Alert.alert('Error', err.message)
            })
    }

    const fetchComment = () => {
        setLoading(true);
        const ref = firebase.firestore().collection('comments').where('postkey', '==', postKey).orderBy('mergeDate');
        const commentData = [];
        ref.get().then(snap => {
            snap.forEach(child => {
                commentData.push(child.data());
            })
        })
            .then(() => {
                setListComment(commentData);
                setRefreshing(false);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                console.log(err)
            })
    };

    const _onRefresh = () => {
        setRefreshing(true);
        fetchComment();
        fetchPost();
    };

    const morePressed = (uid, key) => {
        if (uid === firebase.auth().currentUser.uid) {
            Alert.alert('Hapus', 'Anda yakin ingin menghapus post ini ?', [
                { text: 'Tidak' },
                {
                    text: 'Ya', onPress: () => {
                        setLoading(true);
                        firebase.firestore().collection('posts').doc(key).delete()
                            .then(() => {
                                const old = post.allPost;
                                old.splice(indexState, 1);
                                setPost({ allPost: old });
                                setLoading(false);
                            })
                            .then(() => navigation.navigate('Feed'))
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
                            .catch(err => {
                                Alert.alert('Error', err.message)
                                setLoading(false);
                            })
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
                                    setLoading(true);
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
                                                .then(() => navigation.navigate('Feed'))

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
                                                setLoading(false);
                                            })
                                            .catch(err => {
                                                Alert.alert('Error', err.message);
                                                setLoading(false);
                                            })
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

    //LIKE BTN
    const likeBtn = (uidPost, key, vote) => {
        if (!firebase.auth().currentUser.emailVerified) return Alert.alert('Verifikasi email', 'Verifikasi dulu email anda');

        setLoading(true);
        const uid = firebase.auth().currentUser.uid;
        const userRef = firebase.firestore().collection('users').doc(uidPost);
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

                            setItem({ ...item, totalUpVote: item.totalUpVote + 1, userWhoLiked: { [uid]: true } })
                            setLoading(false);
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
                            setItem({ ...item, totalUpVote: item.totalUpVote - 1, userWhoLiked: { [uid]: false } })
                            setLoading(false);
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
                        setItem({ ...item, totalUpVote: item.totalUpVote + 1, userWhoLiked: { [uid]: true } })
                        setLoading(false);
                        return setPost({ allPost: allPost })
                    })
            }
        })
    };



    const commentSubmit = () => {
        setLoading(true);
        const date = new Date();
        const year = date.getFullYear().toString();
        const month = date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        const second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
        const merge = `${year}${month}${day}${hour}${minutes}${second}`;

        const { uid, displayName, photoURL } = firebase.auth().currentUser;
        const commentData = {
            nama: displayName,
            commentText: commentInput,
            mergeDate: parseInt(merge, 10),
            postkey: postKey,
            uid: uid,
            profilePict: photoURL,
        }
        const ref = firebase.firestore().collection('comments');
        ref.add(commentData)
            .then((snap) => {
                ref.doc(snap.id).set({
                    commentKey: snap.id
                }, { merge: true })

            })
            .then(() => {
                const postRef = firebase.firestore().collection('posts').doc(postKey);
                postRef.get().then(snap => {
                    postRef.set({
                        postInfo: {
                            totalComments: snap.data().postInfo.totalComments + 1
                        }
                    }, { merge: true })
                })
            })
            .then(() => {
                setListComment(prev => [...prev, {
                    nama: displayName,
                    commentText: commentInput,
                    profilePict: photoURL,
                    uid: uid,
                    mergeDate: parseInt(merge, 10),
                    postKey: postKey,
                }]);
                setCommentInput('');
                setLoading(false);
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
                    }}>GLUE</Text>
                </View>

                {loading && !refreshing ? <ActivityIndicator color='#4388d6' size='large' style={{
                    position: 'absolute',
                    zIndex: 1000,
                    top: 100, alignSelf: 'center'
                }} /> : null}

                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={_onRefresh}
                        />
                    }>

                    {isReady ?
                        <View style={{ paddingVertical: 10 }}>
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

                                <View style={{ marginTop: 10 }}>
                                    <Button
                                        buttonStyle={{ height: 25 }}
                                        onPress={() => morePressed(postUID, postKey)}
                                        type='clear'
                                        icon={
                                            <Icon
                                                name="more-horizontal"
                                                size={25}
                                                color="#000"
                                            />
                                        }
                                    />
                                    <Text style={{ fontSize: 10, color: '#c4c4c4' }}>
                                        {moment(item.mergeDate, "YYYYMMDDhhmmss").fromNow()}
                                    </Text>
                                </View>
                            </View>

                            <View style={{ marginBottom: 10 }}>
                                {item.postPict !== '' && item.postPict !== undefined ? <View style={{ marginBottom: 10 }}>
                                    <Image source={{ uri: item.postPict }}
                                        style={{ width: '100%', height: 200 }}
                                    />
                                </View> : null}

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


                            <View style={{
                                marginBottom: 10
                            }}>

                                {
                                    listComment.map((c, i) => (
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'flex-start',
                                            borderBottomWidth: 1 / 5,
                                            paddingVertical: 10,
                                            paddingHorizontal: 10
                                        }} key={i}>
                                            <View style={{
                                                width: '20%',
                                            }}>
                                                <Image source={{ uri: c.profilePict }} style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 40 / 2
                                                }} />
                                            </View>

                                            <View style={{ width: '65%', justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: 17, marginBottom: 3, fontWeight: '300' }} >{c.nama !== undefined ? c.nama : 'hai'}</Text>
                                                <Text>{c.commentText}</Text>
                                            </View>

                                            <View style={{ width: '15%', }}>
                                                <Button
                                                    onPress={() => {
                                                        if (c.uid === firebase.auth().currentUser.uid) {
                                                            Alert.alert('Hapus komentar', 'Anda yakin ingin menghapus komentar ini ?', [
                                                                { text: 'Tidak' },
                                                                {
                                                                    text: 'Ya', onPress: () => {
                                                                        firebase.firestore().collection('comments').doc(c.commentKey)
                                                                            .delete()
                                                                            .then(() => {
                                                                                const postRef = firebase.firestore().collection('posts').doc(postKey);
                                                                                postRef.get().then(snap => {
                                                                                    postRef.set({
                                                                                        postInfo: {
                                                                                            totalComments: snap.data().postInfo.totalComments - 1
                                                                                        }
                                                                                    }, { merge: true })
                                                                                })
                                                                            })
                                                                            .then(() => {
                                                                                setListComment(prev => {
                                                                                    const old = [...prev];
                                                                                    old.splice(i, 1);
                                                                                    return old;
                                                                                });
                                                                            })
                                                                            .catch(err => Alert.alert('Error', err.message))
                                                                    }
                                                                }
                                                            ])
                                                        }
                                                    }}
                                                    buttonStyle={{ height: 25 }}
                                                    type='clear'
                                                    icon={
                                                        <Icon
                                                            name="more-horizontal"
                                                            size={25}
                                                            color="#000"
                                                        />
                                                    }
                                                />
                                                <Text style={{ fontSize: 10, color: '#c4c4c4' }}>
                                                    {moment(c.mergeDate, "YYYYMMDDhhmmss").fromNow()}
                                                </Text>
                                            </View>
                                        </View>
                                    ))
                                }
                            </View>
                        </View>
                        : null}
                </ScrollView>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    paddingVertical: 5,
                    backgroundColor: '#4388d6',
                }}>
                    <TextInput multiline={true}
                        value={commentInput}
                        onChangeText={(e) => setCommentInput(e)}
                        placeholder='Tulis komentar' style={{
                            borderWidth: 1,
                            borderRadius: 10,
                            height: 40,
                            width: "80%",
                            backgroundColor: '#fff',
                            borderColor: '#fff',
                            paddingHorizontal: 10
                        }} />
                    <Button
                        onPress={commentSubmit}
                        type='clear'
                        buttonStyle={{ height: 40, width: 40 }}
                        icon={
                            <Icon
                                name="send"
                                size={25}
                                color="#fff"
                            />
                        }
                    />
                </View>

                <TrendsAnim translate={translate} />
            </View>
        </>
    );
}

