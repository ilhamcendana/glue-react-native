import React, { useState, useContext, useEffect } from 'react';
import { View, Alert, TextInput, ActivityIndicator, KeyboardAvoidingView, ScrollView, TouchableOpacity, Picker } from 'react-native';
import { Text, Button, Image, Badge, } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import { CONTEXT } from '../../Context';
import firebase from 'react-native-firebase';

export default CreatePost = ({ navigation }) => {
    useEffect(() => {
        profileData();
    }, []);

    const { uid, displayName } = firebase.auth().currentUser;
    const profileData = () => {
        firebase.firestore().collection('users').doc(uid).get().then(snap => {
            setInputPost({ ...inputPost, profilePict: snap.data().profile.profilePict });
        })
    }

    const date = new Date();
    const year = date.getFullYear().toString();
    const month = date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    const merge = `${year}${month}${day}${hour}${minutes}${second}`;

    const [post, setPost] = useContext(CONTEXT);
    const [loadingBtn, setloadingBtn] = useState(false);
    const [postImg, setPostImg] = useState('');
    const [inputPost, setInputPost] = useState({
        nama: displayName,
        profilePict: '',
        caption: '',
        category: '',
        totalUpVote: 0,
        postInfo: {
            totalComments: 0,
            totalReported: 0
        },
        mergeDate: merge,
        key: '',
        uid: uid,
        userWhoLiked: {},
        userWhoReported: {},
        status: ''

    });
    const POSTING = () => {
        if (inputPost.category === '') return Alert.alert('INVALID', 'Categori kosong !')

        setloadingBtn(true);
        if (postImg !== '') {
            const ref = firebase.storage().ref('POST-PICTURE/' + 'P' + date.getFullYear() + date.getMonth() + date.getDay() + date.getMinutes() + ':' + date.getMilliseconds());
            ref.putFile(postImg)
                .then((img) => {
                    const db = firebase.firestore().collection('posts');
                    db.add(inputPost)
                        .then(snap => {
                            firebase.firestore().collection('posts').doc(snap.id)
                                .set({
                                    key: snap.id,
                                    postPict: img.downloadURL
                                }, { merge: true })
                        })
                    setPostImg(img.downloadURL);
                })
                .then(() => {
                    const ref = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
                    ref.get().then(snap => {
                        ref.set({
                            profile: {
                                totalPost: snap.data().profile.totalPost + 1
                            }
                        }, { merge: true })
                    })
                })
                .then(() => {
                    const data = { ...post };
                    const newInputPost = inputPost;
                    newInputPost.postPict = postImg;
                    data.allPost.unshift(newInputPost);
                    setPost(data);
                    setloadingBtn(false);
                })
                .then(() => navigation.navigate('Feed'))
                .catch(err => {
                    console.log(err);
                    Alert.alert('Something Wrong', err.message);
                    setloadingBtn(false);
                });
        } else {
            const db = firebase.firestore().collection('posts');
            db.add(inputPost)
                .then(snap => {
                    firebase.firestore().collection('posts').doc(snap.id)
                        .set({
                            key: snap.id
                        }, { merge: true })

                    setInputPost(prev => {
                        const newD = prev;
                        prev.key = snap.id
                        return newD;
                    })

                })
                .then(() => {
                    const ref = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
                    ref.get().then(snap => {
                        ref.set({
                            profile: {
                                totalPost: snap.data().profile.totalPost + 1
                            }
                        }, { merge: true })
                    })
                })
                .then(() => {
                    const data = { ...post };
                    data.allPost.unshift(inputPost);
                    setPost(data);
                    setloadingBtn(false);
                })
                .then(() => navigation.navigate('Feed'))
                .catch(err => {
                    console.log(err);
                    setloadingBtn(false);
                    Alert.alert('Something Wrong', err.message);
                });
        }
    };
    return (
        <View style={{
            flex: 1
        }}>
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
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <Button
                    type='clear'
                    onPress={() => navigation.navigate('Feed')}
                    icon={
                        <Icon name='arrow-left' color='#fff' size={25} />
                    }
                    buttonStyle={{ marginLeft: 5 }}
                />
                {!loadingBtn ? <Text style={{
                    fontSize: 22, fontWeight: 'bold', color: '#fff'
                }}>GLUE</Text> : <ActivityIndicator color='#fff' size='large' />}

                <Button
                    disabled={inputPost.caption !== '' ? false : true || loadingBtn ? true : false}
                    type='clear'
                    onPress={POSTING}
                    icon={
                        <Icon name='send' color='#fff' size={25} />
                    }
                    buttonStyle={{ marginRight: 5 }}
                />
            </View>

            <ScrollView>
                <KeyboardAvoidingView behavior='padding'>
                    <View style={{
                        paddingHorizontal: 20,
                        paddingVertical: 20
                    }}>
                        <View style={{
                            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Button
                                    onPress={() => {
                                        ImagePicker.openCamera({
                                            width: 300,
                                            height: 400,
                                            cropping: false,
                                        })
                                            .then(image => {
                                                setPostImg(image.path)
                                            })
                                            .catch(err => console.log(err))
                                    }}
                                    icon={
                                        <Icon name='camera' color='#fff' size={25} />
                                    }
                                    buttonStyle={{ marginRight: 5 }}
                                />
                                <Button
                                    onPress={() => {
                                        ImagePicker.openPicker({
                                            width: 300,
                                            height: 400,
                                            cropping: false,
                                        })
                                            .then(image => {
                                                setPostImg(image.path)
                                            })
                                            .catch(err => console.log(err))
                                    }}
                                    icon={
                                        <Icon name='image' color='#fff' size={25} />
                                    }
                                />
                            </View>

                            <Picker
                                style={{
                                    borderBottomWidth: 4, height: 30, width: '45%',
                                    borderBottomColor: 'red', backgroundColor: '#4388d6', borderRadius: 20,
                                    color: '#fff'
                                }}
                                mode='dialog'
                                selectedValue={inputPost.category}
                                onValueChange={e => setInputPost({ ...inputPost, category: e })}
                            >
                                <Picker.Item label='Kategori' value='' />
                                <Picker.Item label='Info' value='Info' />
                                <Picker.Item label='Fasilitas' value='Fasilitas' />
                                <Picker.Item label='Sosial' value='Sosial' />
                            </Picker>
                        </View>

                        <TextInput
                            autoFocus={true}
                            value={inputPost.caption}
                            onChangeText={e => setInputPost({ ...inputPost, caption: e })}
                            placeholder='Ketik post'
                            multiline={true}
                            style={{
                                borderBottomWidth: 1 / 2,
                                borderColor: inputPost.caption !== '' ? '#4388d6' : '#666',
                                marginBottom: 20
                            }}
                        />

                        {postImg !== '' ? <View>
                            <TouchableOpacity
                                onPress={() => setPostImg('')}
                                style={{
                                    backgroundColor: 'red', width: 40,
                                    height: 40, borderRadius: 40 / 2, justifyContent: 'center', alignItems: 'center',
                                    zIndex: 1000, position: 'absolute', top: -6, right: -6
                                }}>
                                <Icon name='x' size={25} color='#fff' />
                            </TouchableOpacity>

                            <Image source={{ uri: postImg }} style={{
                                width: '100%',
                                height: 300,
                            }} />
                        </View> : null}
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
};

