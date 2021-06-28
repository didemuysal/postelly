import React, { useState } from 'react';
import { Alert, Button, Dimensions, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import Box from '../components/Box';
import AppColors from '../helpers/Constants';
import { MediumText, RegularText } from '../components/CustomText';
import AppHeader from '../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import { login } from '../services/auth-service';
import { setJsonToStorage } from '../helpers/StorageHelper';

import logoImage from '../../assets/postelly-logo.png';  //  postelly-logo.png


const LoginScreen = (props) => {

    const inputWidth = Dimensions.get('window').width * 0.9;

    const [username, setUsername] = useState("");   //while user types the username, update the state
    const [password, setPassword] = useState("");   //while user types the password, update the state
    const imageUri = Image.resolveAssetSource(logoImage).uri;

    const checkUserCredentials = () => {
        let userCanNavigate = (username && password) || false; // if password and username does not match with database, no lnavigation to HomeScreen

        if (userCanNavigate) {

            login(username, password).then((result) => {  
                let data = result.data.data;  //get the data from database
                let myData = {  //specialize it, add the password to the data
                    ...data,
                    password: password
                }

                setJsonToStorage('user', myData).then(() => {  //write user information to storage
                    
                    setTimeout(() => {  //after the user logins successfully, run the inside code after 250 miliseconds
                        props.navigation.navigate("HomeScreen", {  //navigate to HomeScreen
                            screen: 'HomeTab'
                        });
                        setUsername("");   //clear the username
                        setPassword("");   //clear the password
                    }, 250)   
 
                }).catch((err) => Alert.alert("Hata", "Bir Hata Oluştu"))  //error while logging
                    .finally(() => {
                    })

            }).catch((err) => {
                console.log(err)
                Alert.alert("Uyarı", "Kullanıcı adı ya da  şifreniz yanlış!");
            })
        } else {
            Alert.alert("Uyarı", "Bilgilerinizi Kontrol Ediniz, Boş Değer Bırakmayınız"); 
        }
    }

    return (
        <>
            <Box  p={3} flex={1} justifyContent="center" alignItems="center">

            <Image  source={{uri:imageUri}} 
            style={{margin:10, marginBottom:20, height:60, width:60}} />
            <AppHeader showBottomBorder="true" />  
            </Box>
            <Box flex={7}>
                <Box mt={30} p={10} flexDirection="row" justifyContent='center' alignItems='center'>
                    <Feather name={"user"} size={30} color={AppColors.primary} />
                    <MediumText>
                        ÜYE GİRİŞİ
            </MediumText>
                </Box>
                <Box borderBottomColor="black" borderBottomWidth={1} marginHorizontal={20} mt={20} >
                </Box>

                <Box mt={50} alignItems="center" flex={1}>
                    <TextInput
                        autoCapitalize="none"   //no letter capitalization
                        onChangeText={(data) => setUsername(data)}   //while user types the username updates the text in the input box 
                        placeholder="Kullanıcı Adı"
                        keyboardType="default"
                        placeholderTextColor='black'
                        value={username}
                        style={{
                            fontFamily: "LexendTera-Regular",
                            marginBottom: 30,
                            borderRadius: 2,
                            borderColor: '#d2d2d2',
                            borderWidth: 1,
                            padding: 10,
                            width: inputWidth,
                            height: 50,
                            backgroundColor: AppColors.input
                        }}
                    />
                    <TextInput
                        secureTextEntry={true}    //password characters are secured with * character
                        autoCapitalize="none"
                        onChangeText={(data) => setPassword(data)}   //while user types the password, update the text in the input box
                        placeholder="Şifre"
                        placeholderTextColor='black'
                        value={password}
                        style={{
                            fontFamily: "LexendTera-Regular",
                            marginBottom: 30,
                            borderRadius: 2,
                            borderColor: '#d2d2d2',
                            borderWidth: 1,
                            padding: 10,
                            width: inputWidth,
                            height: 50,
                            backgroundColor: AppColors.input
                        }}
                    />

                    <Box flex={1} justifyContent="flex-end" p={20} flexDirection="row" width="100%" >    
                        <TouchableOpacity onPress={() => checkUserCredentials()}  //login touchable opacity icon button
                            style={{
                                backgroundColor: AppColors.button,
                                width: "30%",
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10
                            }}>
                            <MediumText color="white" fontSize="15">
                                Giriş Yap
                            </MediumText>

                        </TouchableOpacity>
                    </Box>



                </Box>
                <Box flex={1} mt={50} p={10} width="100%" alignItems="center" justifyContent="center">
                    <RegularText> 
                        Üye değil misin?  
                        </RegularText>
                    <TouchableOpacity onPress={() => props.navigation.navigate("RegisterScreen")}  //navigation to register screen
                        style={{
                            width: "30%",
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}> 
                        {/* button  */}
                        <MediumText color={AppColors.button} fontSize="15px">  
                            Üye Ol
                            </MediumText>

                    </TouchableOpacity>
                </Box>


            </Box>

        </>
    );
}

export default LoginScreen;