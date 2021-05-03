import Box from "./Box";
import { RegularText } from "./CustomText";
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Sound from 'react-native-sound'

import React, { useRef, useEffect, useState } from 'react';

import { Image, TouchableOpacity } from 'react-native';
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import AppColors, { MACHINE_IP } from "../helpers/Constants";
import { ProgressBar } from "react-native-paper";
import { getUsersLikedPost, likePost, unLikePost } from "../services/post-service";
import { getJsonFromStorage } from "../helpers/StorageHelper";

const audioRecorderPlayer = new AudioRecorderPlayer();


const FlowItem = (props) => {

    const { full_name, username, } = props.item.user;

    const { text, likeCount, id, createdDate } = props.item;


    const img = props.item.user.img?.replace("localhost", MACHINE_IP);
    const imageUrl = props.item.imageUrl?.replace("localhost", MACHINE_IP);
    const soundUrl = props.item.soundUrl?.replace("localhost", MACHINE_IP);


    const [isSoundPlaying, setSoundPlaying] = useState(false);
    const [playedTime, setPlayedTime] = useState(null);

    const [postLikeCount, setPostLikeCount] = useState(likeCount);
    const [isPostLiked, setPostLiked] = useState(false);

    useEffect(() => {
        checkUserLikes();
    }, []);


    const checkUserLikes = async () => {
        getUsersLikedPost(id).then(async (res) => {

            let data = res.data;

            if (data) {
                let user = await getJsonFromStorage('user');
                let userLikedThePost = data.find(d => d.username == user.username);

                if (userLikedThePost) {
                    setPostLiked(true);
                }
            }

        }).catch((err) => {
            console.log("Hata", err);
        });
    }


    /*
    IF a post date requested, below code part can be used

    let mockDate = new Date(createdDate);
    let otherMockDate = new Date(mockDate.getTime());
    let finalDateTime = ("00" + (otherMockDate.getMonth() + 1)).slice(-2) + "/" +
        ("00" + otherMockDate.getDate()).slice(-2) + "/" +
        otherMockDate.getFullYear() + " " +
        ("00" + otherMockDate.getHours()).slice(-2) + ":" +
        ("00" + otherMockDate.getMinutes()).slice(-2) + ":" +
        ("00" + otherMockDate.getSeconds()).slice(-2);

        */


    const playSound = (path) => {
        audioRecorderPlayer.setVolume(1.0);

        audioRecorderPlayer.startPlayer(path).then((data) => {
            console.log("Playing Sound", data);
        }).catch((err) => {
            console.warn("Oynatma Hatası", err);
        });


        audioRecorderPlayer.addPlayBackListener((e) => {

            let duration = e.duration;
            let currentPosition = e.current_position;

            let playedSoundTime = Math.floor((100 * Math.floor(currentPosition)) / Math.floor(duration));
            setPlayedTime(playedSoundTime);
            setSoundPlaying(true);

            console.log(currentPosition, duration);
            if (currentPosition == duration) {
                console.log("Bitti");
                stopSound();
            }

            return;
        });
    }


    stopSound = async () => {
        try {

            setSoundPlaying(false);
            setPlayedTime(0);

            audioRecorderPlayer.stopPlayer().then((data) => {
                console.log("Durduruldu", data);
            }).catch((error) => {
                console.log("Durdurma hatası 1", error);
            })
            audioRecorderPlayer.removePlayBackListener();
        } catch (error) {
            console.warn("Durdurma hatası 2", error);
        }

    }

    playTrack = (path) => {
        const track = new Sound("http://192.168.1.5:8080/sound/22", '', (e) => {
            if (e) {
                console.log('error loading track:', e)
            } else {
                track.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }
        })
    }


    const onHeartClick = () => {

        console.log(id);

        // If post is liked before
        if (isPostLiked) {
            unLikePost(id).then((res) => {
                console.log("Unlike", res.data.data);
                setPostLiked(false);
                setPostLikeCount(postLikeCount - 1);

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
                        img ?
                            <Image
                                style={{ width:60, height: 50,  borderRadius:50}}
                                source={{ uri: img }}

                            />
                            :
                            <Feather name="user" size={22} color={'black'} />
                    }

                    <RegularText style={{ fontSize: 12, marginHorizontal: 10 }}>
                        {full_name}
                    </RegularText>

                    <RegularText fontSize="12" color="gray">
                        {username}
                    </RegularText>


                </Box>

                {
                    text &&
                    <Box flexWrap="wrap" marginHorizontal={40} >
                        <RegularText style={{ color: "#35364F", fontSize: 13, textAlign: "justify", flexWrap: "wrap", maxWidth: "100%" }}>
                            {text}
                        </RegularText>
                    </Box>
                }


                {
                    imageUrl &&
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
                        soundUrl &&
                        <Box bottom={-10} mt="2" justifyContent="center" alignItems="center" >
                            <Box p="2" width="70%" borderColor="#D4D4D4" borderWidth="1" borderBottomWidth="0" borderRadius="5" flexDirection="row">

                                {
                                    isSoundPlaying ?
                                        <TouchableOpacity onPress={() => stopSound()}>
                                            <Feather name="pause" size={30} color={AppColors.primary} />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => playSound(soundUrl)}>
                                            <Feather name="play" size={30} color={AppColors.primary} />
                                        </TouchableOpacity>
                                }




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

            <Box flex={1} borderColor="#d7d7d7" borderLeftWidth={0} borderWidth={1} justifyContent="space-around" alignItems="center"   >
                <Box flex={1} justifyContent="center" alignItems="center">
                    <TouchableOpacity onPress={() => onHeartClick()}>
                        <AntDesign name={isPostLiked ? "heart" : "hearto"} size={22} color={AppColors.primary} />
                    </TouchableOpacity>
                    <RegularText  >
                        {postLikeCount}
                    </RegularText>
                </Box>
                {/* <RegularText style={{textAlign:"center"}} fontSize={8.3}>
                    {finalDateTime}
                </RegularText> */}
            </Box>




        </Box>
    )


}

export default FlowItem;