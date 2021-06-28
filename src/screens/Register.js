import React, { useState, useEffect } from 'react';
import { Alert, Button, Dimensions, Text, TextInput, TouchableOpacity } from 'react-native';
import Box from '../components/Box';
import { MediumText, RegularText } from '../components/CustomText';
import AppHeader from '../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import { saveUser } from '../services/user-service';
import AppColors from '../helpers/Constants';

const RegisterScreen = (props) => {

    const inputWidth = Dimensions.get('window').width * 0.9;
    const [username, setUsername] = useState("");   
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const register = () => {  
        let myArr = new Array( //assigning values to array
            username,
            firstName,
            lastName,
            password,
            phone,
            email);


        let checkForInputs = myArr.every(d => d.length > 0);  //length check for the array - no null or emptiness - false => alert, true goes to if condition
        if (checkForInputs) {
            saveUser(username, firstName, lastName, password, phone, email) //saving user informations
                .then((res) => {
                    Alert.alert( //pop-up alert for successfully registration
                        "Bilgilendirme",
                        "Üyelik Kaydınız Başarıyla Oluşturulmuştur",
                        [
                            {
                                text: "OK", onPress: () => {  //clearing the input boxes after succesful register with OK button
                                    setUsername("");
                                    setFirstName("");
                                    setLastName("");
                                    setPassword("");
                                    setPhone("");
                                    setEmail("");

                                    props.navigation.navigate('LoginScreen'); //navigation to Login Screen
                                }
                            }
                        ]
                    );

                }).catch(err => {
                    Alert.alert("Uyarı", "Kullanıcı Kaydı Yapılamadı!");  //error while registration
                    console.log(err);
                })
        } else {
            Alert.alert("Uyarı", "Bilgilerinizi Kontrol Ediniz"); //missing or invald information - output false from checkForInputs 
        }
    }



    return (
        <>
            <AppHeader showBottomBorder="true" />
            <Box flex={7}> 
                <Box mt={30} p={10} flexDirection="row" justifyContent='center' alignItems='center'>
                    <Feather name={"user"} size={30} color={AppColors.primary} />
                    <MediumText> 
                        ÜYE OL
            </MediumText>
                </Box>
                <Box borderBottomColor="black" borderBottomWidth={1} marginHorizontal={20} mt={20} >
                </Box>

                <Box mt={30} alignItems="center" flex={1}>
                    <TextInput                                          //username input box
                        autoCapitalize="none"
                        onChangeText={((text) => setUsername(text))}    //updating username text visually on the screen with state
                        value={username}
                        placeholder="Kullanıcı Adı"
                        placeholderTextColor='black'
                        style={{
                            fontFamily: "LexendTera-Regular",
                            marginBottom: 5,
                            borderRadius: 2,
                            borderColor: '#d2d2d2',
                            borderWidth: 1,
                            padding: 10,
                            width: inputWidth,
                            height: 50,
                            backgroundColor: AppColors.input
                        }}
                    />

                    <TextInput                                            // first name input box
                        autoCapitalize="none"
                        onChangeText={((text) => setFirstName(text))}    //updating first name text visually on the screen with state
                        value={firstName}
                        placeholder="Ad"
                        keyboardType="default"
                        placeholderTextColor='black'
                        style={{
                            fontFamily: "LexendTera-Regular",
                            marginBottom: 5,
                            borderRadius: 2,
                            borderColor: '#d2d2d2',
                            borderWidth: 1,
                            padding: 10,
                            width: inputWidth,
                            height: 50,
                            backgroundColor: AppColors.input
                        }}
                    />

                    <TextInput                                               //last name input box
                        autoCapitalize="none"
                        onChangeText={((text) => setLastName(text))}         //updating last name text visually on the screen  with state
                        value={lastName}
                        placeholder="Soyad"
                        keyboardType="default"
                        placeholderTextColor='black'
                        style={{
                            fontFamily: "LexendTera-Regular",
                            marginBottom: 5,
                            borderRadius: 2,
                            borderColor: '#d2d2d2',
                            borderWidth: 1,
                            padding: 10,
                            width: inputWidth,
                            height: 50,
                            backgroundColor: AppColors.input
                        }}
                    />
                    <TextInput                                              //password input box
                        autoCapitalize="none" 
                        onChangeText={((text) => setPassword(text))}       //updating password text visually on the screen with state
                        value={password}
                        secureTextEntry={true}                             //text visuality is hid with * character
                        placeholder="Şifre"
                        placeholderTextColor='black'
                        style={{
                            fontFamily: "LexendTera-Regular",
                            marginBottom: 5,
                            borderRadius: 2,
                            borderColor: '#d2d2d2',
                            borderWidth: 1,
                            padding: 10,
                            width: inputWidth,
                            height: 50,
                            backgroundColor: AppColors.input
                        }}
                    />

                    {/* password length check */}
                    <RegularText style={{flex:1, left:-30}} fontSize="12">   
                        * Mininum 6 karakter içermelidir.
                    </RegularText>

                    <TextInput                                            //mobile phone input box
                        autoCapitalize="none"
                        onChangeText={((text) => setPhone(text))}        //updating mobile phone number visually on the screen with state
                        value={phone}
                        placeholder="Cep Telefonu"
                        keyboardType="phone-pad"
                        placeholderTextColor='black'
                        style={{
                            fontFamily: "LexendTera-Regular",
                            marginBottom: 5,
                            borderRadius: 2,
                            borderColor: '#d2d2d2',
                            borderWidth: 1,
                            padding: 10,
                            width: inputWidth,
                            height: 50,
                            backgroundColor: AppColors.input
                        }}
                    />
                    <TextInput                                          // email input box
                        autoCapitalize="none"
                        onChangeText={((text) => setEmail(text))}       //updating email text visually on the screen with state
                        value={email}                                  
                        placeholder="Email"
                        keyboardType="email-address"
                        placeholderTextColor='black'
                        style={{
                            fontFamily: "LexendTera-Regular",
                            marginBottom: 5,
                            borderRadius: 2,
                            borderColor: '#d2d2d2',
                            borderWidth: 1,
                            padding: 10,
                            width: inputWidth,
                            height: 50,
                            backgroundColor: AppColors.input
                        }}
                    />

                    {/* register button */}
                    <Box flex={1} justifyContent="flex-end" p={20} flexDirection="row" width="100%" >   
                        <TouchableOpacity onPress={() => register()}
                            style={{
                                backgroundColor: AppColors.button,
                                width: 100,
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10
                            }}>
                            <MediumText color="white" fontSize="15">
                                Kaydol
                            </MediumText>

                        </TouchableOpacity>
                    </Box>

                    <Box flex={1} mt={10} p={10} width="100%" alignItems="center" justifyContent="center">
                        <RegularText>
                            Üye misin?
                        </RegularText>
                        {/* Touchable button for navigation to Login Screen */}
                        <TouchableOpacity onPress={() => props.navigation.navigate("LoginScreen")}
                            style={{
                                width: "30%",
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <MediumText color={AppColors.button} fontSize="15px">
                                Giriş Yap
                            </MediumText>

                        </TouchableOpacity>
                    </Box>

                </Box>


            </Box>

        </>
    );
}

export default RegisterScreen;