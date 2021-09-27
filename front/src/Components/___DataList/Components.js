import React from 'react';
import styled from 'styled-components/native/dist/styled-components.native.esm';
import { GRAY_8, LIGHT_YELLOW, CUSTOMER_NAME_FONT_SIZE } from '../../Config';
import Bullet from '../Bullet';
import { AskPaymentButton } from '../Buttons';

// prettier-ignore
export const CustomersContainer = styled.View`
  flex: 1;
  flexDirection: column;
  justifyContent: space-between;
  backgroundColor: white;
`;

// prettier-ignore
export const CustomerContainer = styled.View`
  paddingVertical: 17px;
  paddingHorizontal: 24px;
  borderBottomColor: ${GRAY_8};
  borderBottomWidth: 1px;
  backgroundColor: white;
  flexDirection: row;
  justifyContent: space-between;
`;

// prettier-ignore
export const Name = styled.View`
  flexDirection: row;
`;

// prettier-ignore
const BulletContainer = styled.View`
  paddingTop: 6px;
  paddingLeft: 8px;
`;

export const ActionsBullet = () => (
  <BulletContainer>
    <Bullet />
  </BulletContainer>
);

// prettier-ignore
export const NameText = styled.Text`
  fontSize: ${CUSTOMER_NAME_FONT_SIZE};
  fontWeight: ${({bold}) => bold ? 'bold' : 'normal'};
  color: black;
  marginLeft: 4px;
`;

// prettier-ignore
const ButtonFrame = styled.View`
  height: 88px;
  paddingVertical = 16px;
  paddingHorizontal = 24px;
  backgroundColor = white;
  flexDirection: column;
  justifyContent: center;
`;

export const PaymentButton = ({ amount }) => (
  <ButtonFrame>
    <AskPaymentButton
      amount={amount}
      color={LIGHT_YELLOW}
      disabled={amount < 1}
    />
  </ButtonFrame>
);

// prettier-ignore
export const SettingsView = styled.View`
  flex: 1;
  paddingVertical: 24px;
  paddingHorizontal: 48px;
  backgroundColor: white;
  marginTop: ${({marginTop}) => marginTop};
`;

// prettier-ignore
export const SwitchView = styled.View`
  flexDirection: row;
  justifyContent: space-between;
  marginTop: 30px;
`;
