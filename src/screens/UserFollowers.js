import React, { useEffect } from 'react';
import { useState } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';
import Box from '../components/Box';
import { RegularText } from '../components/CustomText';
import { getJsonFromStorage } from '../helpers/StorageHelper';
import { getUserFollowers } from '../services/user-service';


const UserFollowersScreen = (props) => {

    const [userFollowers, setUserFollowers] = useState([]);

    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        getUserFollowersData();
    }, []);


    const getUserFollowersData = () => {
        setShowSpinner(true);
        getJsonFromStorage('user').then((data) => {
            setShowSpinner(false);
            getUserFollowers(data.id).then((res) => {
                let data = res.data.data
                console.log(data);
                setUserFollowers(data);
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
                source={item.imageUrl ? { uri: item.imageUrl } : require('../../assets/profilePlaceholder.png')}
            />

            <Box flexWrap="wrap" flex={1}>
                <RegularText fontSize="14">
                    {item.firstName} {item.lastName}
                </RegularText>

                <RegularText fontSize="10" color="gray">
                    {item.username}
                </RegularText>
            </Box>

        </Box>
    )


    return (
        showSpinner ?

            <ActivityIndicator color="blue" />

            :

            <FlatList
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