import React from 'react';
import { View } from 'react-native';

const CardItem = (props) => {
    return (
        <View style={[styles.itemStyle, props.style]}>
            {props.children}
        </View>
    );
};

const styles = {
    itemStyle: {
        //borderBottomWidth: 1,
        padding: 5,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        //borderColor: '#ddd',
        position: 'relative'
    }
};

export { CardItem };
