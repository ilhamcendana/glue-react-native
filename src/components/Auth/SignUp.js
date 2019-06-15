import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Picker, Alert } from 'react-native';
import { AuthStyles } from './AuthStyles';
import { Text, Input, Button } from 'react-native-elements';
import firebase from 'react-native-firebase';

export default SignIn = (props) => {
    const { navigate } = props.navigation;
    const jurusan = ['D3 Manajemen Informatika', 'D3 Teknik Komputer', 'D3 Akuntansi', 'D3 Manajemen', 'D3 Kebidanan', 'S1 Sistem Informasi', 'S1 Sistem Komputer', 'S1 Teknik Informatika', 'S1 Teknik Elektro', 'S1 Teknik Mesin', 'S1 Teknik Industri', 'S1 Manajemen', 'S1 Akuntansi', 'S1 Teknik Sipil', 'S1 Teknik Arsitektur', 'S1 Psikologi', 'S1 Sastra'];
    const tingkat = ['1', '2', '3', '4'];
    const kode_jur = ['DB', 'DC', 'DA', 'DD', 'DE', 'KA', 'KB', 'IA', 'IB', 'IC', 'ID', 'EA', 'EB', 'TA', 'TB', 'PA', 'SA'];
    const kode_kel = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

    const [btnLoading, setBtnLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [nama, setNama] = useState('');
    const [NPM, setNPM] = useState('');
    const [inputTingkat, setTingkat] = useState('1');
    const [inputKJ, setKJ] = useState({
        KJ: 'DB',
        selectedJurusan: 0,
        inputJurusan: 'D3 Manajemen Informatika'
    });
    const [inputKK, setKK] = useState('01');

    const signupEvent = () => {
        if (email === '' || password === '' || nama === '' || NPM === '' || inputTingkat === '' || inputKK === '') {
            Alert.alert('INVALID', 'Semua kolom wajib diisi !');
        } else if (password !== repassword) {
            Alert.alert('INVALID', 'Password tidak sama');
        }
        else if (NPM.length < 8) {
            Alert.alert('INVALID', 'NPM harus memiliki 8 digit');
        }
        else {
            setBtnLoading(true);
            const auth = firebase.auth();
            auth.createUserWithEmailAndPassword(email, password)
                .then((uid) => {
                    auth.currentUser.updateProfile({
                        displayName: nama,
                        photoURL: 'https://firebasestorage.googleapis.com/v0/b/forumpengaduan.appspot.com/o/defaultProfilePict%2FProfileIcon.png?alt=media&token=64afa9bb-ec14-4710-a298-bd2df8df457c'
                    })
                })
                .then(() => {
                    const ref = firebase.firestore().collection('users');
                    ref.doc(auth.currentUser.uid).set({
                        profile: {
                            nama: nama,
                            profilePict: 'https://firebasestorage.googleapis.com/v0/b/forumpengaduan.appspot.com/o/defaultProfilePict%2FProfileIcon.png?alt=media&token=64afa9bb-ec14-4710-a298-bd2df8df457c',
                            kelas: `${inputTingkat}${inputKJ.KJ}${inputKK}`,
                            npm: NPM,
                            jurusan: inputKJ.inputJurusan,
                            kode_jur: inputKJ.KJ,
                            kode_kel: inputKK,
                            tingkat: inputTingkat,
                            selected_jur: inputKJ.selectedJurusan,
                            totalPost: 0,
                            totalTrends: 0,
                            totalVote: 0,
                            headerImgDB: ''

                        }
                    })
                    setBtnLoading(false);
                })
                .then(() => {
                    auth.currentUser.sendEmailVerification()
                        .then(() => Alert.alert('Verifikasi email', 'Email verifikasi telah dikirim'))
                })
                .catch(err => {
                    Alert.alert('Error', err.message);
                    console.log(err);
                    setBtnLoading(false);
                })
        }
    };

    return (
        <View>
            <ScrollView>
                <KeyboardAvoidingView behavior='padding'>
                    <View style={AuthStyles.container}>
                        <Text h3 style={AuthStyles.title}>Buat Akun</Text>

                        <View style={AuthStyles.formLogout}>
                            <View style={{ flexDirection: 'row' }}>
                                <Input
                                    containerStyle={{ marginBottom: 20, width: '50%' }}
                                    placeholder='Email'
                                    value={email}
                                    onChangeText={e => setEmail(e)}
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                    inputContainerStyle={{ borderBottomColor: '#4388d6' }}
                                />
                                <Input
                                    containerStyle={{ marginBottom: 20, width: '50%' }}
                                    placeholder='Nama'
                                    value={nama}
                                    autoCapitalize='words'
                                    inputContainerStyle={{ borderBottomColor: '#4388d6' }}
                                    onChangeText={e => setNama(e.slice(0, 20))}
                                />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Input
                                    containerStyle={{ marginBottom: 20, width: '50%' }}
                                    placeholder='Password'
                                    value={password}
                                    onChangeText={e => setPassword(e)}
                                    secureTextEntry={true}
                                    autoCapitalize='none'
                                    inputContainerStyle={{ borderBottomColor: '#4388d6' }}
                                />
                                <Input
                                    containerStyle={{ marginBottom: 20, width: '50%' }}
                                    placeholder='Re-enter Password'
                                    value={repassword}
                                    onChangeText={e => setRepassword(e)}
                                    secureTextEntry={true}
                                    autoCapitalize='none'
                                    inputContainerStyle={{ borderBottomColor: '#4388d6' }}
                                />
                            </View>

                            <Input
                                containerStyle={{ marginBottom: 20, }}
                                placeholder='NPM'
                                value={NPM}
                                onChangeText={e => setNPM(e.slice(0, 8))}
                                keyboardType='numeric'
                                inputContainerStyle={{ borderBottomColor: '#4388d6' }}
                            />


                            <View style={{ paddingHorizontal: 10 }}>
                                <Text style={{ color: '#aaa', fontSize: 18 }}>Kelas</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <Picker
                                        mode='dialog'
                                        style={{ width: '30%' }}
                                        onValueChange={(e) => setTingkat(e)}
                                        selectedValue={inputTingkat}>
                                        {tingkat.map(t => <Picker.Item label={t} key={t} value={t} />)}

                                    </Picker>
                                    <Picker
                                        mode='dialog'
                                        style={{ width: '30%' }}
                                        onValueChange={(e, i) => setKJ({ KJ: e, selectedJurusan: i, inputJurusan: jurusan[i] })}
                                        selectedValue={inputKJ.KJ}>
                                        {kode_jur.map(kj => <Picker.Item label={kj} key={kj} value={kj} />)}

                                    </Picker>
                                    <Picker
                                        mode='dialog'
                                        style={{ width: '30%' }}
                                        onValueChange={(e) => setKK(e)}
                                        selectedValue={inputKK}>
                                        {kode_kel.map(kk => <Picker.Item label={kk} key={kk} value={kk} />)}

                                    </Picker>
                                </View>
                            </View>
                            <Text style={{
                                borderBottomWidth: 1, borderColor: '#4388d6', paddingVertical: 5, paddingHorizontal: 15,
                                borderRadius: 10, color: '#4388d6', marginTop: 20, marginBottom: 30, fontSize: 18, fontWeight: 'bold', textAlign: 'center'
                            }}>{inputKJ.inputJurusan}</Text>

                            <View style={{ width: '80%', alignSelf: 'center' }}>
                                <Button
                                    title="Daftar"
                                    raised
                                    loading={btnLoading}
                                    onPress={signupEvent}
                                />
                            </View>
                        </View>

                        <View style={{ width: '80%', alignSelf: 'center' }}>
                            <Button title='Login' type='outline' onPress={() => navigate('SignIn')}
                                buttonStyle={{ marginVertical: 20 }} />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
};

