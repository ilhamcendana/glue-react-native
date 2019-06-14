import React, { useState, useEffect } from 'react';
import { View, StatusBar, Alert } from 'react-native';
import firebase from 'react-native-firebase';

//COMPONENTS
import AuthRoot from './src/components/Auth/AuthRoot';
import HomeRoot from './src/components/Landing/HOME/HomeRoot';

export default App = () => {
  const [AUTH, SETAUTH] = useState({
    isAuthenticatedReady: false,
    isAuthenticated: false
  });

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      SETAUTH({ isAuthenticatedReady: true, isAuthenticated: !!user });
    });

    checkPermissionNotif();
  }, []);

  const checkPermissionNotif = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      getToken();
    } else {
      requestPermission();
    }
  }

  const getToken = async () => {
    let fcmToken = await firebase.messaging().getToken();
    console.log(fcmToken, 'got the token ahole');
  }

  const requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }




  if (!AUTH.isAuthenticatedReady) {
    return null;
  } else {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="#4388d6" barStyle="light-content" />
        {(AUTH.isAuthenticated) ?
          <HomeRoot /> : <AuthRoot />}
      </View>
    );
  }
}



