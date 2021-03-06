import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
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

    firebase.messaging().requestPermission()
      .then(() => {
        console.log('get permission')
      })
      .catch(error => {
        console.log(error);
      });

    firebase.messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {
          console.log(fcmToken);
        } else {
          console.log('no token');
        }
      });
  }, []);


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



