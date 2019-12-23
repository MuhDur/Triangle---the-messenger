import React from 'react';
import { View, Text } from 'react-native';
//import { Icon } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import CrownIcon from 'react-native-vector-icons/MaterialCommunityIcons';
//import { CardItem } from 'native-base';
import { CardItem } from '../common';

// style={{ transform: [{ rotate: '315deg' }] }}

const UserList = ({ name, surname, voted, manager }) => {
    return (
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <View style={{ flexDirection: 'row' }}>
                <CardItem>
                  {
                      manager &&
                      <View style={{ marginRight: -10 }}>
                          <CrownIcon
                              style={{ transform: [{ rotate: '315deg' }] }}
                              name="crown"
                              size={13}
                              color="#FFD700"
                          />
                      </View>
                  }
                    <Text style={styles.textStyle}>{name.concat(' ', surname)}</Text>
                </CardItem>
            </View>
            <CardItem>
                {
                    voted &&
                    <Icon name="md-checkmark" size={20} color="#00B15E" />
                }
            </CardItem>
        </View>
    );
};

const styles = {
    textStyle: {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.9)',
        marginLeft: 10
    }
};

export default UserList;
