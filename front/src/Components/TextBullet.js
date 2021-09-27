import React from 'react';
import styled from 'styled-components/native';
import {H2} from './fonts';

// prettier-ignore
const Bullet = styled.View`
  height: 24px;
  width: ${({width}) => width};
  borderRadius: 12px;
  backgroundColor: ${({color}) => color};
  flexDirection: row;
  alignContent: center;
  justifyContent: center;
  paddingTop: 1px;
`;

export default ({color, text, textColor}) => (
  <Bullet color={color} width={text > 9 ? '31px' : '24px'}>
    <H2 color={textColor ? textColor : 'white'}>{text}</H2>
  </Bullet>
);
