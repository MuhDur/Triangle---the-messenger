import React from 'react';
import { View } from 'react-native';

const Card = (props) => {
    return (
        <View style={[styles.cardStyle, props.style]}>
            {props.children}
        </View>
    );
};
/*
    jedes Mal, wenn dem Event eine andere Komponente weitergegeben wird
    zeigt er aufs erste props -> = (props) =>
    und nimmt er es als props.children immer! -> Referenz
 */
const styles = {
    cardStyle: {
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        elevation: 1,
        marginTop: 5
    }
};

export { Card };
