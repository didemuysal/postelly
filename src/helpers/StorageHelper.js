/**
 * Helper functions for set to storage or get/remove from storage.
 */

 /* user = {
    "aboutText": "just another student",
    "city": "Antalya",
    "country": "Türkiye",
    "email": "duysal@mail.com",
    "enabled": true,
    "firstName": "Didem",
    "gender": "Female",
    "id": 1,
    "lastName": "Uysal",
    "profileImageId": null,
    "profileImageUrl": null,
    "registeredDate": "2021-06-15T14:40:14.516",
    "username": "didem"
} */



 import AsyncStorage from "@react-native-async-storage/async-storage";

 //  The JSON objects requests from the storage
 const getJsonFromStorage = async (key) => {
     try {
         const jsonValue = await AsyncStorage.getItem(key)
         return jsonValue != null ? JSON.parse(jsonValue) : null;
     } catch (e) {
         // error reading value
     }
 }


 //for API security, basic auth configuration with inceptor
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
 
 
 // When the user uses the app first time the info needs to stored
 const setJsonToStorage = async (key,value) => {
     try {
         const jsonValue = JSON.stringify(value)
         await AsyncStorage.setItem(key, jsonValue)                        
     } catch (e) {
         // saving error
     }
 }
 
 //setting data to storage
 const setDataToStorage = async (key,value) => {
     try {
         await AsyncStorage.setItem(key, value)        
     } catch (e) {
         // saving error
     }
 }
 
 //data getting from storage
 const getDataFromStorage = async (key) => {
     try {
         const value = await AsyncStorage.getItem(key)
         return value;        
     } catch (e) {
         // error reading value
     }
 
     return "didem";
 }
 
 //remove a value from storage 
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
 
 