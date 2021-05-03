/**
 * Helper functions for set to storage or get/remove from storage.
 */

 /* user = {
    "aboutText": "Kendi Halinde Bir adam",
    "city": "Antalya",
    "country": "Türkiye",
    "email": "anil.korkmaz@mail.com",
    "enabled": true,
    "firstName": "Anıl",
    "gender": "Male",
    "id": 1,
    "lastName": "Korkmaz",
    "profileImageId": null,
    "profileImageUrl": null,
    "registeredDate": "2021-02-15T14:40:14.516",
    "username": "anil"
} */



 import AsyncStorage from "@react-native-async-storage/async-storage";

 // Get object value
 const getJsonFromStorage = async (key) => {
     try {
         const jsonValue = await AsyncStorage.getItem(key)
         return jsonValue != null ? JSON.parse(jsonValue) : null;
     } catch (e) {
         // error reading value
     }
 }

 const getUserConfig = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('user')
        let value =  JSON.parse(jsonValue);
        return {
            auth: {
                username: value.username,
                password: value.password
            }
        }
    } catch (e) {
        // error reading value
    }
 }
 
 
 // Set object value
 const setJsonToStorage = async (key,value) => {
     try {
         const jsonValue = JSON.stringify(value)
         await AsyncStorage.setItem(key, jsonValue)                        
     } catch (e) {
         // saving error
     }
 }
 
 const setDataToStorage = async (key,value) => {
     try {
         await AsyncStorage.setItem(key, value)        
     } catch (e) {
         // saving error
     }
 }
 
 const getDataFromStorage = async (key) => {
     try {
         const value = await AsyncStorage.getItem(key)
         return value;        
     } catch (e) {
         // error reading value
     }
 
     return "canberk";
 }
 
 
 const removeValue = async (key) => {
     try {
         const removeAction = await AsyncStorage.removeItem(key)
         return removeAction;
     } catch (e) {
         // remove error
     }
 }
 
 export {
     getJsonFromStorage,
     setJsonToStorage,
     getDataFromStorage,
     setDataToStorage,
     removeValue,
     getUserConfig
 }
 
 