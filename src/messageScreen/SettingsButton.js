import React from 'react';
import { Button,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';

const SettingsButton =() => {

  return (
    <TouchableOpacity onPress={Actions.Settings}>
      <Icon name='md-settings' size={50} color="black" />
    </TouchableOpacity>
  );
};

export default SettingsButton;