import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { Card, CardItem } from 'native-base';

const ManagerEvents = (props) => {
    return (
      <TouchableOpacity onPress={props.onPress}>
        <Card>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <CardItem>
                    <Text style={{ fontSize: 20, color: 'black' }}>{props.event.name}</Text>
                </CardItem>
                <CardItem>
                    <TouchableOpacity onPress={props.onIconPress}>
                        <Icon
                            name="delete"
                            size={30}
                            color='	rgba(0, 177, 94, 0.7)'
                        />
                    </TouchableOpacity>
                </CardItem>
            </View>
        </Card>
      </TouchableOpacity>
    );
};

export default ManagerEvents;
// <Button buttonText={props.event.name} onPress={props.onPress} />
