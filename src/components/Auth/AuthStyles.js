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
        marginVertical: 20
    },
    formLogin: {
        alignSelf: 'center',
        width: '80%'
    },
});