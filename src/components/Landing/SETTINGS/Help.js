import React from 'react';
import { View } from 'react-native';
import { Text, Button, } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';

export default Info = ({ navigation }) => {

    const contentHelp = [
        {
            title: 'Post:',
            content: [
                'Jika anda melihat post yang berisi kata-kata atau gambar tidak pantas,anda dapat melaporkannya dengan menekan tombol 3 titih horizontal disisi kanan post tersebut',
                'b',
                'c'
            ]
        },
        {
            title: 'Trends:',
            content: [
                'd',
                'e',
                'f'
            ]
        },
        {
            title: 'Profil',
            content: [
                'g',
                'Jika anda melihat post yang berisi kata-kata atau gambar tidak pantas,anda dapat melaporkannya dengan menekan tombol 3 titih horizontal disisi kanan post tersebut',
                'Jika anda melihat post yang berisi kata-kata atau gambar tidak pantas,anda dapat melaporkannya dengan menekan tombol 3 titih horizontal disisi kanan post tersebut'
            ]
        }
    ]

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
                }}>BANTUAN</Text>
            </View>

            <ScrollView>
                <View style={{
                    paddingHorizontal: 20,
                    alignItems: 'center',
                    marginTop: 20
                }}>
                    <Text style={{ textAlign: 'center' }}>
                        Aplikasi GLUE di desain untuk menampung aspirasi mahasiswa dan dosen universitas gunadarma, setiap like yang didapat dari sebuah post akan dihitung, jika jumlah like telah melewati batas maka akan masuk kedalam halaman trends dan akan muncul dihalaman admin
                </Text>

                    <Text style={{ color: 'red', textAlign: 'center' }}>
                        Pemalsuan akun yang dilakukan akan ditindak tegas
                </Text>
                </View>

                <View style={{
                    marginTop: 20,
                    alignItems: 'center',
                }}>
                    {contentHelp.map((ch, i) => (
                        <View key={i} style={{ width: '85%', paddingHorizontal: 10, marginBottom: 10 }}>
                            <Text style={{ fontSize: 20 }}>{ch.title}</Text>

                            <View style={{}}>
                                {ch.content.map((c, i) => (
                                    <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
                                        <IconFA name='circle' size={10} style={{ marginTop: 5, marginRight: 5 }} />

                                        <View style={{ width: '80%' }}>
                                            <Text>{c}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

        </View>
    );
}

