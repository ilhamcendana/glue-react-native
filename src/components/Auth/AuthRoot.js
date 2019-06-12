import React, { useState, useEffect } from 'react';
import { View, Dimensions, Animated } from 'react-native';
import { Text } from 'react-native-elements';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import SignIn from './SignIn';
import SignUp from './SignUp';
import ForgotPass from './ForgotPass';

const AuthStack = createStackNavigator({
    SignIn: { screen: SignIn },
    SignUp: { screen: SignUp },
    ForgotPass: { screen: ForgotPass }
}, {
        defaultNavigationOptions: {
            header: null
        }
    });

const AuthContainer = createAppContainer(AuthStack);

export default AuthRoot = () => {
    useEffect(() => {
        appAnim();
    }, []);

    const [animVal] = useState(new Animated.Value(0));
    const animInt = animVal.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0]
    });
    const [con, setCon] = useState(true);

    const appAnim = () => {
        Animated.timing(animVal, {
            toValue: 1,
            duration: 1000
        }).start(() => setCon(false));
    }

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    return (
        <View style={{ flex: 1, width: screenWidth }}>
            {!con ? null : <Animated.View style={{
                height: screenHeight,
                width: screenWidth,
                backgroundColor: '#4388d6',
                position: 'absolute',
                zIndex: 1000,
                elevation: 50,
                opacity: animInt,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Text h4 style={{
                    color: '#fff',
                }}>GLUE</Text>
            </Animated.View>}
            <AuthContainer />
        </View>
    )
}

