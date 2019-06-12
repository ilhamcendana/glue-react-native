import React, { useState, useEffect } from 'react';
import { View, Dimensions, Platform, Animated } from 'react-native';

export default Greeting = ({ children, greet }) => {
    const [greeting] = useState(new Animated.Value(0));
    const [fall, setFall] = useState(false);
    useEffect(() => {
        if (!greet) {
            Animated.timing(greeting, {
                toValue: 1,
                duration: 1000,
                delay: 500
            }).start(() => setFall(true));
        } else null;
    }, [])

    const animRotate = greeting.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0]
    })

    const animScale = greeting.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0]
    })

    return (
        <>
            {fall ? null : <Animated.View style={{
                backgroundColor: '#4388d6',
                height: Dimensions.get('window').height,
                width: Dimensions.get('window').width,
                position: 'absolute',
                zIndex: 5000,
                elevation: Platform.OS === 'android' ? 50 : 0,
                transform: [{ scale: animScale }],
                opacity: animRotate,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {children}
            </Animated.View>}
        </>
    );

}