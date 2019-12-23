import React from 'react';
import { Button } from 'react-native-elements';

const Buttons =({Function, title}) => {

  return (
    <Button
      onPress={Function}
      title= {title}
      color="#2196F3"
      textStyle={{ fontWeight: "700" }}
      buttonStyle={{
        backgroundColor: "transparent",
        height: 40,
        width: 250,
        borderColor: "#5c63d8",
        borderWidth: 1,
        borderRadius: 5,
      }}
    />
  );
};

export default Buttons;