import React from 'react';
import { View } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { CONTEXT_PROVIDER } from '../../Context';

//COMPONENTS
import Home from './Home';
import OpenedPost from './OpenedPost';
import OpenedImage from './OpenedImage';
import CreatePost from './CreatePost';
import Trends from '../TRENDS/Trends';
import Notification from '../NOTIFICATION/Notification';

const HomeStack = createStackNavigator({
    Feed: { screen: Home },
    OpenedPost: { screen: OpenedPost },
    OpenedImage: { screen: OpenedImage },
    CreatePost: { screen: CreatePost },
    Trends: { screen: Trends },
    Notification: { screen: Notification }
},
    {
        defaultNavigationOptions: {
            header: null
        }
    }
);

const HomeContainer = createAppContainer(HomeStack);

export default HomeRoot = () => {
    return (
        <CONTEXT_PROVIDER>
            <View style={{ flex: 1 }}>
                <HomeContainer />
            </View>
        </CONTEXT_PROVIDER>
    );
}

