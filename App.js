/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
// needed libraries imported
import React from 'react';
import {
  LogBox,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { backgroundColor } from 'styled-system';


import Box from './src/components/Box';
import AppNavigation from './src/navigation/AppNavigation';
import { Provider as PaperProvider } from 'react-native-paper';
import { useEffect } from 'react';
import AppColors from './src/helpers/Constants';


const App = () => {

  useEffect(() => {
    LogBox.ignoreLogs(['Expected ']);
  },[])

  return (
     //TAB
    <PaperProvider>  
      <SafeAreaView style={{ flex: 1, backgroundColor: AppColors.background }}>
        <StatusBar
          backgroundColor="#F4F7F8"
          barStyle="dark-content"
        />
        <Box flex={1} bg={AppColors.background}>
          <AppNavigation />
        </Box>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
