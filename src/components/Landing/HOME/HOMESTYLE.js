import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default HOMESTYLES = StyleSheet.create({
    container: {
        flex: 1,
        width: screenWidth,
    },
    card: {
        paddingVertical: 10,
        marginVertical: 20
    },
    user: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 10
    }
});