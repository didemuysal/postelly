import React, { useEffect } from 'react';
import { useState } from 'react';
import { FlatList, TouchableOpacity, Image, Platform, ActivityIndicator, Alert } from 'react-native';
import { verticalScale } from 'react-native-size-matters';
import Box from '../components/Box';
import { RegularText } from '../components/CustomText';
import { getJsonFromStorage } from '../helpers/StorageHelper';
import { getUserFollowed, getUserFollowers, unFollowUser } from '../services/user-service';


const UserFollowedScreen = (props) => {

    const [userFollowed, setUserFollowed] = useState([]);

    const [showSpinner, setShowSpinner] = useState(false);

    const getUserFollowedData = () => {
        getJsonFromStorage('user').then((data) => {
            getUserFollowed(data.id).then((res) => {
                let data = res.data.data;
                setUserFollowed(data);
                setShowSpinner(false);

            }).catch(err => console.log("Hata", err))
        });
    }

    useEffect(() => {

        setShowSpinner(true);
        getUserFollowedData();

    }, []);




    const onUnfollowUser = (user) => {

        Alert.alert(
            "Uyarı",
            ` Kullanıcıyı Takipten Çıkmak İstediğinizden Emin Misiniz? 
             ${user.username}` ,
            [
                {
                    text: "İptal",
                    style: 'cancel',
                },
                {
                    text: "Onayla", onPress: () => {
                        unFollowUser(user.id).then((res) => {
                            console.log("Sonuç", res);
                            getUserFollowedData();

                        }).catch((err) => {
                            console.log("Hata", err);
                        })
                    }
                },
            ],
            { cancelable: false },
        );



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


            <TouchableOpacity onPress={() => onUnfollowUser(item)}>
                <RegularText style={{ right: -5 }} color="blue" fontSize="12">
                    Takibi Bırak
                </RegularText>
            </TouchableOpacity>
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
                data={userFollowed}
                renderItem={renderUserItem}
                keyExtractor={item => item.id}
            />
    )
}

export default UserFollowedScreen;