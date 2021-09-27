import React from 'react';
import styled from 'styled-components/native';
import {
  BUTTON_BORDER_RADIUS,
  LIGHT_YELLOW,
  LIGHT_CYAN,
  PETROL,
  PRIMARY_BLUE,
  YELLOW,
  CYAN,
  GRAY_8,
  GRAY_25,
} from '../Config';
import {H2} from './fonts';
import Transaction from '../img/Transaction.svg';
import Spacer from './Spacer';
import TextBullet from './TextBullet';
import ChevronRight from '../img/ChevronRight.svg';
import ChevronRightWhite from '../img/ChevronRightWhite.svg';
import File from '../img/File.svg';
import Calendar from '../img/Calendar.svg';
import Bullet from './Bullet';
import Save from '../img/Save.svg';
import SaveDisabled from '../img/SaveDisabled.svg';
import Icon from './Icon';

const ButtonFrame = styled.TouchableHighlight`
  height: 56px;
  border-radius: ${BUTTON_BORDER_RADIUS};
  border-width: ${({noBorder}) => (noBorder ? '0px' : '1px')};
  border-color: ${({borderColor}) => (borderColor ? borderColor : YELLOW)};
  background-color: ${({color}) => (color ? color : PRIMARY_BLUE)}
  margin-horizontal: ${({noMargin}) => (noMargin ? '0px' : '24px')};
  elevation: 1;
`;

const ButtonFrameTop = styled.TouchableHighlight`
  height: 56px;
  border-top-right-radius: ${BUTTON_BORDER_RADIUS};
  border-top-left-radius: ${BUTTON_BORDER_RADIUS};
  border-bottom-width: ${({noBorder}) => (noBorder ? '0px' : '1px')};
  border-color: ${PRIMARY_BLUE};
  background-color: ${({color}) => (color ? color : LIGHT_YELLOW)}
  elevation: 1;
`;

// prettier-ignore
const ButtonFrameBottom = styled.TouchableHighlight`
  height: 56px;
  borderBottomRightRadius: ${BUTTON_BORDER_RADIUS};
  borderBottomLeftRadius: ${BUTTON_BORDER_RADIUS};
  backgroundColor: ${({color}) => color ? color : LIGHT_YELLOW}
  elevation: 1;
`;

// prettier-ignore
const Content = styled.View`
  flexDirection: row;
  justifyContent: space-between;
  paddingTop: 16px;
  paddingHorizontal: 20px;
`;

// prettier-ignore
const Centered = styled.View`
  flexDirection: row;
  justifyContent: center;
  paddingVertical: 13px;
`;

// prettier-ignore
export const Package = styled.View`
  flexDirection: row;
`;

const AskPaymentButton = ({
  amount,
  noMargin,
  onPress,
  disabled,
  color = LIGHT_YELLOW,
}) => (
  <ButtonFrame
    noMargin={noMargin}
    onPress={onPress}
    underlayColor={color}
    color={disabled ? GRAY_8 : color}
    borderColor={disabled ? GRAY_8 : YELLOW}>
    <Content>
      <Package>
        <Icon>
          <Transaction />
        </Icon>
        <Spacer size="12px" />
        <H2 color={PRIMARY_BLUE} marginTop="1px">
          Pyydä maksua
        </H2>
      </Package>
      <Package>
        <TextBullet text={amount} color={PRIMARY_BLUE} />
        <Spacer size="8px" />
        <Icon>
          <ChevronRight />
        </Icon>
      </Package>
    </Content>
  </ButtonFrame>
);

const ReadDecisionButton = ({onPress, isNew}) => (
  <ButtonFrameTop
    noMargin
    onPress={onPress}
    color={PETROL}
    underlayColor={PETROL}>
    <Content>
      <Package>
        <File />
        {isNew && <Bullet />}
        <Spacer size="12px" />
        <H2 color="white">Lue päätös</H2>
      </Package>
      <ChevronRightWhite />
    </Content>
  </ButtonFrameTop>
);

const SaveSessionsButton = ({onPress, disabled}) => (
  <ButtonFrameBottom
    noMargin
    onPress={disabled ? null : onPress}
    color={disabled ? GRAY_8 : PETROL}
    underlayColor={PETROL}>
    <Content>
      <Package>
        <Calendar />
        <Spacer size="12px" />
        <H2 color="white">Tallenna käyntikertoja</H2>
      </Package>
      <ChevronRightWhite />
    </Content>
  </ButtonFrameBottom>
);

const SaveAppointmentButton = ({onPress, disabled}) => (
  <ButtonFrame
    color={disabled ? GRAY_8 : LIGHT_CYAN}
    underlayColor={disabled ? GRAY_8 : LIGHT_CYAN}
    borderColor={disabled ? GRAY_8 : CYAN}
    noMargin
    onPress={disabled ? null : onPress}>
    <Centered>
      <Package>
        {disabled ? <SaveDisabled /> : <Save />}
        <Spacer />
        <H2 color={disabled ? GRAY_25 : PETROL}>Tallenna käyntikerta</H2>
      </Package>
    </Centered>
  </ButtonFrame>
);

export {
  AskPaymentButton,
  ReadDecisionButton,
  SaveSessionsButton,
  SaveAppointmentButton,
};
