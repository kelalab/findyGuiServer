import React from 'react';
import { Button, Text, TouchableHighlight, View } from 'react-native';
import { H2, Paragraph } from './fonts';
import { BLUE, GRAY_12, GRAY_25, GRAY_45, GRAY_8, PRIMARY_BLUE, PRIMARY_YELLOW } from '../Config';
import Spacer from './Spacer';
import styled from 'styled-components/native';
import Bullet from './Bullet';
import { getDefaultLibFileName } from 'typescript';

export default ({ item, onPress, expanded }) => {
    console.log(item, onPress, expanded);
    if (!item) {
        return null;
    }
    const { archived = false, title, newItem } = item;
    const color = archived ? GRAY_45 : 'black';
    //const { customer, appointments, onPress } = props;
    //const { firstName, lastName, newActions, id } = customer;

    const Name = styled.View`
    z-index: 2;
  `;

    const BulletContainer = styled.View`
    padding-top: 6px;
    padding-left: 8px;
  `;

    const TitleWrapper = styled.View`
    padding-top: 16px;
    padding-horizontal: 8px;
    min-height: 64px;
    display: flex;
    justify-content: flex-end;
    border-top-right-radius: 8px;

  `;

    const Wrapper = styled.View`
    color: black;
    background-color: ${BLUE}
    margin: 16px;
    flex: 1;
    border-left-width: 8px;
    border-left-color: ${PRIMARY_YELLOW};
    border-radius: 8px;
    overflow: hidden;
  `;

    const Test = styled.TouchableHighlight`
        flex: 0.5;
    `;

    const ActionsBullet = () => (
        <BulletContainer>
            <Bullet />
        </BulletContainer>
    );

    const TopRight = styled.View`
        position: absolute;
        top: 4px;
        right: 8px;
    `;

    const CurvedBG = styled.View`
        background-color: ${PRIMARY_BLUE};
        border-bottom-left-radius: 2000px;
        border-bottom-right-radius: 2000px;
        transform: scale(1,0.5);
        position: absolute;
        width: 100%;
        height: 100%;
        top: -25%;
    `;

    const DateLabel = styled.Text`
        color: white;
        z-index: 3;
        font-size: 12px;
        margin-left: 4px;
        margin-top: 2px;
        position: absolute;
    `;

    return (
        <Test onPress={e => onPress(e)}>
            <Wrapper>
                <CurvedBG/>
                <Name>
                    <DateLabel>
                        20.9.2021
                    </DateLabel>
                </Name>
                <TitleWrapper>
                    <Name>
                        <H2 color={'white'} size={'13px'}>{title}</H2>
                        <Spacer size="4px" />
                    </Name>  
                    <TopRight>
                        {newItem ? <ActionsBullet /> : null}
                    </TopRight>
                </TitleWrapper>
                
            </Wrapper>
        </Test>
    );
};
