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


const path = Platform.select({   //platfrom comes as a RN feature
    ios: 'hello.aac',               //path for iOS
    android: 'sdcard/hello.aac',    //path for Android - cache
});

const audioSet = {
    AudioEncoderAndroid: AudioEncoderAndroidType.AAC,  //AAC formatting for both platfroms
    AudioSourceAndroid: AudioSourceAndroidType.MIC,
    AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.medium,
    AVNumberOfChannelsKeyIOS: 2,
    AVFormatIDKeyIOS: AVEncodingOption.aac,
};


const audioRecorderPlayer = new AudioRecorderPlayer();  // one instance for all app - not rerender everytime

const MainFlowScreen = (props) => {


    const [text, setText] = useState(""); //text state
    const [soundPath, setSoundPath] = useState("");  //sound path state

    const [showSpinner, setShowSpinner] = useState(false);   //loading icon state
    const [isModalVisible, setModalVisible] = useState(false); //modal visibility
    const [isKeyboardVisible, setKeyboardVisible] = useState(false); // keyboard visibility state


    const [isSoundPlaying, setSoundPlaying] = useState(false);  //sound playing state - icon change
    const [isSoundRecorded, setSoundRecorded] = useState(false);  // sound recorded state - gif change
    const [isSoundRecording, setSoundRecording] = useState(false);  //sound recording state - icon change

    const [playedTime, setPlayedTime] = useState(null);   //sound played time state 
    const [imageObject, setImageObject] = useState(null);  // image object state
    const [mainFlowData, setMainFlowData] = useState(null);  // main flow data state while logging in


    const [soundDuration, setSoundDuration] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(null);  // current position of the audio state

    const [myTrack, setTrack] = useState(null);
    const [refreshing, setRefreshing] = useState(false);  //refreshing of the main flow state


    const clearPost = () => {  //cleaning of the post after sending the post succesfully

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

    const inputRef = useRef(null); //after opening modal, it will focus on text input directly

    const toggleModal = () => {   //opening and closing the modal due to its state
        setModalVisible(!isModalVisible);

        if (isModalVisible) { //while closing the modal, post also cleans
            clearPost();  
        }
    };

    useEffect(() => {

        getMainFlowData();  // loading the main flow

    //in order to not to go back with keyboard - go back means Indicator Screen 
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


    const getMainFlowData = () => {  //when component first loads
        setShowSpinner(true); //while loading the flow, a spinner spins in screen
        
        getMainFlow().then((res) => { 
            setShowSpinner(false);  //spiners disappear
            let data = res.data.data; //getting the date from API
            setMainFlowData(res.data.data); //changing the setMainFlow state

        }).catch(err => {
            setShowSpinner(false);  //spinner disappears
            console.log("Veriler Çekilemedi", err);
        })
    }


    const refreshData = () => {  
        setRefreshing(true);  // rn has its own spiiner for refreshing - loading icon spins in the screen with Flatlist
        getMainFlow().then((res) => {
            setRefreshing(false); 
            let data = res.data.data;  //getting the data from API  
            setMainFlowData(res.data.data); //changing the setMainFlow state
            
        }).catch(err => {
            setShowSpinner(false);
            console.log("Veriler Çekilemedi", err);
        })
    }
    




    const createPost = () => {  

        const body = new FormData();  //for multiple type of data body image,text and sound for HTTP 

        let soundFile = {
            uri: soundPath, 
            name: 'itssoundname',
            type: "audio/aac"
        }


        if (soundPath !== "") {  //if the soundPath is not empty, save it to HTTP body
            body.append('sound', soundFile);
        }

        if (imageObject?.uri) {  //if imageObject is not null, save it to HTTP body
            let imageFile = {
                uri: imageObject.uri,
                name: 'itsimagename',
                type: "image/png"
            }

            body.append('image', imageFile);
        }

        if (text) {
            body.append('text', text);  // if there is a text, save it to HTTP body
        }

        return body;

    }

    const runAfterSendProcedures = () => {  //after sending the post successfully
        setModalVisible(false);  //modal closes
        Alert.alert("Bilgi", "Gönderi başarıyla gönderildi!");
        clearPost();  //post cleans 
        getMainFlow().then((res) => {  //main flow refreshes
            let data = res.data.data;
            setMainFlowData(res.data.data);
            
        }).catch(err => console.log(err))
    }




    const sendPost = async () => { 
        let body = createPost();  //body is created
        if (body._parts.length == 0) {  // if the body is empty, then there is no image, sound or text in the post
            Alert.alert("Uyarı", "Lütfen bir yazı, ses ya da görsel paylaşınız!")
        } else {
            savePost(body)  //save the post
                .then(data => {
                    runAfterSendProcedures(); //cleans the post, refreshes the main flow, closes the modal
                })
                .catch(err => {
                    console.log("Hata", err);
                    Alert.alert("Hata", "Gönderi paylaşılamadı!");

                })
        }


    }




    onRecordStart = async () => {  //startRecording  

        const result = await audioRecorderPlayer.startRecorder(path, audioSet); //audioRecorderPplayer works with startRecorder func, needs for path and audio settings
        console.log("START Recording", result);

        setSoundPath(result); //saves and gives path to the setSoundPath state - icon changes

        setPlayedTime(0);  //progressbar becomes empty


        audioRecorderPlayer.addRecordBackListener((e) => {
            //Here we can set the duration by every second, on the last time of record we achieve duration.

        
            return;
        });
    }


    onRecordStop = async () => {
        const result = await audioRecorderPlayer.stopRecorder(); //recording stops - icon changes

        console.log("STOP Recording", result);
        audioRecorderPlayer.removeRecordBackListener(); //listener removes

        setSoundRecorded(true);  //sound is recorded - icon changes
        setSoundRecording(false); //sound recording is finished 


    }

    function format(time) { //thanks to library, it show the last recording length
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

    playSound = () => {     // 

        let soundPath = Platform.select({  // the sound files where in the OS
            android: "/" + path,
            ios: path
        });


        let basePath = Platform.select({   //the location saves in the OS
            android: '',
            ios: Sound.CACHES
        });



        let myInterval = setInterval(() => { // runs every 250 milisecond to update the progress bar with thick function - rn only gives finish info
            tick();
        }, 250)


        setSoundPlaying(true); //play the sound
        setPlayedTime(0);  //progress bar is 0

        const track = new Sound(soundPath, basePath, (e) => {   //plays the audio to the world
            if (e) {
                console.log('error loading track:', e)
            } else {
                setSoundDuration(format(track.getDuration())); // get the 

                track.play((success) => {  //sound playing finished 
                    if (success) {
                        setSoundPlaying(false);  //sound playing state becomes false -  sound is finished
                        clearInterval(myInterval); //interval cleans
                        setPlayedTime(1); //progress bar fully orange
                        console.log("Oynatma Tamamlandı");
                    } else {
                        clearInterval(myInterval);
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }
        });

        setTrack(track);

        function tick() { //progress bar updates for every 0.25 seconds - calculates the percentages 

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



    }

    stopSound = async () => { //stop sound 
        try {
            myTrack.stop();  //stop the playin audio
            setCurrentPosition(0);  // set progress bar to 0 
            setPlayedTime(0);  //set the played time state to 0
        } catch (error) {
            console.warn("Durdurma hatası 2", error);
        }

    }

    renderFlowItem = ({ item }) => (
        <FlowItem key={item} item={item} />
    );

    return (
        <Box flex={1}>

            {/* app header */}
            <AppHeader />  

            <Box flex={9}>


                <Box flex={8}  >
                    {
                        showSpinner ? //show spinner
                            <Box flex={1} justifyContent="center" alignItems="center">
                                <ActivityIndicator color="blue" />
                            </Box>

                            :

                            (mainFlowData?.posts) ?  
                                <FlatList  //if there are main flow
                                    refreshing={refreshing} //refreshing function works
                                    onRefresh={refreshData}  //refresh data state changes
                                    showsVerticalScrollIndicator={false} //spinner needs to set false otherwise spins to infinity
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingBottom: 100 }}
                                    data={mainFlowData.posts}
                                    renderItem={renderFlowItem}
                                    keyExtractor={item => item.id}
                                />
                                :
                                //if there is no main flow
                                <Box alignItems="center" flex={1} justifyContent="center"> 
                                    <RegularText>  
                                        Veri Bulunamadı!
                                </RegularText>
                                </Box>
                    }
                </Box>

                {
                    !isModalVisible &&  //if modal IS NOT visible 
                    <FAB
                        style={styles.fab}   //modal button for creating post - Floating Action Button
                        medium  //medium size 
                        icon="plus" //icon
                        onPress={toggleModal}  //opens modal - toggleModal function works
                    />
                }


            </Box>


            



            <Modal
                onBackdropPress={() => setKeyboardVisible(false)}  //no default backdrop -  custom backdrop created
                avoidKeyboard={true}  //no keyboard from library
                onModalShow={() => inputRef.current.focus()}
                coverScreen={false} //screen customized, no dafault
                swipeDirection="down"
                key={"chartModal"}
                isVisible={isModalVisible} //modal is visbile
                hasBackdrop={true}
                backdropOpacity={1}
                customBackdrop={ 
                    <View style={OS == "ios" ? {  //for iOS 
                        height: '100%',
                        backgroundColor: AppColors.background,
                    } :
                        {
                            backgroundColor: '#fff', //for Android
                            width: Dimensions.get('screen').height,
                            height: Dimensions.get('screen').height
                        }
                    } />
                }
            >
                <Box flex={1} > 

                    {/* icons for closing the modal and creating new post */}
                    <Box flexDirection="row" justifyContent="space-between">  

                        {/* closing the modal */}
                        <TouchableOpacity onPress={() => toggleModal()}> 
                            <Feather name="x" size={30} color={'black'} />  
                        </TouchableOpacity>

                         {/* posting a nre post */}
                        <TouchableOpacity onPress={sendPost}>
                            <Feather name="send" size={30} color={AppColors.button} />
                        </TouchableOpacity>

                    </Box>

                    <Box height={isKeyboardVisible ? "55%" : "90%"}> 
                    {/* if the keyboard is visible the screen will be 55% percent big and mic and camera icons moves to up , if not screen size is 90% */}

                        <Box flex={1} >

                            {/* Text area  */}
                            <TextInput
                                allowFontScaling={true}// scaling diffrent screen size
                                textAlignVertical="top"
                                padding={20}
                                ref={inputRef}
                                style={{ fontFamily: "LexendTera-Regular", backgroundColor: "rgba(255, 228, 196,0.4)", height: "90%", borderRadius: 20 }}
                                multiline={true}
                                value={text} //gets the text value
                                onChangeText={setText} //changes the state of the text and displays on the screen
                            />
                        </Box>

                        {
                            imageObject &&  //if there is an image object
                            <Box flex={0.25} p={3} flexDirection="row" alignItems="center" justifyContent="space-between"> 
                             {/* //displays */}
                                <Image
                                    style={{ width: '30%', height: '100%', borderRadius: 10 }}
                                    source={{ uri: imageObject.uri }} //
                                />
                                <TouchableOpacity onPress={() => setImageObject(null)} > 
                                 {/* delete the image, set the state to null */}
                                    <Feather name="x" size={30} color={AppColors.primary} />
                                </TouchableOpacity>
                            </Box>
                        }

                        <Box flexDirection="row">
                            {
                                isSoundRecorded ?   //is there is an sound
                                    <Box flex={1}>
                                        <Box width="100%" justifyContent="center" flexDirection="row">
                                            {
                                                !isSoundPlaying ?  //if sound is not playing
                                                    <TouchableOpacity onPress={() => { //when play button is pressed
                                                        playSound();  //play the sound with track func
                                                        setSoundPlaying(true); 
                                                    }}>
                                                        {/* display play button */}
                                                        <Feather name="play" size={30} color={AppColors.primary} /> 
                                                    </TouchableOpacity>
                                                    :
                                                    <TouchableOpacity onPress={() => { //if the sound is playing and pressed pause button
                                                        stopSound();  //stop the sound and change the icon to play
                                                        setSoundPlaying(false); //change the state 
                                                    }}>
                                                        {/* display pouse button */}
                                                        <Feather name="pause" size={30} color={AppColors.primary} />
                                                    </TouchableOpacity>
                                            }


                                            {/* displaying of progress bar */}
                                            <Box flex={1} justifyContent="center" alignItems="center">
                                                <Box width="100%">
                                                    <ProgressBar
                                                        style={{ width: "100%" }}
                                                        visible={true}
                                                        progress={playedTime}
                                                        color={"orange"} />
                                                </Box>
                                            </Box>


                                            {/* deleting the audio */}
                                            <TouchableOpacity onPress={() => {
                                                clearSound()  //deleting the sound
                                            }}>
                                                {/* putting the icon X for deleting */}
                                                <Feather name="x" size={30} color={AppColors.primary} /> 
                                            </TouchableOpacity>
                                        </Box>
                                            
                                            {/* displaying the length of the audio */}
                                        <Box alignItems="center" justifyContent="center">
                                            <RegularText fontSize="12">
                                                {currentPosition} 
                                            </RegularText>
                                        </Box>

                                    </Box>

                                    :
                                    isSoundRecording && //while recording the sound 

                                    <Box flex={1} alignItems="center" justifyContent="center">
                                        <Image
                                            style={{ width: 100, height: 100, borderRadius: 0 }}
                                            source={require('../../assets/recording.gif')} //display loading gif
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

                                    <TouchableHighlight   //while recording a sound
                                        activeOpacity={0.6}
                                        underlayColor="rgba(255, 228, 196, 0.2)"
                                        style={styles.attachButtonStyle}

                                        onPress={() => {
                                            onRecordStop();  //sound recording stops
                                            setSoundRecording(false);  //sound recording state changes
                                        }}>
                                            {/* mic icon becomes square icon  */}
                                        <Feather name="square" size={30} color={AppColors.primary} /> 
                                    </TouchableHighlight>


                                    :
                                    <TouchableHighlight  //while NOT recording a sound
                                        activeOpacity={0.6}
                                        underlayColor="rgba(255, 228, 196, 0.2)"
                                        style={styles.attachButtonStyle}
                                        onPress={() => { //when microphone button pressed
                                            onRecordStart()   //starting to record
                                            setSoundRecorded(false);  //set the sound recorded state false 
                                            setSoundRecording(true);  //set sound recording state true
                                        }}
                                    >
                                        {/* square icon becomes mic icon again */}
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