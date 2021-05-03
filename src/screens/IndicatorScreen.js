import { View, Text } from 'react-native';
import Box from '../components/Box';
import {RegularText} from '../components/CustomText';
import React from 'react';

import { ActivityIndicator, Colors } from 'react-native-paper';
import { useEffect } from 'react';
import { getJsonFromStorage } from '../helpers/StorageHelper';


    const IndicatorScreen = (props) => {
        


        useEffect(()  => {
            getJsonFromStorage('user').then((result) => {
                if(result){
                    console.log(result);
                    props.navigation.navigate('HomeScreen')
                } else {
                    props.navigation.navigate('AuthScreen')
                }
            }).catch((err) => {
                props.navigation.navigate('AuthScreen')
            })
        },[])

        return(
            <Box flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator animating={true} color={Colors.blue500} />
        </Box>
    )
}

export default IndicatorScreen;