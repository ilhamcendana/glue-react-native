import React, { useState } from 'react';
import { View, Dimensions, ActivityIndicator } from 'react-native';
import { Text, Image, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';

export default OpenedImage = ({ navigation }) => {
    const screenWidth = Dimensions.get('window').width;
    const [IMAGEURI] = useState(navigation.state.params.imageUri);
    return (
        <View style={{ flex: 1, backgroundColor: '#333' }}>
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

            <View style={{ justifyContent: 'center', width: screenWidth, flex: 1 }}>
                <Image
                    source={{ uri: IMAGEURI }}
                    style={{ width: '100%', height: 400 }}
                    PlaceholderContent={<ActivityIndicator />}
                />
            </View>
        </View>
    );
}

