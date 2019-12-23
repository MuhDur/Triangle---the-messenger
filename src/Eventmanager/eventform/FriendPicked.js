import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { CardItem } from 'native-base';
//import { CardItem } from '../common';

const FriendPicked = ({ friend, onDelete }) => {
    return (
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <CardItem>
                <Text style={styles.textStyle}>{friend.name.concat(' ', friend.surname)}</Text>
            </CardItem>
            <CardItem>
                <Icon
                    name="clear"
                    color='#00B15E'
                    onPress={onDelete}
                />
            </CardItem>
        </View>
    );
};

const styles = {
    textStyle: {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.9)',
        paddingLeft: 17
    }
};

export default FriendPicked;

