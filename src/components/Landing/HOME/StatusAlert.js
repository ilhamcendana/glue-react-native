import React from 'react';
import { View, Dimensions, Platform, Animated } from 'react-native';
import { Text } from 'react-native-elements';

export default StatusAlert = ({ status, translate }) => {
    const screenWidth = Dimensions.get('window').width;
    return (
        <Animated.View style={{
            position: 'absolute',
            zIndex: 2000,
            top: 0,
            paddingVertical: 10,
            backgroundColor: status === 'Tidak relevan' ? 'red' : status === 'Sedang ditindak lanjuti' ? '#fff' : 'green',
            elevation: Platform.OS === 'android' ? 50 : 0,
            width: screenWidth,
            alignItems: 'center',
            translateY: translate
        }}>
            <Text style={{ color: status === 'Sedang ditindak lanjuti' ? '#4388d6' : '#fff' }}>Admin: {status}</Text>
        </Animated.View>
    );
}

