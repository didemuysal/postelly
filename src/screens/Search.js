import Box from '../components/Box';
import React from 'react';
import { RegularText } from '../components/CustomText';
import AppHeader from '../components/Header';
import SegmentedControl from '@react-native-community/segmented-control';
import { View, TextInput, ScrollView, StyleSheet, Button, Alert, FlatList, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useState } from 'react';
import { followUser, getUserFollowed, searchUser, unFollowUser } from '../services/user-service';
import { ActivityIndicator } from 'react-native-paper';
import { useEffect } from 'react';
import { getJsonFromStorage, getUserConfig } from '../helpers/StorageHelper';

const SearchScreen = (props) => {
    const [searchValue, setSearchValue] = useState('');

    const [userData, setUserData] = useState(null);
    const [postData, setPostData] = useState(null);

    const [showUserSpinner, setShowUserSpinner] = useState(false);
    const [showPostSpinner, setShowPostSpinner] = useState(false);

    const [selfUser, setSelfUser] = useState(null);

    const [searchPressed, setSearchPressed] = useState(false);

    const [userFollowed, setUserFollowed] = useState([]);


    useEffect(() => {

        getUserConfig().then((data) => {
            setSelfUser(data.auth.username); //get the user herself-himself
        });

        getUserFollowedData();

    }, []);

    const getUserFollowedData = () => {
        getJsonFromStorage('user').then((data) => { //get the user informations from storage with service call
            getUserFollowed(data.id).then((res) => {
                let data = res.data.data; //getting the data from API
                setUserFollowed(data);  //change the state of the setUserFollowed state
            }).catch(err => console.log("Hata", err))
        });
    }



  //even if the button pressed, this function checks for there is a vlue or not, if there is no value it alerts the user
    getSearchData = () => {
        if (searchValue !== "") {  //if the search value is not empty
            setSearchPressed(true); //set the touchable opacity true

            setShowUserSpinner(true);  //display the spinner
            searchUser(searchValue).then((response) => {
                let data = new Array(response.data.data);  //assigning API responce to data variable
                let filteredData = data.filter((user) => user.username !== selfUser);  //filter the array from the users himself-herself
                if (filteredData.length > 0) { //is filtered array length is bigger than 0
                    setUserData(filteredData); //set the user data state
                } else {
                    setUserData(null); //list is empty- set user data null, nothing to list
                }
                setShowUserSpinner(false); //search is done, no need for spinner

            }).catch((err) => {
                setUserData(null);  //there is a problem so display nothing
                console.log(err);
                setShowUserSpinner(false);
            });

        } else {
            Alert.alert("Uyarı", "Lütfen önce bir arama terimi giriniz.");  //searchbar is empty, alert the user
        }
    }


    const onFollowUser = (userId) => { 

        followUser(userId).then((res) => { //after prssing the button folloow the user - create the relationship with user-service.js to axios
            let data = res.data.data;
            console.log("Veri", data);

            getUserFollowedData();  //get the followed data again
            getSearchData();  //get the search list again

        }).catch((err) => {
            console.log("Hata", err);
        });
    }


    const onUnFollowUser = (userId) => {

        unFollowUser(userId).then((res) => { //after prssing the button unfolloow the user - delete the relationship with user-service.js to axios
            let data = res.data.data;
            console.log("Veri", data);

            getUserFollowedData();  //get the followed data again
            getSearchData();  //get the search list again

        }).catch((err) => {
            console.log("Hata", err);
        });
    }

    const renderUserItem = ({ item }) => (


        // list the user informations such as username, firstname and lastname
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <RegularText style={{ flexWrap: 'wrap' }} fontSize={12}>
                {item.username} - {item.firstName} {item.lastName}
            </RegularText>
            {
                userFollowed.find((user) => user.id == item.id) ?
                    <TouchableOpacity onPress={() => onUnFollowUser(item.id)}>  
                    {/* With touchable opacity, unfollow the user */}
                        <RegularText color="blue" fontSize={12}>
                            Takibi Bırak
                </RegularText>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => onFollowUser(item.id)}>
                         {/* With touchable opacity, follow the user */}
                        <RegularText color="blue" fontSize={12}>
                            Takip Et
                </RegularText>
                    </TouchableOpacity>

            }

        </Box>
    );


    return (

        <Box flex={1}>
            <AppHeader />
            <Box flex={9}>
                <Box mt={10} p={12} flexDirection="row" width="100%" justifyContent="space-between">
                    {/* search container */}
                    <Box flex={1} p={2} bg="#e3e3e3" style={styles.searchContainer}>  
                        <MaterialIcons
                            name='search'
                            color='grey'
                            size={scale(30)}
                        />
                        <TextInput
                        
                            placeholder="Kullanıcı ara"
                            caretHidden={false}
                            style={[styles.inputStyle]}
                            placeholderTextColor="gray"
                            onChangeText={(text) => {
                                setSearchValue(text.toLowerCase())
                            }}
                            value={searchValue}
                        />
                    </Box>

                    {/* search touchable opacity*/}
                    <TouchableOpacity style={{ borderRadius: 10, justifyContent: 'center', backgroundColor: '#fff', padding: 2, marginLeft: 10 }} onPress={getSearchData}>
                        <RegularText>
                            Ara
                        </RegularText>
                    </TouchableOpacity>

                </Box>

                {
                    postData &&  //posts
                    <Box flex={1} bg="#d5d5d5" marginHorizontal={20} mt={10}>
                        <RegularText>
                            Gönderiler
                    </RegularText>
                        {
                            showPostSpinner ?
                                <ActivityIndicator color="blue" />
                                : null
                        }

                    </Box>
                }

                {
                    userData && //future wowk
                    <Box flex={1} bg="#d3d3d3" marginHorizontal={20} mt={20}>
                        <RegularText>
                            Kişiler
                    </RegularText>

                        {
                            showUserSpinner ?
                                <ActivityIndicator color="blue" />
                                :
                                userData.length > 0 &&
                                <Box flex={1}>
                                    <FlatList
                                        data={userData}
                                        renderItem={renderUserItem}
                                        keyExtractor={item => item.id}
                                    />
                                </Box>

                        }

                    </Box>
                }

                {
                    (!Array.isArray(postData) && !Array.isArray(userData)) && searchPressed &&  //input is empty, array is empty and button is not  pressed
                    <Box flex={1} alignItems="center" p={2}>
                        <RegularText>
                            Veri Bulunamadı!
                        </RegularText>
                    </Box>
                }

            </Box>
        </Box>

    )
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,

    },
    inputStyle: {
        flex: 1,
        fontFamily: 'LexendTera-Regular',
        marginLeft: 2,
        color: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: scale(10)
    },
    sortByContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 10,
    },
    sortByText: {
        textAlign: 'center',
        flexWrap: "wrap",
        fontSize: scale(14, 0.1)
    }
})
export default SearchScreen;