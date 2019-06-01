import React, { useState } from 'react';
import { View, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Image, Badge, } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';

export default CreatePost = ({ navigation }) => {
    const [inputPost, setInputPost] = useState('');
    const [imgPost, setImgPost] = useState('');
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
                    disabled={inputPost !== '' ? false : true}
                    type='clear'
                    onPress={() => navigation.navigate('Feed')}
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
                            flexDirection: 'row'
                        }}>
                            <Button
                                raised
                                onPress={() => {
                                    ImagePicker.openCamera({
                                        width: 300,
                                        height: 400,
                                        cropping: true,
                                    })
                                        .then(image => {
                                            setImgPost(image.path);
                                        })
                                        .catch(err => console.log(err))
                                }}
                                icon={
                                    <Icon name='camera' color='#fff' size={25} />
                                }
                                buttonStyle={{ marginRight: 5 }}
                            />
                            <Button
                                raised
                                onPress={() => {
                                    ImagePicker.openPicker({
                                        width: 300,
                                        height: 400,
                                        cropping: true
                                    })
                                        .then(image => {
                                            setImgPost(image.path);
                                        })
                                        .catch(err => console.log(err))
                                }}
                                icon={
                                    <Icon name='image' color='#fff' size={25} />
                                }
                            />
                        </View>

                        <TextInput
                            autoFocus={true}
                            value={inputPost}
                            onChangeText={e => setInputPost(e)}
                            placeholder='Ketik post'
                            multiline={true}
                            style={{
                                borderBottomWidth: 1 / 2,
                                borderColor: inputPost !== '' ? '#4388d6' : '#666',
                                marginBottom: 20
                            }}
                        />

                        {imgPost !== '' ? <View>
                            <TouchableOpacity
                                onPress={() => setImgPost('')}
                                style={{
                                    backgroundColor: 'red', width: 40,
                                    height: 40, borderRadius: 40 / 2, justifyContent: 'center', alignItems: 'center',
                                    zIndex: 1000, position: 'absolute', top: -6, right: -6
                                }}>
                                <Icon name='x' size={25} color='#fff' />
                            </TouchableOpacity>

                            <Image source={{ uri: imgPost }} style={{
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

