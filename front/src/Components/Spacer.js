import styled from 'styled-components/native';

export default styled.View`
  width: ${({size}) => (size ? size : '16px')};
  height: ${({size}) => (size ? size : '16px')};
`;
