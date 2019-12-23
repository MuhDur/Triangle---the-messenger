import React, { Component } from 'react';
import { TextInput, View } from 'react-native';

const TextInputAddFriend =({ onChangeAddFriend }) => {

  return (
    <View>

      <TextInput

        // Adding hint in Text Input using Place holder.
        placeholder= "Add Friend"

        onChangeText={onChangeAddFriend}

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

export default TextInputAddFriend;