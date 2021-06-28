import React, { useEffect } from 'react';
import { useState } from 'react';
import { FlatList, TouchableOpacity, Image, Platform, ActivityIndicator, Alert } from 'react-native';
import { verticalScale } from 'react-native-size-matters';
import Box from '../components/Box';
import { RegularText } from '../components/CustomText';
import { getJsonFromStorage } from '../helpers/StorageHelper';
import { getUserFollowed, getUserFollowers, unFollowUser } from '../services/user-service';


const UserFollowedScreen = (props) => {

    const [userFollowed, setUserFollowed] = useState([]);  //user followed state

    const [showSpinner, setShowSpinner] = useState(false);  //spinner display state

    const getUserFollowedData = () => { 
        getJsonFromStorage('user').then((data) => {  //get the user informations from storage with service call
            getUserFollowed(data.id).then((res) => {
                let data = res.data.data; //getting the data from API

                
                setUserFollowed(data);  //change the state of the setUserFollowed state
                setShowSpinner(false);  //dont display spinner

            }).catch(err => console.log("Hata", err))
        });
    }

    useEffect(() => {

        setShowSpinner(true);
        getUserFollowedData();

    }, []);



    const onUnfollowUser = (user) => {

        Alert.alert(  //displaying the alert 
            "Uyarı",
            ` Kullanıcıyı Takipten Çıkmak İstediğinizden Emin Misiniz? 
             ${user.username}` ,  //username of the soon-about-to-be unfollowed user
            [
                {
                    text: "İptal",
                    style: 'cancel',
                },
                {
                    text: "Onayla", onPress: () => {
                        unFollowUser(user.id).then((res) => {// after prssing the button unfolloow the user - delete the relationship from user-service.js
                            console.log("Sonuç", res);
                            getUserFollowedData(); //get the data again

                        }).catch((err) => {
                            console.log("Hata", err);
                        })
                    }
                },
            ],
            { cancelable: false },  //when clicking somewhere in the screen, dialog does not close
        );



    }



    const renderUserItem = ({ item }) => (
        <Box p={10} flex={1} flexDirection="row" alignItems="center" justifyContent="space-around">
            <Image  //user profile picture
                resizeMode="contain"
                style={{
                    alignSelf: "flex-start",
                    width: '20%',
                    height: '130%'
                }}
                source={item.imageUrl ? { uri: item.imageUrl } : require('../../assets/profilePlaceholder.png')} //if there is no user profile picture then  default user icon
            />

            <Box flexWrap="wrap" flex={1}>
                <RegularText fontSize="14">
                    {/* user name and last name */}
                    {item.firstName} {item.lastName}  
                </RegularText>

                <RegularText fontSize="10" color="gray">
                    {/* user titlen anme */}
                    {item.username}
                </RegularText>
            </Box>

                {/* unfollow icon */}
            <TouchableOpacity onPress={() => onUnfollowUser(item)}>   
                <RegularText style={{ right: -5 }} color="blue" fontSize="12">
                    Takibi Bırak
                </RegularText>
            </TouchableOpacity>
        </Box>
    )


    return (
        showSpinner ?

        
            <ActivityIndicator color="blue" />  //while followed user loading 

            :

            <FlatList    //displaying of followed user
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                data={userFollowed}
                renderItem={renderUserItem}
                keyExtractor={item => item.id}
            />
    )
}

export default UserFollowedScreen;