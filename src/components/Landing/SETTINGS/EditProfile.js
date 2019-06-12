import React, { useState, useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Picker, Alert, Dimensions } from 'react-native';
import { Text, Input, Button, Avatar } from 'react-native-elements';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';

export default EditProfile = ({ navigation }) => {
    useEffect(() => {
        fetchUserData();
    }, [])

    const fetchUserData = () => {
        const ref = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
        ref.get().then(snap => {
            const { nama, npm, tingkat, kode_jur, kode_kel, jurusan, selected_jur, headerImgDB } = snap.data().profile;
            setNama(nama);
            setNPM(npm);
            setTingkat(tingkat);
            setKJ({
                KJ: kode_jur,
                selectedJurusan: selected_jur,
                inputJurusan: jurusan
            });
            setKK(kode_kel);
            setProfilePict(firebase.auth().currentUser.photoURL);
            setProfilePictApp(firebase.auth().currentUser.photoURL);
            setHeaderImg(headerImgDB);
        })
            .then(() => setLoading(true))
    };

    const [loading, setLoading] = useState(false);
    const screenWidth = Dimensions.get('window').width;
    const { navigate } = navigation;
    const jurusan = ['D3 Manajemen Informatika', 'D3 Teknik Komputer', 'D3 Akuntansi', 'D3 Manajemen', 'D3 Kebidanan', 'S1 Sistem Informasi', 'S1 Sistem Komputer', 'S1 Teknik Informatika', 'S1 Teknik Elektro', 'S1 Teknik Mesin', 'S1 Teknik Industri', 'S1 Manajemen', 'S1 Akuntansi', 'S1 Teknik Sipil', 'S1 Teknik Arsitektur', 'S1 Psikologi', 'S1 Sastra'];
    const tingkat = ['1', '2', '3', '4'];
    const kode_jur = ['DB', 'DC', 'DA', 'DD', 'DE', 'KA', 'KB', 'IA', 'IB', 'IC', 'ID', 'EA', 'EB', 'TA', 'TB', 'PA', 'SA'];
    const kode_kel = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

    const [btnLoading, setBtnLoading] = useState(false);
    const [nama, setNama] = useState('');
    const [NPM, setNPM] = useState('');
    const [inputTingkat, setTingkat] = useState('1');
    const [inputKJ, setKJ] = useState({
        KJ: 'DB',
        selectedJurusan: 0,
        inputJurusan: 'D3 Manajemen Informatika'
    });
    const [inputKK, setKK] = useState('01');
    const [profilepict, setProfilePict] = useState('');
    const [profilepictApp, setProfilePictApp] = useState('');

    const openGallery = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
        })
            .then(image => {
                setProfilePictApp(image.path)
            })
            .catch(err => console.log(err))
    }

    const editProfileEvent = () => {
        if (nama === '' || NPM === '' || inputTingkat === '' || inputKK === '') {
            Alert.alert('INVALID', 'Semua kolom wajib diisi !');
        } else if (NPM.length < 8) {
            Alert.alert('INVALID', 'NPM harus memiliki 8 digit');
        }
        else {
            setBtnLoading(true);
            const auth = firebase.auth();

            //If profile pict hasnt changed
            if (profilepict === profilepictApp) {
                auth.currentUser.updateProfile({
                    displayName: nama,
                    photoURL: profilepict
                });

                const dataProfile = {
                    profile: {
                        nama: nama,
                        profilePict: profilepict,
                        kelas: `${inputTingkat}${inputKJ.KJ}${inputKK}`,
                        npm: NPM,
                        jurusan: inputKJ.inputJurusan,
                        kode_jur: inputKJ.KJ,
                        kode_kel: inputKK,
                        tingkat: inputTingkat,
                        selected_jur: inputKJ.selectedJurusan,
                    }
                }

                firebase.firestore().collection('users').doc(auth.currentUser.uid)
                    .set(dataProfile, { merge: true })
                    .then(() => {
                        firebase.firestore().collection('posts').where('uid', '==', auth.currentUser.uid).get()
                            .then(snap => {
                                snap.forEach(child => {
                                    firebase.firestore().collection('posts').doc(child.id).set({
                                        nama: nama
                                    }, { merge: true })
                                })
                            })

                        firebase.firestore().collection('comments').where('uid', '==', auth.currentUser.uid).get()
                            .then(snap => {
                                snap.forEach(child => {
                                    firebase.firestore().collection('comments').doc(child.id).set({
                                        nama: nama
                                    }, { merge: true })
                                })
                            })
                    })
                    .then(() => navigate('Profile'))
                    .catch(err => {
                        Alert.alert('Error', err.message);
                        console.log(err);
                    })

            } else {//if profile pict is changed                
                const storageRef = firebase.storage().ref('PROFILE-PICTURE/PP_' + auth.currentUser.uid);
                storageRef.putFile(profilepictApp)
                    .then(img => {
                        auth.currentUser.updateProfile({
                            displayName: nama,
                            photoURL: img.downloadURL
                        });

                        const dataProfile = {
                            profile: {
                                nama: nama,
                                profilePict: img.downloadURL,
                                kelas: `${inputTingkat}${inputKJ.KJ}${inputKK}`,
                                npm: NPM,
                                jurusan: inputKJ.inputJurusan,
                                kode_jur: inputKJ.KJ,
                                kode_kel: inputKK,
                                tingkat: inputTingkat,
                                selected_jur: inputKJ.selectedJurusan,
                            }
                        }

                        firebase.firestore().collection('users').doc(auth.currentUser.uid)
                            .set(dataProfile, { merge: true })


                        firebase.firestore().collection('posts').where('uid', '==', auth.currentUser.uid).get()
                            .then(snap => {
                                snap.forEach(child => {
                                    firebase.firestore().collection('posts').doc(child.id).set({
                                        profilePict: img.downloadURL,
                                        nama: nama
                                    }, { merge: true })
                                })
                            })

                        firebase.firestore().collection('comments').where('uid', '==', auth.currentUser.uid).get()
                            .then(snap => {
                                snap.forEach(child => {
                                    firebase.firestore().collection('comments').doc(child.id).set({
                                        nama: nama,
                                        profilePict: img.downloadURL
                                    }, { merge: true })
                                })
                            })
                    })
                    .then(() => navigate('Profile'))
                    .catch(err => {
                        Alert.alert('Error', err.message);
                        console.log(err);
                    })
            }
        }
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
                }}>SUNTING PROFIL</Text>
            </View>

            <ScrollView>
                <KeyboardAvoidingView behavior='padding'>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                    }}>
                        <Avatar
                            onPress={openGallery}
                            rounded
                            source={profilepictApp !== '' ? { uri: profilepictApp } : require('../../../assets/profileIcon.png')}
                            size='large'
                            containerStyle={{ marginVertical: 20, alignSelf: 'center' }}
                            showEditButton />

                        <View style={{
                            alignSelf: 'center',
                            width: screenWidth,
                        }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Input
                                    containerStyle={{ marginBottom: 20, width: '50%' }}
                                    placeholder='Nama'
                                    value={nama}
                                    autoCapitalize='words'
                                    inputContainerStyle={{ borderBottomColor: '#4388d6' }}
                                    onChangeText={e => setNama(e.slice(0, 20))}
                                    editable={loading}
                                />
                                <Input
                                    containerStyle={{ marginBottom: 20, width: '50%' }}
                                    placeholder='NPM'
                                    value={NPM}
                                    onChangeText={e => setNPM(e.slice(0, 8))}
                                    keyboardType='numeric'
                                    inputContainerStyle={{ borderBottomColor: '#4388d6' }}
                                    editable={loading}
                                />
                            </View>

                            <View style={{ paddingHorizontal: 10 }}>
                                <Text style={{ color: '#aaa', fontSize: 18 }}>Kelas</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <Picker
                                        mode='dialog'
                                        style={{ width: '30%' }}
                                        onValueChange={(e) => setTingkat(e)}
                                        selectedValue={inputTingkat}
                                        enabled={loading}>
                                        {tingkat.map(t => <Picker.Item label={t} key={t} value={t} />)}

                                    </Picker>
                                    <Picker
                                        mode='dialog'
                                        style={{ width: '30%' }}
                                        onValueChange={(e, i) => setKJ({ KJ: e, selectedJurusan: i, inputJurusan: jurusan[i] })}
                                        selectedValue={inputKJ.KJ}
                                        enabled={loading}>
                                        {kode_jur.map(kj => <Picker.Item label={kj} key={kj} value={kj} />)}

                                    </Picker>
                                    <Picker
                                        mode='dialog'
                                        style={{ width: '30%' }}
                                        onValueChange={(e) => setKK(e)}
                                        selectedValue={inputKK}
                                        enabled={loading}>
                                        {kode_kel.map(kk => <Picker.Item label={kk} key={kk} value={kk} />)}

                                    </Picker>
                                </View>
                            </View>
                            <Text style={{
                                borderBottomWidth: 1, borderColor: '#4388d6', paddingVertical: 5, paddingHorizontal: 15,
                                borderRadius: 10, color: '#4388d6', marginTop: 20, marginBottom: 30, fontSize: 18, fontWeight: 'bold', textAlign: 'center'
                            }}>{inputKJ.inputJurusan}</Text>

                            <View style={{ width: '80%', alignSelf: 'center', }}>
                                <Button
                                    title="SIMPAN"
                                    raised
                                    loading={btnLoading}
                                    onPress={editProfileEvent}
                                />
                            </View>
                        </View>

                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
}

