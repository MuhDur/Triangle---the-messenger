import React from 'react';
import { Text, View, Image } from 'react-native';
import SettingsButton from './SettingsButton';


const styles = {
  viewStyle: {
    backgroundColor: '#f8f8f8',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    paddingTop: 15,
    paddingBottom:15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    elevation: 2,
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: '#5c63d8'
  },
  textStyle: {
    fontSize: 25,
  },
};

const Header = () => {
  const { textStyle, viewStyle } = styles;

  return (
    <View style={viewStyle}>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 10}}>
        <Image
          style={{width: 60, height: 50}}
          source={require('../images/TriangleAppLogo.png')}
        />
      </View>
      <View style={{ flex:1, flexDirection: 'row', justifyContent: 'center'}}>
      <Text style={textStyle}>Triangle</Text>
      </View>
      <View style={{flex: 1,flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',paddingRight: 10}}>
      <SettingsButton/>
      </View>
    </View>
  );
};


export default Header;
