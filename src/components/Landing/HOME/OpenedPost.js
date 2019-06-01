import React, { useState, useContext } from 'react';
import { View, ScrollView, RefreshControl, Alert, TextInput } from 'react-native';
import { Text, Button, Image, Avatar, } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import HOMESTYLES from './HOMESTYLE';
import firebase from 'react-native-firebase';

export default OpenedPost = ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [item] = useState(navigation.state.params.postIndex);
    const [listComment, setListComment] = useState([
        {
            nama: 'Ilham Cendana',
            commentText: 'iya iya iya iya iya iya iya iya',
            date: '22-Mei-2019',
            time: '14:53',
            profilePict: '',
        },
        {
            nama: 'Ilham Cendana',
            commentText: 'haha iya iya iya iya iya iya iya iya',
            date: '22-Mei-2019',
            time: '14:53',
            profilePict: '',
        },
        {
            nama: 'Ilham Cendana',
            commentText: 'iya iya iya iya iya iya iya iya',
            date: '22-Mei-2019',
            time: '14:53',
            profilePict: '',
        }
    ])
    const [commentInput, setCommentInput] = useState('');

    const _onRefresh = () => {
        setRefreshing(true);
        setRefreshing(false);
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

    const commentSubmit = () => {
        setListComment(prev => [...prev, {
            nama: 'Ilham Cendana',
            commentText: commentInput,
            date: '22-Mei-2019',
            time: '14:53',
            profilePict: '',
        }]);
        setCommentInput('');
    };

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
                }}>GLUE</Text>
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={_onRefresh}
                    />
                }>

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
                        <Button
                            onPress={() => morePressed(item.uid, postIndex)}
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
                        {item.postPict !== '' ? <View style={{ marginBottom: 10 }}>
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

                    <View style={{
                        marginBottom: 10
                    }}>

                        {listComment.map((c, i) => (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                width: '90%',
                                alignSelf: 'center',
                                borderBottomWidth: 1,
                                paddingVertical: 10
                            }} key={i}>
                                <View style={{
                                    width: '20%'
                                }}>
                                    <Image source={require('../../../assets/profileIcon.png')} style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 40 / 2
                                    }} />
                                </View>

                                <View style={{ width: '80%', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 17, marginBottom: 3, fontWeight: '300' }} >{c.nama}</Text>
                                    <Text>{c.commentText}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                paddingVertical: 5,
                backgroundColor: '#4388d6'
            }}>
                <TextInput multiline={true}
                    value={commentInput}
                    onChangeText={(e) => setCommentInput(e)}
                    placeholder='Tulis komentar' style={{
                        borderWidth: 1,
                        borderRadius: 15,
                        height: 40,
                        width: "80%",
                        backgroundColor: '#fff',
                        borderColor: '#fff',
                        paddingHorizontal: 5
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
        </View>
    );
}

