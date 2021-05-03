import { ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, FlatList, Image } from 'react-native';
import Box from '../components/Box';
import React from 'react';
import { RegularText } from '../components/CustomText';
import AppHeader from '../components/Header';

import { moderateScale, verticalScale, scale } from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import SegmentedControl from '@react-native-community/segmented-control';
import { useState } from 'react';
import { useEffect } from 'react';
import { getJsonFromStorage, removeValue, setJsonToStorage } from '../helpers/StorageHelper';
import { logoutUser } from '../services/auth-service';
import AppColors from '../helpers/Constants';
import { getUserFlow } from '../services/flow-service';
import FlowItem from '../components/FlowItem';
import { deletePost } from '../services/post-service';
import { launchImageLibrary } from 'react-native-image-picker';
import { updateUserPicture } from '../services/user-service';

const UserProfileScreen = (props) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [user, setUser] = useState({});

    const [userFlowData, setUserFlowData] = useState(null);
    const [showUserPostSpinner, setUserSpinnerShow] = useState(false);

    const [showUserLikesSpinner, setUserLikesSpinner] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    const [profileImage, setProfileImage] = useState(null);


    const refreshData = () => {
        setRefreshing(true);
        setUserSpinnerShow(true);
        getUserFlow().then((res) => {
            let data = res.data.data;

            console.log(data);

            setRefreshing(false);
            setUserSpinnerShow(false);
            setUserFlowData(data);

        }).catch((err) => {
            console.log(err);
            setRefreshing(false);
            setUserSpinnerShow(false);
        })
    }



    const logoutHandler = () => {
        Alert.alert(
            "Çıkış",
            "Çıkış yapmak istediğinize emin misiniz?",
            [
                {
                    text: "İptal",
                    style: 'cancel',
                },
                { text: "Onayla", onPress: () => logout() },
            ],
            { cancelable: false },
        );
    }


    const logout = async () => {

        logoutUser().then((data) => {
            removeValue('user').then(() => {
                setTimeout(() => {
                    props.navigation.navigate('AuthScreen');
                },100)
            }).catch((err) => console.log("Hata", err))

        }).catch(err => console.error(err))
    }



    useEffect(() => {
        setUserSpinnerShow(true);

        getJsonFromStorage('user').then((data) => {
            setUser(data);
            setProfileImage(data.profileImageUrl);
        });


        getUserFlowData();
        // TODO 
        // Add users liked post here

    }, []);

    renderFlowItem = ({ item }) => (
        <Box flex={1} flexDirection="row">
            <Box flex={6}>
                <FlowItem key={item} item={item} />
            </Box>
            <Box flex={0.8} justifyContent="center" alignItems="center" >
                <TouchableOpacity onPress={() => deleteItemHandler(item.id)}>
                    <FontAwesome5 name="trash" color={AppColors.primary} size={20} />
                </TouchableOpacity>
            </Box>
        </Box>
    );

    deleteItemHandler = (postId) => {
        Alert.alert(
            "Uyarı",
            "Gönderiyi silmek istediğinize emin misiniz?",
            [
                {
                    text: "İptal",
                    style: 'cancel',
                },
                { text: "Onayla", onPress: () => deleteItem(postId) },
            ],
            { cancelable: false },
        );
    }

    const deleteItem = (postId) => {
        deletePost(postId).then((res) => {
            let data = res.data.data;
            console.log(data);
            setUserSpinnerShow(true);
            getUserFlowData()

        }).catch((err) => {
            console.log(err);
        })
    }


    const getUserFlowData = () => {
        getUserFlow().then((res) => {
            let data = res.data.data;

            setUserSpinnerShow(false);
            setUserFlowData(data);

        }).catch((err) => {
            console.log(err);
            setUserSpinnerShow(false);
        })
    }




    const updateUserProfileImage = (response) => {
        const body = new FormData();
        if (response?.uri) {
            let imageFile = {
                uri: response.uri,
                name: 'profile',
                type: "image/png"
            }

            body.append('file', imageFile);
            setProfileImage(response.uri);

            getJsonFromStorage('user').then((res) => {
                setJsonToStorage('user', {
                    ...res,
                    profileImageUrl: response.uri
                })
            })

            updateUserPicture(body).then((res) => {
                console.log("Veri", res.data.data);
            }).catch((err) => {
                console.log("Hata", err);
            })

        }


    }

    return (
        <Box flex={1}>
            <AppHeader />
            <Box flex={10}>
                <Box p={20} borderWidth="0.5" borderColor="#d2d2d2" >

                    <Box flexDirection="row" alignItems="center" >
                        <TouchableOpacity onPress={() => launchImageLibrary(
                            {
                                mediaType: 'photo',
                                includeBase64: false,
                                maxHeight: 200,
                                maxWidth: 200,
                            },
                            (response) => {
                                updateUserProfileImage(response)
                            },
                        )}
                            style={{ width: moderateScale(50), height: verticalScale(40) }}>
                            <Image
                                resizeMode="contain"
                                style={{
                                    alignSelf: "flex-start",
                                    width: "100%",
                                    height: "100%"
                                }}
                                source={profileImage ? { uri: profileImage } : require('../../assets/profilePlaceholder.png')} />
                        </TouchableOpacity>

                        <RegularText style={{ marginLeft: 10 }} >
                            {user?.firstName + " " + user?.lastName}
                        </RegularText>

                        <Box flex={1} alignItems='flex-end'>
                            <TouchableOpacity onPress={logoutHandler}>
                                <Feather name={"log-out"} size={30} color={'fe8791'} />
                            </TouchableOpacity>
                        </Box>
                    </Box>

                    <RegularText color="gray" style={{ left: 60, }}>
                        {user?.username}
                    </RegularText>


                    <Box mt="3" flexDirection="row" justifyContent="space-around">
                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => props.navigation.navigate('UserFollowedScreen')}>
                            <SimpleLineIcons name="user-following" color="black" size={20} />
                            <RegularText fontSize="12">
                                Takip Edilen
                        </RegularText>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => props.navigation.navigate('UserFollowersScreen')}>
                            <SimpleLineIcons name="user-follow" color="black" size={20} />
                            <RegularText fontSize="14">

                                Takipçiler
                        </RegularText>
                        </TouchableOpacity>
                    </Box>


                    <SegmentedControl
                        activeFontStyle={styles.activeSegmentFontStyle}
                        style={styles.segmentStyle}
                        fontStyle={styles.segmentFontStyle}
                        values={[
                            "Gönderiler",
                            "Beğeniler",
                        ]}
                        selectedIndex={selectedIndex}
                        onChange={(event) => {
                            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
                        }}
                    />
                </Box>

                {
                    selectedIndex == 0 ?
                        showUserPostSpinner ?
                            <Box flex={1} justifyContent="center" alignItems="center">
                                <ActivityIndicator color="blue" />
                            </Box>

                            :

                            (userFlowData?.posts) ?
                                <FlatList
                                    refreshing={refreshing}
                                    onRefresh={refreshData}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingBottom: 100 }}
                                    data={userFlowData.posts}
                                    renderItem={renderFlowItem}
                                    keyExtractor={item => item.id}
                                />
                                :
                                <Box alignItems="center" flex={1} justifyContent="center">
                                    <RegularText>
                                        Veri Bulunamadı!
                                </RegularText>
                                </Box>

                        :

                        <ScrollView>
                            <RegularText>
                                Beğeni 1
                        </RegularText>
                        </ScrollView>
                }



            </Box>

        </Box>
    )
}
const styles = StyleSheet.create({
    centerText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'LexendTera-Regular',
        color: '#fff',
    },
    activeSegmentFontStyle: {
        color: AppColors.primary,
        fontSize: moderateScale(15),
        fontFamily: 'LexendTera-Regular',
    },
    segmentStyle: {
        height: verticalScale(40),
        marginHorizontal: scale(20),
        marginTop: scale(10),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    segmentFontStyle: {
        fontSize: moderateScale(13),
        fontFamily: 'LexendTera-Regular',
        color: '#4c4c4c',
    },
});

export default UserProfileScreen;