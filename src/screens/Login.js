import React, { useState } from 'react';
import { Alert, Button, Dimensions, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import Box from '../components/Box';
import AppColors from '../helpers/Constants';
import { MediumText, RegularText } from '../components/CustomText';
import AppHeader from '../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import { login } from '../services/auth-service';
import { setJsonToStorage } from '../helpers/StorageHelper';

import logoImage from '../../assets/postelly-logo.png';


const LoginScreen = (props) => {

    const inputWidth = Dimensions.get('window').width * 0.9;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const imageUri = Image.resolveAssetSource(logoImage).uri;

    const checkUserCredentials = () => {
        let userCanNavigate = (username && password) || false;

        if (userCanNavigate) {

            login(username, password).then((result) => {
                let data = result.data.data;
                let myData = {
                    ...data,
                    password: password
                }

                setJsonToStorage('user', myData).then(() => {
                    
                    setTimeout(() => {
                        props.navigation.navigate("HomeScreen", {
                            screen: 'HomeTab'
                        });
                        setUsername("");
                        setPassword("");
                    }, 250)

                }).catch((err) => Alert.alert("Hata", "Bir Hata Oluştu"))
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
                        autoCapitalize="none"
                        onChangeText={(data) => setUsername(data)}
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
                        secureTextEntry={true}
                        autoCapitalize="none"
                        onChangeText={(data) => setPassword(data)}
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
                        <TouchableOpacity onPress={() => checkUserCredentials()}
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
                    <TouchableOpacity onPress={() => props.navigation.navigate("RegisterScreen")}
                        style={{
                            width: "30%",
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
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