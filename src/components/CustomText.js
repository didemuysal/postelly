import { Text } from 'react-native';
import styled from 'styled-components/native';


//default specialized text component for applicaiton
const RegularText = styled(Text)`
    fontSize: ${props => props.fontSize ? props.fontSize : '18px'};
    color: ${props => props.color ? props.color : 'black'};    
    font-family:'LexendTera-Regular';
`
const BoldText = styled(Text)`
    fontSize: ${props => props.fontSize ? props.fontSize : '18px'};    
    color: ${props => props.color ? props.color : 'black'};
    font-family:'LexendTera-Regular';
`
const MediumText = styled(Text)`
    fontSize: ${props => props.fontSize ? props.fontSize : '18px'};  
    color: ${props => props.color ? props.color : 'black'};  
    font-family:'LexendTera-Regular';
`


export {
    RegularText,
    BoldText,
    MediumText
}
