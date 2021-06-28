
import { View } from 'react-native';
import styled from 'styled-components';  //components created with styled components

import {
   
    compose,
    color,
    size,
    space,
    border,
    flexbox,
    borderRadius
} from 'styled-system';

//props for Box component
const Box = styled(View)(
    compose(
        flexbox,
        color,
        size,
        space,
        border,
        flexbox,
        borderRadius
    )
)

export default Box;
