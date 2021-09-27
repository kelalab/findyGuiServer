import ToggleButton from './ToggleButton';
import {H2} from './fonts';
import Close from '../img/Close.svg';
import React from 'react';

export default ({onPress}) => (
  <ToggleButton onPress={onPress}>
    <H2>Sulje</H2>
    <Close />
  </ToggleButton>
);
