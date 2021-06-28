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


    const refreshData = () => {  //user flow comes from API
        setRefreshing(true); //while refreshing
        setUserSpinnerShow(true); //spinners spins
        getUserFlow().then((res) => {
            let data = res.data.data;  //data comes and assigns

            console.log(data);

            setRefreshing(false); //refreshing cancelled
            setUserSpinnerShow(false); //spinner disappers
            setUserFlowData(data); //usre flow loads

        }).catch((err) => {
            console.log(err);
            setRefreshing(false);
            setUserSpinnerShow(false);
        })
    }



    const logoutHandler = () => {  //user wants to logout 
        Alert.alert(
            "Çıkış",
            "Çıkış yapmak istediğinize emin misiniz?",
            [
                {
                    text: "İptal",
                    style: 'cancel',
                },
                { text: "Onayla", onPress: () => logout() },  //an alert pop and when pressed, user logout func called
            ], 
            { cancelable: false }, //when clicking the screen it does not allow to close the pop-up
        );
    }


    const logout = async () => {  

        logoutUser().then((data) => {  //
            removeValue('user').then(() => { //deletes the user object
                setTimeout(() => {  //after 100 milisecond, application navigates to Auth Screen
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
        // TODO - Future work
        // Add users liked post here

    }, []);

    renderFlowItem = ({ item }) => (   //it dşsplays the trash icon in the screen, in order to delete the post
        <Box flex={1} flexDirection="row">
            <Box flex={6}>
                <FlowItem key={item} item={item} />
            </Box>
            <Box flex={0.8} justifyContent="center" alignItems="center" >
                <TouchableOpacity onPress={() => deleteItemHandler(item.id)}>  
                    <FontAwesome5 name="trash" color={AppColors.primary} size={20} />
                    {/* after pressing the button  it deletes the post with item.id which is post.id */}
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
                { text: "Onayla", onPress: () => deleteItem(postId) },  //an alert pops, if the button is pressed it calls the func to delete the post
            ],
            { cancelable: false },   //when clicking the screen it does not allow to close the pop-up
        );
    }

    const deleteItem = (postId) => { //gets the id from deleteItemHandler
        deletePost(postId).then((res) => {  //deletes the post
            let data = res.data.data;
            console.log(data);
            setUserSpinnerShow(true);  //spins the spinnwe
            getUserFlowData() //gets the updated flow data

        }).catch((err) => {
            console.log(err);
        })
    }


    const getUserFlowData = () => {  //gets the user profile flow from API
        getUserFlow().then((res) => {
            let data = res.data.data;

            setUserSpinnerShow(false); //dpinner does not displays
            setUserFlowData(data); 

        }).catch((err) => {
            console.log(err);
            setUserSpinnerShow(false);
        })
    }




    const updateUserProfileImage = (response) => {  //updating the profile picture
        const body = new FormData();//let the HTTP know with different type of data will be send
        if (response?.uri) { 
            let imageFile = {
                uri: response.uri, //new profile picture uri
                name: 'profile', //name 
                type: "image/png"  //type of the file 
            }

            body.append('file', imageFile);  //new file append to the body
            setProfileImage(response.uri);

            getJsonFromStorage('user').then((res) => { //json comes from storage with asyncstorage library 
                setJsonToStorage('user', {
                    ...res,
                    profileImageUrl: response.uri //added the new profile image to the JSON object
                })
            })

            updateUserPicture(body).then((res) => { //after changing the body API calls with user-service.js with axios
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
                        <TouchableOpacity onPress={() => launchImageLibrary(  //open the devices file directly
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
                                  {/* if there is no profile picture, put the user icon as default */}
                        </TouchableOpacity>

                        <RegularText style={{ marginLeft: 10 }} >
                            {user?.firstName + " " + user?.lastName}   
                             {/* users first name and last name */}
                        </RegularText>

                        <Box flex={1} alignItems='flex-end'>
                            <TouchableOpacity onPress={logoutHandler}>
                                <Feather name={"log-out"} size={30} color={'fe8791'} />
                                {/* logout icon */}
                            </TouchableOpacity>
                        </Box>
                    </Box>

                    <RegularText color="gray" style={{ left: 60, }}>
                        {user?.username} 
                         {/* users usertitle name */}
                    </RegularText>

                             {/* navigatition to followed screen from the profile screen */}
                    <Box mt="3" flexDirection="row" justifyContent="space-around"> 
                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => props.navigation.navigate('UserFollowedScreen')}>
                            <SimpleLineIcons name="user-following" color="black" size={20} />
                            <RegularText fontSize="12">
                                Takip Edilen
                        </RegularText>
                        </TouchableOpacity>

                              {/* navigatition to users followers screen from the profile screen */}
                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => props.navigation.navigate('UserFollowersScreen')}>
                            <SimpleLineIcons name="user-follow" color="black" size={20} />
                            <RegularText fontSize="14">

                                Takipçiler
                        </RegularText>
                        </TouchableOpacity>
                    </Box>


                      {/* navigatition to posts that user created section  and liked post section in the profile screen  */}
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
                        showUserPostSpinner ? //display the spinner while loading the user posts
                            <Box flex={1} justifyContent="center" alignItems="center">
                                <ActivityIndicator color="blue" />
                            </Box>

                            :

                            (userFlowData?.posts) ? //if there is user flow
                                <FlatList // dispaly them inside the flatlist
                                    refreshing={refreshing} 
                                    onRefresh={refreshData} //refreshing the user flow
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingBottom: 100 }}
                                    data={userFlowData.posts} 
                                    renderItem={renderFlowItem}
                                    keyExtractor={item => item.id}
                                />
                                :
                                // if there is no data
                                <Box alignItems="center" flex={1} justifyContent="center"> 
                                    <RegularText>
                                        Veri Bulunamadı!
                                </RegularText>
                                </Box>

                        :

                        <ScrollView>   
                              {/* TOD0 - no likes listed here*/}
                            <RegularText>
                                Beğeni sayısı : 1 
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