import React from 'react';
import { View, Animated } from 'react-native';
import { Text } from 'react-native-elements';


export default TrendsAnim = ({ translate }) => {
    return (
        <Animated.View style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: '#4388d6',
            alignItems: 'center',
            paddingVertical: 10,
            translateY: translate
        }}>
            <Text style={{ color: '#fff' }}>Post ini sedang trend</Text>
        </Animated.View>
    );
}

