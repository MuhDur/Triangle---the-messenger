import React, { Component } from 'react';
import { TextInput, View } from 'react-native';

const TextInputLogin =({onChangePassword, onChangeUsername}) => {

  return (
    <View>

      <TextInput

        // Adding hint in Text Input using Place holder.
        placeholder= "Username"

        onChangeText={onChangeUsername}

        // Making the Under line Transparent.
        underlineColorAndroid='transparent'

        style={styles.TextInputStyle}
      />

      <TextInput

        // Adding hint in Text Input using Place holder.
        placeholder= "Password"

        onChangeText={onChangePassword}

        secureTextEntry={true}

        // Making the Under line Transparent.
        underlineColorAndroid='transparent'

        style={styles.TextInputStyle}
      />


    </View>
  );
};



const styles = {
  TextInputStyle: {

    textAlign: 'center',
    marginBottom: 7,
    height: 40,
    width: 250,
    borderWidth: 1,
    // Set border Hex Color Code Here.
    borderColor: '#2196F3',
    // Set border Radius.
    borderRadius: 5 ,

  }

};

export default TextInputLogin;