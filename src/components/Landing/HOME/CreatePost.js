import React, { useState, useContext } from 'react';
import { View, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity, Picker } from 'react-native';
import { Text, Button, Image, Badge, } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import { CONTEXT } from '../../Context';

export default CreatePost = ({ navigation }) => {
    const [post, setPost] = useContext(CONTEXT);
    const [inputPost, setInputPost] = useState({
        nama: '',
        profilePict: '',
        caption: '',
        postImg: '',
        category: '',
        totalUpVote: 0,
        postInfo: {
            totalComments: 0,
            totalReported: 0
        },
        key: '',
        uid: '',
        userWhoLiked: {}
    });

    const POSTING = () => {
        const data = post.allPost;
        const newData = [...data, inputPost]
        setPost(newData);
        navigation.navigate('Feed');
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
                <Text style={{
                    fontSize: 22, fontWeight: 'bold', color: '#fff'
                }}>GLUE</Text>

                <Button
                    disabled={inputPost.caption !== '' ? false : true}
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
                                                setInputPost({ ...inputPost, postImg: image.path })
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
                                                setInputPost({ ...inputPost, postImg: image.path });
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

                        {inputPost.postImg !== '' ? <View>
                            <TouchableOpacity
                                onPress={() => setInputPost({ postImg: '' })}
                                style={{
                                    backgroundColor: 'red', width: 40,
                                    height: 40, borderRadius: 40 / 2, justifyContent: 'center', alignItems: 'center',
                                    zIndex: 1000, position: 'absolute', top: -6, right: -6
                                }}>
                                <Icon name='x' size={25} color='#fff' />
                            </TouchableOpacity>

                            <Image source={{ uri: inputPost.postImg }} style={{
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

