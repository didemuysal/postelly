import { createStackNavigator } from "@react-navigation/stack";

import React from 'react';
import LoginScreen from "../screens/Login";
import RegisterScreen from "../screens/Register";

const Stack = createStackNavigator();

//Stack fot membership and login operation
const AuthScreenStack = ({ navigation }) => {
    return (
        <Stack.Navigator>
        <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}  //direct to login screen if the user did not logged in before
            options={{
                headerShown: false
            }}
        />

        <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen} //if the user is not a member of app
            options={{
                headerShown: false
            }}
        />
        </Stack.Navigator>
    );
};

const AuthScreenRoutes = (props) => {
    return (
      <AuthScreenStack />
    );
};

export default AuthScreenRoutes;