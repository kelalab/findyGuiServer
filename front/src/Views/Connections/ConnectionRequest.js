import React, { useState } from 'react';
import { Button, Text, Dimensions, View } from "react-native"
import styled from 'styled-components';
import { H2 } from '../../Components/fonts';
import { PRIMARY_BLUE, PRIMARY_YELLOW } from '../../Config';

const Wrapper = styled.View`
    z-index: 2;
    position: absolute;
    width: 100%;
    height: ${Dimensions.get('window').height}px;
    top: 0;
    bottom: 0;
    shadow-offset: -2px;
    shadow-color: black;
    shadow-radius: 3px;
    shadow-opacity: 0.4;
    elevation: 5;
`;

const PanelHeader = styled.View`
    background-color: ${PRIMARY_BLUE};
    display: flex;
    padding-top: 16px;
    padding-horizontal: 16px;
    justify-content: flex-end;
`;

const PanelBody = styled.View`
`;

const PanelWrapper = styled.View`
    background-color: white;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
`;

export default ({request}) => {
    /*const [open, setopen] = useState(true);
    const [topVal, setTopVal] = useState(new Animated.Value(10000));*/
    const close = () => {
        //setopen(false);
        console.log('close');
    }
    /*let animValue = 10000;
    if(!open){
        Animated.timing(
            topVal,{
                toValue: animValue,
                duration: 2000,
                useNativeDriver: true
            },
        ).start()
    }else{
        animValue = 100;
        Animated.timing(
            topVal,{
                toValue: animValue,
                duration: 2000,
                useNativeDriver: true
            },
        ).start()
    }

    console.log(open);*/
    return (
        <Wrapper>
            {/*<Animated.View style={{transform:[{translateY:topVal}]}}>*/}
            <PanelWrapper>
                <PanelHeader>
                    <H2 color='white'>Pyyntö
                    </H2>
                    <View>
                        <Button title="sulje" onPress={close}></Button>
                    </View>
                </PanelHeader>
                <PanelBody>
                    <Text>Haluaa bla bla bla</Text>
                </PanelBody>
            </PanelWrapper>
            {/*</Animated.View>*/}
        </Wrapper> 
    );
}