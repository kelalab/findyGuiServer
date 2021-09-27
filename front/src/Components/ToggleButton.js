import styled from 'styled-components/native/';
import {BUTTON_BORDER_RADIUS, GRAY_45} from '../Config';

// prettier-ignore
export default styled.Pressable`
  alignSelf: flex-end;
  flexDirection: row;
  borderWidth: 1px
  borderColor: ${GRAY_45};
  padding: 5px;
  borderRadius: ${BUTTON_BORDER_RADIUS};
`;
