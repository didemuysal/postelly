import logoImage from '../../assets/app-logo.png'; 
import Box from './Box';
import { Image } from 'react-native';
import { BoldText, MediumText, RegularText } from './CustomText';
import React from 'react';
import { StyleSheet } from 'react-native';


const AppHeader = (props) => {
    const imageUri = Image.resolveAssetSource(logoImage).uri;  //app logo importing and assigning to imageUri
    const { style, ...rest } = props;


    let myStyle = (props.showBottomBorder) ? {   //additional styling
        ...style,  
        borderBottomWidth: 0
    } : style


    return (  
        <Box style={[styles.boxStyle, myStyle]} flex={1} justifyContent='center' alignItems="center" >

            <Image source={{ uri: imageUri }}
                style={{ width: 67, height: 38,  }}
            />
            

        </Box>
    )
}

const styles = StyleSheet.create({
    boxStyle: {
        borderBottomWidth: 0.5,
        borderBottomColor: "#d2d2d2",
    }
})

export default AppHeader