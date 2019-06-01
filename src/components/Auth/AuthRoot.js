import React from 'react';
import { View, Dimensions } from 'react-native';
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
    const screenWidth = Dimensions.get('window').width;
    return (
        <View style={{ flex: 1, width: screenWidth }}>
            <AuthContainer />
        </View>
    )
}

