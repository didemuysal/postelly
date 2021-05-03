import { createStackNavigator } from "@react-navigation/stack";

import React from 'react';
import LoginScreen from "../screens/Login";
import RegisterScreen from "../screens/Register";

const Stack = createStackNavigator();


const AuthScreenStack = ({ navigation }) => {
    return (
        <Stack.Navigator>
        <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
                headerShown: false
            }}
        />

        <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
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