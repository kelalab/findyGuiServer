import React from 'react';
import {Platform} from 'react-native';

const Icon = ({children}) => {
  if (Platform.OS === 'web') {
    return <img src={children.type} {...children.props} />;
  }
  return children;
};

export default Icon;
