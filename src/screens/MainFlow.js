import {
    View,
    Keyboard,
    Image,
    TouchableOpacity,
    Platform,
    Dimensions,
    TextInput,
    TouchableHighlight,
    Alert,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { StyleSheet } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';

import { getMainFlow } from '../services/flow-service';
import { savePost } from '../services/post-service';
import AppColors from '../helpers/Constants';
import { RegularText } from '../components/CustomText';
import Box from '../components/Box';
import AppHeader from '../components/Header';


import AudioRecorderPlayer, {
    AudioEncoderAndroidType,
    AudioSourceAndroidType,
    AVEncoderAudioQualityIOSType,
    AVEncodingOption
} from 'react-native-audio-recorder-player';

import { ProgressBar, FAB } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import Modal from 'react-native-modal';
import FlowItem from '../components/FlowItem';
import Sound from 'react-native-sound';


const path = Platform.select({
    ios: 'hello.aac',
    android: 'sdcard/hello.aac',
});

const audioSet = {
    AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
    AudioSourceAndroid: AudioSourceAndroidType.MIC,
    AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.medium,
    AVNumberOfChannelsKeyIOS: 2,
    AVFormatIDKeyIOS: AVEncodingOption.aac,
};


const audioRecorderPlayer = new AudioRecorderPlayer();

const MainFlowScreen = (props) => {


    const [text, setText] = useState("");
    const [soundPath, setSoundPath] = useState("");

    const [showSpinner, setShowSpinner] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);


    const [isSoundPlaying, setSoundPlaying] = useState(false);
    const [isSoundRecorded, setSoundRecorded] = useState(false);
    const [isSoundRecording, setSoundRecording] = useState(false);

    const [playedTime, setPlayedTime] = useState(null);
    const [imageObject, setImageObject] = useState(null);
    const [mainFlowData, setMainFlowData] = useState(null);


    const [soundDuration, setSoundDuration] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(null);

    const [myTrack, setTrack] = useState(null);
    const [refreshing, setRefreshing] = useState(false);


    const clearPost = () => {

        setText("");
        setSoundPath("");

        setSoundPlaying(false);
        setSoundRecorded(false);
        setSoundRecording(false);

        setImageObject(null);
        setPlayedTime(null);
    }

    const clearSound = () => {
        setSoundPlaying(false);
        setSoundRecorded(false);
        setSoundRecording(false);
    }


    const OS = Platform.OS;

    const inputRef = useRef(null);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);

        if (isModalVisible) {
            clearPost();
        }
    };

    useEffect(() => {

        getMainFlowData();

        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);


    const getMainFlowData = () => {
        setShowSpinner(true);
        
        getMainFlow().then((res) => {
            setShowSpinner(false);
            let data = res.data.data;
            setMainFlowData(res.data.data);

        }).catch(err => {
            setShowSpinner(false);
            console.log("Veriler Çekilemedi", err);
        })
    }


    const refreshData = () => {
        setRefreshing(true);
        getMainFlow().then((res) => {
            setRefreshing(false);
            let data = res.data.data;
            setMainFlowData(res.data.data);
            
        }).catch(err => {
            setShowSpinner(false);
            console.log("Veriler Çekilemedi", err);
        })
    }
    




    const createPost = () => {

        const body = new FormData();

        let soundFile = {
            uri: soundPath,
            name: 'itssoundname',
            type: "audio/aac"
        }


        if (soundPath !== "") {
            body.append('sound', soundFile);
        }

        if (imageObject?.uri) {
            let imageFile = {
                uri: imageObject.uri,
                name: 'itsimagename',
                type: "image/png"
            }

            body.append('image', imageFile);
        }

        if (text) {
            body.append('text', text);
        }

        return body;

    }

    const runAfterSendProcedures = () => {
        setModalVisible(false);
        Alert.alert("Bilgi", "Gönderi başarıyla gönderildi!");
        clearPost();
        getMainFlow().then((res) => {
            let data = res.data.data;
            setMainFlowData(res.data.data);
            
        }).catch(err => console.log(err))
    }




    const sendPost = async () => {
        let body = createPost();
        if (body._parts.length == 0) {
            Alert.alert("Uyarı", "Lütfen bir yazı, ses ya da görsel paylaşınız!")
        } else {
            savePost(body)
                .then(data => {
                    runAfterSendProcedures();
                })
                .catch(err => {
                    console.log("Hata", err);
                    Alert.alert("Hata", "Gönderi paylaşılamadı!");

                })
        }


    }




    onRecordStart = async () => {

        const result = await audioRecorderPlayer.startRecorder(path, audioSet);
        console.log("START Recording", result);

        setSoundPath(result);

        setPlayedTime(0);


        audioRecorderPlayer.addRecordBackListener((e) => {
            //Here we can set the duration by every second, on the last time of record we achieve duration.

            let myCurrent = audioRecorderPlayer.mmssss(
                Math.floor(e.current_position),
            );

            return;
        });
    }


    onRecordStop = async () => {
        const result = await audioRecorderPlayer.stopRecorder();

        console.log("STOP Recording", result);
        audioRecorderPlayer.removeRecordBackListener();

        setSoundRecorded(true);
        setSoundRecording(false);


    }

    function format(time) {
        // Hours, minutes and seconds
        var hrs = ~~(time / 3600);
        var mins = ~~((time % 3600) / 60);
        var secs = ~~time % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "";
        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }
        ret += "" + String(mins).padStart(2, '0') + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }

    playSound = () => {

        let soundPath = Platform.select({
            android: "/" + path,
            ios: path
        });


        let basePath = Platform.select({
            android: '',
            ios: Sound.CACHES
        });



        let myInterval = setInterval(() => {
            tick();
        }, 250)


        setSoundPlaying(true);
        setPlayedTime(0);

        const track = new Sound(soundPath, basePath, (e) => {
            if (e) {
                console.log('error loading track:', e)
            } else {
                console.log('girdi', audioRecorderPlayer.mmssss(track.getDuration() * 1000));
                setSoundDuration(format(track.getDuration()));

                track.play((success) => {
                    if (success) {
                        setSoundPlaying(false);
                        clearInterval(myInterval);
                        setPlayedTime(1);
                        console.log("Oynatma Tamamlandı");
                    } else {
                        clearInterval(myInterval);
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }
        });

        setTrack(track);

        function tick() {

            track.getCurrentTime((seconds) => {
                if (myInterval) {
                    setCurrentPosition(format(seconds));

                    if (seconds >= track.getDuration()) {
                        clearInterval(myInterval);
                        setPlayedTime(1);
                    } else {
                        setPlayedTime(Math.floor(100 * ((seconds * 1000) / (track.getDuration() * 1000))) / 100);
                    }
                }
            });
        }

        /* 
                 try {
                    audioRecorderPlayer.startPlayer(path).then((data) => {
                        console.log("Playing Sound", data);
                    }).catch((err) => {
                        console.warn("Oynatma Hatası", err);
                    });
            
                    audioRecorderPlayer.setVolume(1.0);
            
            
                    audioRecorderPlayer.addPlayBackListener((e) => {
                        let duration = e.duration;
            
                        // Recorded duration and 
                        let currentPosition = e.current_position;
            
            
                        let durationLeft = audioRecorderPlayer.mmssss(
                            Math.floor(duration - currentPosition),
                        );
            
                        setCurrentPosition(durationLeft);
            
                        let playedSoundTime = Math.floor((100 * Math.floor(currentPosition)) / Math.floor(duration));
                        setPlayedTime(playedSoundTime);
            
                        if (e.current_position == e.duration) {
                            console.log("Oynatma Durduruldu");
                            audioRecorderPlayer.removePlayBackListener();
            
                            setSoundPlaying(false);
                            setPlayedTime(0);
                            stopSound();
            
                            setCurrentPosition(audioRecorderPlayer.mmssss(
                                Math.floor(duration),
                            ));
            
            
                        }
                        return;
                    });    
                } catch (error) {
                    console.log("Hata",error);
                }  */



    }

    stopSound = async () => {
        try {
            myTrack.stop();
            setCurrentPosition(0);
            setPlayedTime(0);
        } catch (error) {
            console.warn("Durdurma hatası 2", error);
        }

    }

    renderFlowItem = ({ item }) => (
        <FlowItem key={item} item={item} />
    );

    return (
        <Box flex={1}>

            <AppHeader />

            <Box flex={9}>


                <Box flex={8}  >
                    {
                        showSpinner ?
                            <Box flex={1} justifyContent="center" alignItems="center">
                                <ActivityIndicator color="blue" />
                            </Box>

                            :

                            (mainFlowData?.posts) ?
                                <FlatList
                                    refreshing={refreshing}
                                    onRefresh={refreshData}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingBottom: 100 }}
                                    data={mainFlowData.posts}
                                    renderItem={renderFlowItem}
                                    keyExtractor={item => item.id}
                                />
                                :
                                <Box alignItems="center" flex={1} justifyContent="center">
                                    <RegularText>
                                        Veri Bulunamadı!
                                </RegularText>
                                </Box>
                    }
                </Box>

                {
                    !isModalVisible &&
                    <FAB
                        style={styles.fab}
                        medium
                        icon="plus"
                        onPress={toggleModal}
                    />
                }


            </Box>


            



            <Modal
                onBackdropPress={() => setKeyboardVisible(false)}
                avoidKeyboard={true}
                onModalShow={() => inputRef.current.focus()}
                coverScreen={false}
                swipeDirection="down"
                key={"chartModal"}
                isVisible={isModalVisible}
                hasBackdrop={true}
                backdropOpacity={1}
                customBackdrop={
                    <View style={OS == "ios" ? {
                        height: '100%',
                        backgroundColor: AppColors.background,
                    } :
                        {
                            backgroundColor: '#fff',
                            width: Dimensions.get('screen').height,
                            height: Dimensions.get('screen').height
                        }
                    } />
                }
            >
                <Box flex={1} >

                    <Box flexDirection="row" justifyContent="space-between">

                        <TouchableOpacity onPress={() => toggleModal()}>
                            <Feather name="x" size={30} color={'black'} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={sendPost}>
                            <Feather name="send" size={30} color={AppColors.button} />
                        </TouchableOpacity>

                    </Box>

                    <Box height={isKeyboardVisible ? "55%" : "90%"}>

                        <Box flex={1} >
                            <TextInput
                                allowFontScaling={true}
                                textAlignVertical="top"
                                padding={20}
                                ref={inputRef}
                                style={{ fontFamily: "LexendTera-Regular", backgroundColor: "rgba(255, 228, 196,0.4)", height: "90%", borderRadius: 20 }}
                                multiline={true}
                                value={text}
                                onChangeText={setText}
                            />
                        </Box>

                        {
                            imageObject &&
                            <Box flex={0.25} p={3} flexDirection="row" alignItems="center" justifyContent="space-between">
                                <Image
                                    style={{ width: '30%', height: '100%', borderRadius: 10 }}
                                    source={{ uri: imageObject.uri }}
                                />
                                <TouchableOpacity onPress={() => setImageObject(null)} >
                                    <Feather name="x" size={30} color={AppColors.primary} />
                                </TouchableOpacity>
                            </Box>
                        }

                        <Box flexDirection="row">
                            {
                                isSoundRecorded ?
                                    <Box flex={1}>
                                        <Box width="100%" justifyContent="center" flexDirection="row">
                                            {
                                                !isSoundPlaying ?
                                                    <TouchableOpacity onPress={() => {
                                                        playSound();
                                                        setSoundPlaying(true);
                                                    }}>
                                                        <Feather name="play" size={30} color={AppColors.primary} />
                                                    </TouchableOpacity>
                                                    :
                                                    <TouchableOpacity onPress={() => {
                                                        stopSound();
                                                        setSoundPlaying(false);
                                                    }}>
                                                        <Feather name="pause" size={30} color={AppColors.primary} />
                                                    </TouchableOpacity>
                                            }



                                            <Box flex={1} justifyContent="center" alignItems="center">
                                                <Box width="100%">
                                                    <ProgressBar
                                                        style={{ width: "100%" }}
                                                        visible={true}
                                                        progress={playedTime}
                                                        color={"orange"} />
                                                </Box>
                                            </Box>



                                            <TouchableOpacity onPress={() => {
                                                clearSound()
                                            }}>
                                                <Feather name="x" size={30} color={AppColors.primary} />
                                            </TouchableOpacity>
                                        </Box>

                                        <Box alignItems="center" justifyContent="center">
                                            <RegularText fontSize="12">
                                                {currentPosition}
                                            </RegularText>
                                        </Box>

                                    </Box>

                                    :
                                    isSoundRecording &&

                                    <Box flex={1} alignItems="center" justifyContent="center">
                                        <Image
                                            style={{ width: 100, height: 100, borderRadius: 0 }}
                                            source={require('../../assets/recording.gif')}
                                        />
                                    </Box>
                            }
                        </Box>



                        <Box mt={10} paddingHorizontal={10} flexDirection="row" justifyContent='space-between' alignItems='center'>

                            <TouchableOpacity
                                style={styles.attachButtonStyle}
                                onPress={() => launchImageLibrary(
                                    {
                                        mediaType: 'photo',
                                        includeBase64: false,
                                        maxHeight: 200,
                                        maxWidth: 200,
                                    },
                                    (response) => {
                                        setImageObject(response);
                                    },
                                )
                                }>

                                <Feather name="camera" size={30} color={AppColors.primary} />
                            </TouchableOpacity>

                            {
                                isSoundRecording ?

                                    <TouchableHighlight
                                        activeOpacity={0.6}
                                        underlayColor="rgba(255, 228, 196, 0.2)"
                                        style={styles.attachButtonStyle}

                                        onPress={() => {
                                            onRecordStop();
                                            setSoundRecording(false);
                                        }}>

                                        <Feather name="square" size={30} color={AppColors.primary} />
                                    </TouchableHighlight>


                                    :
                                    <TouchableHighlight
                                        activeOpacity={0.6}
                                        underlayColor="rgba(255, 228, 196, 0.2)"
                                        style={styles.attachButtonStyle}
                                        onPress={() => {
                                            onRecordStart()
                                            setSoundRecorded(false);
                                            setSoundRecording(true);
                                        }}
                                    >

                                        <Feather name="mic" size={30} color={AppColors.primary} />
                                    </TouchableHighlight>
                            }



                        </Box>

                    </Box>
                </Box>



            </Modal>


        </Box >

    )
}

const styles = StyleSheet.create({
    fab: {
        backgroundColor: AppColors.button,
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    attachButtonStyle: {
        alignItems: "center",
        justifyContent: "center",
        width: 70,
        height: 60,
    }

})

export default MainFlowScreen;