import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Card, CardItem } from 'native-base';

const UserEvents = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Card>
          <CardItem>
              <Text style={{ fontSize: 20, color: 'black' }}>{props.event.name}</Text>
          </CardItem>
      </Card>
    </TouchableOpacity>
  );
};

export default UserEvents;
