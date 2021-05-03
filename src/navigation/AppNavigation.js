import * as React from 'react';
import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AuthScreenRoutes from './AuthRoutes';
import HomeScreenRoutes from './HomeScreenRoutes';
import { navigationRef } from '../helpers/NavigationHelper';
import IndicatorScreen from '../screens/IndicatorScreen';
import UserFollowersScreen from '../screens/UserFollowers';
import UserFollowedScreen from '../screens/UserFollowed';
import { Button } from 'react-native';
//Screens


const Stack = createStackNavigator();

function AppRoutes() {
    return (
        <Stack.Navigator>

            <Stack.Screen
                name="IndicatorScreen"
                component={IndicatorScreen}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="AuthScreen"
                component={AuthScreenRoutes}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="HomeScreen"
                component={HomeScreenRoutes}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="UserFollowersScreen"
                component={UserFollowersScreen}
                title="Hello"
                

                options={{
                    headerBackTitleVisible: false,
                    title: 'Takipçiler',
                 }}

            />
            <Stack.Screen
                name="UserFollowedScreen"
                component={UserFollowedScreen}
                
                options={{ 
                    headerBackTitleVisible: false,
                    title: 'Takip Edilen' 
                }}

            />


        </Stack.Navigator>
    )
}




export default class AppNavigation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        return (
            <NavigationContainer ref={navigationRef}>
                <AppRoutes />
            </NavigationContainer>
        );
    }
}
