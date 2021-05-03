// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React
import React from 'react';

// Import Navigators from React Navigation
import { createStackNavigator } from '@react-navigation/stack';

// Import Screens
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';



import MainFlowScreen from '../screens/MainFlow';
import SearchScreen from '../screens/Search';
import UserProfileScreen from '../screens/UserProfile';

import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import AppColors from '../helpers/Constants';
//import {Translation} from 'react-i18next';

const Tab = createBottomTabNavigator();

const HomeScreenRoutes = () => {
    return (
        <Tab.Navigator
            initialRouteName="MenuTab"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'HomeTab') {
                        iconName = 'home';
                    } else if (route.name === 'SearchTab') {
                        iconName = 'search';
                    } else if (route.name === 'UserProfileTab') {
                        iconName = 'user';
                    } else {
                        iconName = 'home';
                    }

                    return <Feather name={iconName} size={size} color={color} />;
                },
            })}

            tabBarOptions={{
                activeTintColor: AppColors.primary,
                inactiveTintColor: '#4f4f4f',
                style: {
                    height: verticalScale(60),
                },
                labelStyle: {
                    fontSize: scale(10),
                },
            }}>

            <Tab.Screen
                name="HomeTab"
                component={MainFlowScreen}
                
                options={{
                    title:"",
                    headerShown:false
                    
                }}
                
            />

            <Tab.Screen
                name="SearchTab"
                component={SearchScreen}
                options={{
                    title:""
                }}
            />

            <Tab.Screen
                name="UserProfileTab"
                component={UserProfileScreen}
                options={{
                    title:""
                }}
            />
        </Tab.Navigator>
    );
}

export default HomeScreenRoutes;
