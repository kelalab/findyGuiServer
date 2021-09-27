import React from 'react';
import styled from 'styled-components/native';
import { GRAY_3, GRAY_12, PRIMARY_BLUE } from '../../Config';
import { H2 } from '../../Components/fonts';

// prettier-ignore
const Container = styled.View`
  backgroundColor: ${GRAY_3};
  paddingHorizontal: 16px;
  paddingVertical: 12px;
  alignItems: center;
`;

// prettier-ignore
const ButtonsBox = styled.View`
  backgroundColor: ${GRAY_12};
  flexDirection: row;
  height: 32px;
  borderRadius: 7px;
  padding: 2px;
`;

// prettier-ignore
const Button = styled.TouchableHighlight`
  backgroundColor: ${({isSelected}) => isSelected ? 'white' : GRAY_12};
  width: 172px;
  height: 28px;
  borderRadius: 5px;
  justifyContent: center;
  alignItems: center;
`;

export default ({ setPage, page }) => {
  return (
    <Container>
      <ButtonsBox>
        <Button
          isSelected={page === 'names'}
          onPress={() => setPage('names')}
          underlayColor="white">
          <H2 color={page === 'names' ? PRIMARY_BLUE : 'black'}>Nimet</H2>
        </Button>
        <Button
          isSelected={page === 'months'}
          onPress={() => setPage('months')}
          underlayColor="white">
          <H2 color={page === 'months' ? PRIMARY_BLUE : 'black'}>Kuukaudet</H2>
        </Button>
      </ButtonsBox>
    </Container>
  );
};
