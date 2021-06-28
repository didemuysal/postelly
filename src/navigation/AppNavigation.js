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
{/* // Stack navigator for user routes */}
            <Stack.Screen
                name="IndicatorScreen"
                component={IndicatorScreen}  // route to HomeScreen or AuthRoute
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="AuthScreen"
                component={AuthScreenRoutes}  // Auth route AuthRoues.js for Login or registration
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="HomeScreen"
                component={HomeScreenRoutes}  // In-app navigation route HomeScreenRoutes.js - home-search-profile
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="UserFollowersScreen"
                component={UserFollowersScreen} // in UserProfileScreen - Followers Screen
                title="Hello"
                

                options={{
                    headerBackTitleVisible: false,
                    title: 'Takipçiler',
                 }}

            />
            <Stack.Screen
                name="UserFollowedScreen"
                component={UserFollowedScreen}  //in UserProfileScreen - Followed Users Screen
                
                options={{ 
                    headerBackTitleVisible: false,
                    title: 'Takip Edilen' 
                }}

            />


        </Stack.Navigator>
    )
}




export default class  AppNavigation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        return (
            <NavigationContainer ref={navigationRef}>
                <AppRoutes/>
            </NavigationContainer>
        );
    }
}
