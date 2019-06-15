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
import Profile from '../PROFILE/Profile';
import Setting from '../SETTINGS/Setting';
import Info from '../SETTINGS/Info';
import Help from '../SETTINGS/Help';
import EditProfile from '../SETTINGS/EditProfile';
import OpenedProfile from './OpenedProfile';
import ChangePass from '../SETTINGS/ChangePass';

const HomeStack = createStackNavigator({
    Feed: { screen: Home },
    OpenedPost: { screen: OpenedPost },
    OpenedImage: { screen: OpenedImage },
    OpenedProfile: { screen: OpenedProfile },
    CreatePost: { screen: CreatePost },
    Trends: { screen: Trends },
    Notification: { screen: Notification },
    Profile: { screen: Profile },
    Setting: { screen: Setting },
    EditProfile: { screen: EditProfile },
    ChangePass: { screen: ChangePass },
    Info: { screen: Info },
    Help: { screen: Help }
},
    {
        defaultNavigationOptions: {
            header: null,

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

