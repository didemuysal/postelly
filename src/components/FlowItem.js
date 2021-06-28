import Box from "./Box";
import { RegularText } from "./CustomText";
import Feather from 'react-native-vector-icons/Feather';  //icon library
import AntDesign from 'react-native-vector-icons/AntDesign';  //icon library
import Sound from 'react-native-sound'

import React, { useRef, useEffect, useState } from 'react';

import { Image, TouchableOpacity } from 'react-native'; //icon button
import AudioRecorderPlayer from "react-native-audio-recorder-player"; //3rd part library for audio recording and playing
import AppColors, { MACHINE_IP } from "../helpers/Constants";
import { ProgressBar } from "react-native-paper";
import { getUsersLikedPost, likePost, unLikePost } from "../services/post-service";
import { getJsonFromStorage } from "../helpers/StorageHelper";

const audioRecorderPlayer = new AudioRecorderPlayer();


const FlowItem = (props) => {    //contains content elements

    //getting user, post informations 
    const { full_name, username, } = props.item.user;

    const { text, likeCount, id, createdDate } = props.item;


    const img = props.item.user.img?.replace("localhost", MACHINE_IP);  // changing Android Emulator IP to machine IP
    const imageUrl = props.item.imageUrl?.replace("localhost", MACHINE_IP); // changing Android Emulator IP to machine IP
    const soundUrl = props.item.soundUrl?.replace("localhost", MACHINE_IP); // changing Android Emulator IP to machine IP

    //states
    const [isSoundPlaying, setSoundPlaying] = useState(false); // is sound playing?
    const [playedTime, setPlayedTime] = useState(null); //seconds of playing sound

    const [postLikeCount, setPostLikeCount] = useState(likeCount);  // number of post likes
    const [isPostLiked, setPostLiked] = useState(false);  //like status of post 

    useEffect(() => {
        checkUserLikes();
    }, []);


    const checkUserLikes = async () => {  //like logic
        getUsersLikedPost(id).then(async (res) => {  //get user id which liked a post

            let data = res.data;

            if (data) {
                let user = await getJsonFromStorage('user');  //get users like JSON from storage
                let userLikedThePost = data.find(d => d.username == user.username); //check whether used liked it or not

                if (userLikedThePost) {
                    setPostLiked(true);  //user liked the post
                }
            }

        }).catch((err) => {
            console.log("Hata", err);  
        });
    }


    const playSound = (path) => {    //library requires sound path (soundUri) comes from backend
        audioRecorderPlayer.setVolume(1.0);  //3rd part library

        audioRecorderPlayer.startPlayer(path).then((data) => {
            console.log("Playing Sound", data);  //sound Playing
        }).catch((err) => {
            console.warn("Oynatma Hatası", err); //sound is not playing
        });


        audioRecorderPlayer.addPlayBackListener((e) => {

            let duration = e.duration; //how long the auidio
            let currentPosition = e.current_position; //exact second of the audio

            let playedSoundTime = Math.floor((100 * Math.floor(currentPosition)) / Math.floor(duration));  //calculationg for progressbar  
            setPlayedTime(playedSoundTime);
            setSoundPlaying(true);

            console.log(currentPosition, duration);
            if (currentPosition == duration) {
                console.log("Bitti");   // audio playing finished
                stopSound(); 
            }

            return;
        });
    }


    stopSound = async () => {      
        try {

            setSoundPlaying(false);
            setPlayedTime(0);    //progress bar comes its initial 

            audioRecorderPlayer.stopPlayer().then((data) => {
                console.log("Durduruldu", data);
            }).catch((error) => {
                console.log("Durdurma hatası 1", error);
            })
            audioRecorderPlayer.removePlayBackListener(); // listener becomes deletes 
        } catch (error) {
            console.warn("Durdurma hatası 2", error);  
        }

    }



    const onHeartClick = () => {   

        console.log(id);

        // If post is liked before 
        if (isPostLiked) { 
            unLikePost(id).then((res) => { // get data from API
                console.log("Unlike", res.data.data);  
                setPostLiked(false);
                setPostLikeCount(postLikeCount - 1);  //postCount decreases 1 

            }).catch(err => {
                console.log("Hata", err);
            })

        } else { // Like Post

            likePost(id).then((res) => {
                console.log("Like", res.data.data);

                setPostLiked(true);
                setPostLikeCount(likeCount + 1);
            }).catch(err => {
                console.log("Hata", err);
            })


        }

    }
    //user interface 
    return (
        <Box flexDirection="row" >
            <Box  
                flex={5}
                maxHeight={500}
                borderColor="#d7d7d7"
                borderWidth={1}
                borderRightWidth={0}
                width="100%"
                p={2}>


                <Box flexWrap="wrap" flexDirection="row" alignItems="center" m={2}>  
                    { //User Profile Picture
                        img ?    // if there is a profile picture
                            <Image      
                                style={{ width:60, height: 50,  borderRadius:50}}
                                source={{ uri: img }}

                            />
                            :
                            <Feather name="user" size={22} color={'black'} />  //no profile picture-display user icon
                    }
                        {/* user title name */}
                    <RegularText style={{ fontSize: 12, marginHorizontal: 10 }}> 
                        {full_name}   
                    </RegularText>

                    <RegularText fontSize="12" color="gray">    {/* username */}
                        {username}
                    </RegularText>


                </Box>

                {
                    text &&  //is the user creates a text content
                    <Box flexWrap="wrap" marginHorizontal={40} >
                        <RegularText style={{ color: "#35364F", fontSize: 13, textAlign: "justify", flexWrap: "wrap", maxWidth: "100%" }}>
                            {text}
                        </RegularText>
                    </Box>
                }


                {
                    imageUrl &&  //if the user uploads an imgae
                    <Box marginVertical={10} marginHorizontal={40} height={200} justifyContent="center" alignItems="center">
                        <Image
                            resizeMode="contain"
                            style={{
                                flex: 1,
                                alignSelf: 'stretch',
                                width: undefined,
                                height: undefined
                            }}
                            source={{ uri: imageUrl }}
                        />
                    </Box>
                }



                <Box >
                    {
                        soundUrl &&   // if the user records an audio
                        <Box bottom={-10} mt="2" justifyContent="center" alignItems="center" >
                            <Box p="2" width="70%" borderColor="#D4D4D4" borderWidth="1" borderBottomWidth="0" borderRadius="5" flexDirection="row">

                                {
                                    isSoundPlaying ?   //playing the recorded audio
                                        <TouchableOpacity onPress={() => stopSound()}>
                                            <Feather name="pause" size={30} color={AppColors.primary} />
                                        </TouchableOpacity>
                                        :
                                        // when play button pressed switch to pause button
                                        <TouchableOpacity onPress={() => playSound(soundUrl)}> 
                                            <Feather name="play" size={30} color={AppColors.primary} /> 
                                        </TouchableOpacity>
                                }


 
                                   {/* progressbar styling */}
                                <Box flex={1} justifyContent="center" alignItems="center"> 
                                    <Box width="100%">
                                        <ProgressBar style={{ width: "90%" }} visible={true} progress={playedTime / 100} color={"orange"} />
                                    </Box>
                                </Box>
                            </Box>

                        </Box>
                    }

                </Box>



            </Box>
                         {/* empty or full hearth icon */}
            <Box flex={1} borderColor="#d7d7d7" borderLeftWidth={0} borderWidth={1} justifyContent="space-around" alignItems="center"   > 
                <Box flex={1} justifyContent="center" alignItems="center">  
                    <TouchableOpacity onPress={() => onHeartClick()}> 
                        <AntDesign name={isPostLiked ? "heart" : "hearto"} size={22} color={AppColors.primary} />  
                    </TouchableOpacity>
                    <RegularText  >
                        {     postLikeCount}      
                    </RegularText>
                </Box>
          
            </Box>




        </Box>
    )


}

export default FlowItem;