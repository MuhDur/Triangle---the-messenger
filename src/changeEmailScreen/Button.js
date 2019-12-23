import React from 'react';
import { Button } from 'react-native-elements';

const Buttons =({Function}) => {

  return (
    <Button
      onPress={Function}
      title="Change Email"
      color="#2196F3"
      textStyle={{ fontWeight: "700" }}
      buttonStyle={{
        backgroundColor: "#5c63d8",
        width: 250,
        height: 40,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 5,
      }}
    />
  );
};

export default Buttons;