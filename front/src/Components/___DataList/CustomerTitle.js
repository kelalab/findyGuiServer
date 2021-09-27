import React from 'react';
import styled from 'styled-components/native';
import { GRAY_75, GRAY_8 } from '../../Config';
import { H3 } from '../fonts';

// prettier-ignore
const Container = styled.View`
  backgroundColor: ${GRAY_8};
  flex-direction: row;
  justifyContent: space-between;
  paddingHorizontal: 24px;
  paddingVertical: 8px;
`;

export default () => (
  <Container>
    <H3 color={GRAY_75}>Asiakkaan nimi</H3>
    <H3 color={GRAY_75}>Lähettämättä</H3>
  </Container>
);
