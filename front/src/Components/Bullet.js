import styled from 'styled-components/native/dist/styled-components.native.esm';
import { PRIMARY_YELLOW } from '../Config';

// prettier-ignore
export default styled.View`
  height: 10px;
  width: 10px;
  borderRadius: 5px;
  backgroundColor: ${({color}) => color ? color : PRIMARY_YELLOW}
`;
