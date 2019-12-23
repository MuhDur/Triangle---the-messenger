// Bibliotheken importieren um die Komponente erstellen zu können
import React from 'react';
import { Text, View } from 'react-native';
// Komponente erzeugen
const Header = (props) => {
    const { textStyle, viewStyle } = styles;
    return (
        <View style={viewStyle}>
            <Text style={textStyle}>{props.txtHeader}</Text>
        </View>
    );
};

const styles = {
    viewStyle: {
        backgroundColor: '#EBEEFF',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: 100,
        paddingTop: 15,
        paddingBottom: 5,
        elevation: 2,
        position: 'relative',
        marginBottom: 5
    },
    textStyle: {
        fontSize: 20
    }
};

// Komponente nach außen freigeben
export { Header };
