import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <Text style={styles.textStyle}>{props.buttonText}</Text>
        </TouchableOpacity>

    );
};

const styles = {
    textStyle: {
        fontSize: 20,
        color: 'rgba(0, 0, 0, 0.9)'
    }
}

export { Button };
