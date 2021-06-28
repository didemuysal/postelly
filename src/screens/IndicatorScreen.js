import { View, Text } from 'react-native';
import Box from '../components/Box';
import { RegularText } from '../components/CustomText';
import React from 'react';

import { ActivityIndicator, Colors } from 'react-native-paper';
import { useEffect } from 'react';
import { getJsonFromStorage } from '../helpers/StorageHelper';


const IndicatorScreen = (props) => {



    useEffect(() => {
        getJsonFromStorage('user').then((result) => {  //user login information checks from storage
            if (result) {
                console.log(result);
                props.navigation.navigate('HomeScreen') // user logged in before, directs to Home Screen
            } else {
                props.navigation.navigate('AuthScreen') // user not logged in before, directs to Login Screen
            }
        }).catch((err) => {
            props.navigation.navigate('AuthScreen')  //login error found, directs to the Login Screen
        })
    }, [])

    return (
        <Box flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator animating={true} color={Colors.blue500} />  
            {/* Show loading icon while directing */}
        </Box>
    )
}

export default IndicatorScreen;