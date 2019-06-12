import { Dimensions, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const AuthStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        alignSelf: 'center',
        marginVertical: 20,
        color: '#4388d6'
    },
    formLogin: {
        alignSelf: 'center',
        width: '80%',
    },
    formLogout: {
        alignSelf: 'center',
        width: screenWidth,
    },
});