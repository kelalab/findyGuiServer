import styled from 'styled-components/native';
import {PRIMARY_BLUE} from '../Config';

// prettier-ignore
const H1 = styled.Text`
  fontStyle: normal;
  fontWeight: bold;
  fontSize: 17px;
  lineHeight: 22px;
  color: ${({color}) => color ? color : 'black'};
`;

// prettier-ignore
const H2 = styled.Text`
  fontStyle: normal;
  fontWeight: 700;
  fontSize: ${({size}) => size?size:'15px'};
  lineHeight: 22px;
  color: ${({color}) => color ? color : 'black'};
  marginTop: ${({marginTop}) => marginTop ? marginTop : '0px'};
`;

// prettier-ignore
const H3 = styled.Text`
  fontStyle: normal;
  fontWeight: 500;
  fontSize: 13px;
  lineHeight: 15.6px;
  color: ${({color}) => color ? color : 'black'};
`;

// prettier-ignore
const H4 = styled.Text`
  fontStyle: normal;
  fontSize: 10px;
  lineHeight: 10px;
  color: ${({color}) => color ? color : 'black'};
`;

// prettier-ignore
const Paragraph = styled.Text`
  fontStyle: normal;
  fontSize: 15px;
  fontWeight: 400;
  lineHeight: 22px;
  color: ${({color}) => color ? color : 'black'};
`;

// prettier-ignore
const ViewHeading = styled.Text`
  fontStyle: normal;
  fontSize: 17px;
  fontWeight: 700;
  lineHeight: 22px;
  color: ${({color}) => color ? color : 'black'};
`;

// prettier-ignore
const Title = styled.Text`
  fontStyle: normal;
  fontSize: 16px;
  fontWeight: bold;
  lineHeight: 22px;
  color: ${({color}) => color ? color : 'black'};
`;

// prettier-ignore
const PaymentSum = styled.Text`
  fontStyle: normal;
  fontSize: 32px;
  fontWeight: 700;
  lineHeight: 38px;
  color: ${PRIMARY_BLUE};
`;

export {H1, H2, H3, H4, Paragraph, ViewHeading, Title, PaymentSum};
