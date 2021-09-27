import React, { Component } from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { H1, H2 } from '../../Components/fonts';
import { SettingsView, SwitchView } from './Components';
import { Switch, Platform } from 'react-native';
import { GRAY_75, GRAY_8, LIGHT_CYAN, PETROL } from '../../Config';
import CloseButton from '../../Components/CloseButton';

const getTopMargin = () => {
  const headerSize = Platform.OS === 'ios' ? getStatusBarHeight() + 48 : 48;
  return `${headerSize}px`;
};

class SettingsPage extends Component {
  render() {
    const { showArchived } = this.props;
    const topMargin = getTopMargin();

    return (
      <SettingsView marginTop={topMargin}>
        <CloseButton onPress={this.props.toggle} />
        <H1>Asetukset</H1>
        <SwitchView>
          <H2>Näytä arkistoidut</H2>
          <Switch
            trackColor={{ false: GRAY_8, true: LIGHT_CYAN }}
            thumbColor={{ false: GRAY_75, true: PETROL }}
            ios_backgroundColor={GRAY_8}
            value={showArchived}
            onValueChange={this.props.toggleArchived}
          />
        </SwitchView>
      </SettingsView>
    );
  }
}

export default SettingsPage;
