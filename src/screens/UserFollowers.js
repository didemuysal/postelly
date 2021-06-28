import React, { useEffect } from 'react';
import { useState } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';
import Box from '../components/Box';
import { RegularText } from '../components/CustomText';
import { getJsonFromStorage } from '../helpers/StorageHelper';
import { getUserFollowers } from '../services/user-service';


const UserFollowersScreen = (props) => {

    const [userFollowers, setUserFollowers] = useState([]);  //user followers state

    const [showSpinner, setShowSpinner] = useState(false);  //spinner state 

    useEffect(() => {
        getUserFollowersData();
    }, []);


    const getUserFollowersData = () => {  //getting the user followers data
        setShowSpinner(true); //while getting the data, show spinner
        getJsonFromStorage('user').then((data) => {  //get the user JSON from storage with asyncstorage library
            setShowSpinner(false);  //dont show the spinner
            getUserFollowers(data.id).then((res) => {  
                let data = res.data.data  //assign the data from service call
                console.log(data);
                setUserFollowers(data); //set the data for display
            }).catch(err => console.log("Hata", err))
        });

    }


    const renderUserItem = ({ item }) => (
        <Box p={10} flex={1} flexDirection="row" alignItems="center" justifyContent="space-around">
            <Image
                resizeMode="contain"
                style={{
                    alignSelf: "flex-start",
                    width: '20%',
                    height: '130%'
                }}
                source={item.imageUrl ? { uri: item.imageUrl } : require('../../assets/profilePlaceholder.png')} //if there is a user profile picture displa it, otherwise default icon
            />

            <Box flexWrap="wrap" flex={1}>
                <RegularText fontSize="14">
                    {/* user name and last name */}
                    {item.firstName} {item.lastName}
                </RegularText>

                <RegularText fontSize="10" color="gray">
                    {/* user title name */}
                    {item.username}
                </RegularText>
            </Box>

        </Box>
    )


    return (
        showSpinner ?

            <ActivityIndicator color="blue" />  //while followed user loading 

            :

            <FlatList   //displaying of following users
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                data={userFollowers}
                renderItem={renderUserItem}
                keyExtractor={item => item.id}
            />
    )
}

export default UserFollowersScreen;