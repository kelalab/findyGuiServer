import React from 'react';
import { Button, Text, TouchableHighlight, View } from 'react-native';
import { H2, Paragraph } from './fonts';
import { GRAY_12, GRAY_25, GRAY_45, GRAY_8, PRIMARY_BLUE } from '../Config';
import Spacer from './Spacer';
import styled from 'styled-components/native';
import Bullet from './Bullet';

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
    flex-direction: row;
  `;

    const BulletContainer = styled.View`
    padding-top: 6px;
    padding-left: 8px;
  `;

    const ItemWrapper = styled.View`
    padding-vertical: 8px;
    border-top-width: 1px;
    border-bottom-width: 1px;
    border-color: ${GRAY_12};
    flex-direction: row;
    justify-content: space-between;
    padding-right: 12px;
  `;

    const Wrapper = styled.View`
    padding-horizontal: 4px;
  `;

    const ExpansionWrapper = styled.View`
    margin-top: 8px;
    padding-bottom: 8px;
  `;

    const ActionsBullet = () => (
        <BulletContainer>
            <Bullet />
        </BulletContainer>
    );

    return (
        <TouchableHighlight onPress={e => onPress(e)}>
            <Wrapper>
                <ItemWrapper>
                    <Name>
                        <H2 color={color}>{title}</H2>
                        <Spacer size="4px" />
                    </Name>
                    {newItem ? <ActionsBullet /> : null}
                </ItemWrapper>
                {expanded ? (
                    <ExpansionWrapper>
                        <Text>MOAR STUFF</Text>
                        <Button title="Poista"></Button>
                    </ExpansionWrapper>
                ) : null}
            </Wrapper>
        </TouchableHighlight>
    );
};
