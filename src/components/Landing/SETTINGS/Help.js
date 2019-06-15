import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text, Button, } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import { ScrollView } from 'react-native-gesture-handler';
import firebase from 'react-native-firebase';

export default Info = ({ navigation }) => {
    useEffect(() => {
        setLoading(true);
        const refre = firebase.firestore().collection('system').doc('help');
        refre.collection('all')
            .get().then(snap => {
                const data = [];
                snap.forEach(child => {
                    data.push(child.data())
                })
                setContentHelp(data);
            })
        refre.collection('segment').doc('segment').get().then(snap => {
            setSegment(snap.data().segment);
        })
            .then(() => setLoading(false));
    }, [])

    const [contentHelp, setContentHelp] = useState([]);
    const [segment, setSegment] = useState('');
    const [loading, setLoading] = useState(true);

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

            {loading ? <ActivityIndicator color='#4388d6' size='large' style={{ marginVertical: 20 }} /> :
                <ScrollView>
                    <View style={{
                        paddingHorizontal: 20,
                        alignItems: 'center',
                        marginTop: 20
                    }}>
                        <Text style={{ textAlign: 'justify', fontSize: 17, textTransform: 'capitalize' }}>
                            {segment}
                        </Text>
                    </View>

                    <View style={{
                        marginTop: 20,
                    }}>
                        {contentHelp.map((ch, i) => (
                            <View key={i} style={{ paddingHorizontal: 20, marginBottom: 10 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{ch.title}:</Text>

                                {ch.content.map((con, ind) => (
                                    <View key={ind}>
                                        <Text style={{ fontSize: 17 }}>- {con.content}</Text>
                                        <Text style={{ fontSize: 17 }}>- {con.content2}</Text>
                                        <Text style={{ fontSize: 17 }}>- {con.content3}</Text>
                                    </View>

                                ))}
                            </View>
                        ))}
                    </View>

                    <Text style={{ color: 'red', textAlign: 'justify', marginTop: 50, fontWeight: 'bold', alignSelf: 'center' }}>
                        Pemalsuan akun akan ditindak tegas
                </Text>
                </ScrollView>
            }

        </View>
    );
}

