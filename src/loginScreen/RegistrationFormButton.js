import React from 'react';
import { Button } from 'react-native-elements';

const RegistrationFormButton =({UserRegistrationFormFunction}) => {

  return (
    <Button
      onPress={UserRegistrationFormFunction}
      title="Create new account"
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

export default RegistrationFormButton;