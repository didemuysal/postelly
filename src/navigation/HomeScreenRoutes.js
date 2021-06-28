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

const Tab = createBottomTabNavigator();   //creating of bottom tab nav

const HomeScreenRoutes = () => {
    return (
        <Tab.Navigator   //in-app navigations created with bottom tab nav
            initialRouteName="MenuTab"
            screenOptions={({ route }) => ({    
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'HomeTab') {     //default screen 
                        iconName = 'home';
                    } else if (route.name === 'SearchTab') {   //search screen
                        iconName = 'search';
                    } else if (route.name === 'UserProfileTab') {  // profile screen
                        iconName = 'user';
                    } else {
                        iconName = 'home';
                    }

                    return <Feather name={iconName} size={size} color={color} />;
                },
            })}

            // design of bottom tab bar
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
                component={MainFlowScreen}   //main flow screen
                
                options={{
                    title:"",
                    headerShown:false
                    
                }}
                
            />

            <Tab.Screen
                name="SearchTab"
                component={SearchScreen}  //search screen
                options={{
                    title:""
                }}
            />

            <Tab.Screen
                name="UserProfileTab"
                component={UserProfileScreen}   // user profile screen
                options={{
                    title:""
                }}
            />
        </Tab.Navigator>
    );
}

export default HomeScreenRoutes;
