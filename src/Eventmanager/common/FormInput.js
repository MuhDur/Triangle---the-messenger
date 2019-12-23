import React from 'react';
import { TextInput, View, Text } from 'react-native';

const FormInput = ({ label, value, onChangeText, autoFocus }) => {
    const { inputStyle, labelStyle, viewStyle } = styles;

    return (
        <View style={viewStyle}>
            <Text style={labelStyle}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                style={inputStyle}
                maxLength={30}
                autoCapitalize="sentences"
                autoFocus={autoFocus}
                autoCorrect={false}
                underlineColorAndroid="black"
            />
        </View>
    );
};

const styles = {
    inputStyle: {
        color: 'rgba(0, 0, 0, 0.7)',
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: 18,
        lineHeight: 23,     // nicht fontSize.. hebt den Text hervor
        flex: 2,     // proportion,
        height: 40,
        width: 100
    },
    labelStyle: {
        fontSize: 18,
        color: 'rgba(0, 0, 0, 0.9)',
        paddingLeft: 20,
        flex: 1
    },
    viewStyle: {
        flex: 1,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center'
    }
};

export { FormInput };
